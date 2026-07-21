"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2, Phone, ShieldCheck, FileCheck, CheckCircle2, Download } from "lucide-react";
import { sendWhatsappOTP, verifyWhatsappOTP, signContract } from "@/actions/contracts";
import { toast } from "sonner";

const SignatureCanvas = dynamic(() => import("react-signature-canvas"), { 
  ssr: false, 
  loading: () => <div className="h-48 w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Cargando lienzo...</div> 
});

export default function SignatureFlow({ contract }: { contract: any }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [phone, setPhone] = useState(contract.lead?.phone || "");
  const [otp, setOtp] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const sigCanvas = useRef<any>(null);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return toast.error("Ingresa tu número de teléfono");
    
    setLoading(true);
    const res = await sendWhatsappOTP(contract.token, phone);
    setLoading(false);

    if (res.success) {
      toast.success("Código enviado por WhatsApp");
      setStep(2);
    } else {
      toast.error(res.error || "Error al enviar el código. Revisa el número.");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) return toast.error("Ingresa el código completo");
    
    setLoading(true);
    const res = await verifyWhatsappOTP(contract.token, phone, otp);
    setLoading(false);

    if (res.success) {
      toast.success("Identidad verificada");
      setStep(3);
    } else {
      toast.error(res.error || "Código incorrecto");
    }
  };

  const handleSign = async () => {
    if (!idNumber) return toast.error("Debes ingresar tu Teudat Zehut / Pasaporte");
    if (sigCanvas.current?.isEmpty()) return toast.error("Debes dibujar tu firma");

    setLoading(true);
    try {
      const signatureBase64 = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      
      // Get Client IP
      let ip = "Desconocida";
      try {
        const ipRes = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch (e) {
        console.warn("No se pudo obtener la IP del cliente");
      }

      const res = await signContract(contract.token, signatureBase64, idNumber, ip, phone);
      
      if (res.success) {
        setPdfUrl(res.pdfUrl);
        setStep(4);
        triggerConfetti();
      } else {
        toast.error(res.error || "Error al guardar la firma");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      const end = Date.now() + 3 * 1000;
      const colors = ['#2563eb', '#3b82f6', '#10b981'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    });
  };

  if (step === 1) {
    return (
      <form onSubmit={handleRequestOTP} className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Verificación de Identidad</h2>
        <p className="text-slate-500">Para acceder al contrato, verificaremos tu número de WhatsApp.</p>
        
        <div className="text-left max-w-xs mx-auto">
          <label className="block text-sm font-medium text-slate-700 mb-1">Tu Número de WhatsApp</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+972501234567"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center text-lg tracking-wider"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Enviar Código"}
        </button>
      </form>
    );
  }

  if (step === 2) {
    return (
      <form onSubmit={handleVerifyOTP} className="space-y-6 text-center animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Ingresa el Código</h2>
        <p className="text-slate-500">Te enviamos un código de 4 dígitos por WhatsApp al {phone}.</p>
        
        <div className="max-w-xs mx-auto">
          <input 
            type="text" 
            maxLength={4}
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="0000"
            className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none transition-all text-center text-4xl tracking-[1em] font-mono"
          />
        </div>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button 
            type="submit" 
            disabled={loading || otp.length < 4}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Verificar Código"}
          </button>
          <button 
            type="button" 
            onClick={() => setStep(1)}
            className="text-slate-500 text-sm hover:text-slate-800"
          >
            Cambiar número
          </button>
        </div>
      </form>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Revisión del Contrato</h2>
          <p className="text-slate-500">Por favor revisa las condiciones antes de firmar.</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-sm text-slate-700">
          <p><strong className="text-slate-900">Cliente:</strong> {contract.lead.name}</p>
          <p><strong className="text-slate-900">Propiedad:</strong> {contract.property.title} ({contract.property.location})</p>
          <p><strong className="text-slate-900">Comisión Acordada:</strong> {Number(contract.commissionRate)}% + IVA</p>
          <div className="border-t border-slate-200 pt-4 mt-4">
            <p className="text-xs text-slate-500 italic">
              {contract.terms || "El cliente se compromete a abonar los honorarios de corretaje si adquiere o alquila la propiedad mencionada, de acuerdo con la Ley de Corredores de Bienes Raíces de 1996."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ingresa tu Teudat Zehut (ID)</label>
            <input 
              type="text" 
              value={idNumber} 
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Ej: 012345678"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Dibuja tu firma aquí</label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-slate-50">
              <SignatureCanvas 
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ className: "w-full h-48 cursor-crosshair touch-none" }}
              />
            </div>
            <div className="flex justify-end mt-2">
              <button 
                onClick={() => sigCanvas.current?.clear()}
                className="text-sm text-slate-500 hover:text-red-500"
              >
                Borrar Firma
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSign}
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Aceptar y Firmar"}
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6 py-8 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={48} />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-slate-800">¡Firma Completada!</h2>
        <p className="text-slate-500 mt-2">El acuerdo ha sido firmado exitosamente con total validez legal.</p>
      </div>
      
      {pdfUrl && (
        <a 
          href={pdfUrl} 
          download
          target="_blank"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all mt-4"
        >
          <Download size={20} />
          Descargar Copia (PDF)
        </a>
      )}
    </div>
  );
}
