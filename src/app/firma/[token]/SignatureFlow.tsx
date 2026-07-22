"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2, Phone, ShieldCheck, FileCheck, CheckCircle2, Download } from "lucide-react";
import { sendVerificationOTP, verifyOTP, signContract } from "@/actions/contracts";
import { toast } from "sonner";
import { Mail } from "lucide-react";

const SignatureCanvas = dynamic(() => import("react-signature-canvas"), { 
  ssr: false, 
  loading: () => <div className="h-48 w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Cargando lienzo...</div> 
});

const uiTranslations: Record<string, any> = {
  es: {
    step1Title: "Verificación de Identidad",
    step1Desc: "Para acceder al contrato, verificaremos tu identidad.",
    step1MethodLabel: "Recibir código por:",
    step1LabelPhone: "Tu Número de WhatsApp",
    step1LabelEmail: "Tu Correo Electrónico",
    step1PlaceholderPhone: "+972501234567",
    step1PlaceholderEmail: "ejemplo@correo.com",
    step1Btn: "Enviar Código",
    
    step2Title: "Ingresa el Código",
    step2Desc: "Te enviamos un código de 4 dígitos a {identifier}.",
    step2Btn: "Verificar Código",
    step2ChangePhone: "Cambiar método",
    
    step3Title: "Revisión del Contrato",
    step3Desc: "Por favor revisa las condiciones antes de firmar.",
    step3Client: "Cliente:",
    step3Prop: "Propiedad:",
    step3Comm: "Comisión Acordada:",
    step3DefaultTerms: "El cliente se compromete a abonar los honorarios de corretaje si adquiere o alquila la propiedad mencionada, de acuerdo con la Ley de Corredores de Bienes Raíces de 1996.",
    step3IdLabel: "Ingresa tu Teudat Zehut / Pasaporte",
    step3IdPlaceholder: "Ej: 012345678",
    step3SignLabel: "Dibuja tu firma aquí",
    step3ClearSign: "Borrar Firma",
    step3SignBtn: "Aceptar y Firmar",
    
    step4Title: "¡Firma Completada!",
    step4Desc: "El acuerdo ha sido firmado exitosamente con total validez legal.",
    step4Btn: "Descargar Copia (PDF)",
    
    errNoPhone: "Ingresa tu número de teléfono",
    msgCodeSent: "Código enviado por WhatsApp",
    errCodeSent: "Error al enviar el código. Revisa el número.",
    errIncompleteCode: "Ingresa el código completo",
    msgIdVerified: "Identidad verificada",
    errIncorrectCode: "Código incorrecto",
    errNoId: "Debes ingresar tu documento de identidad",
    errNoSign: "Debes dibujar tu firma",
    errSaveSign: "Error al guardar la firma",
    errUnexpected: "Ocurrió un error inesperado"
  },
  en: {
    step1Title: "Identity Verification",
    step1Desc: "To access the contract, we will verify your identity.",
    step1MethodLabel: "Receive code via:",
    step1LabelPhone: "Your WhatsApp Number",
    step1LabelEmail: "Your Email Address",
    step1PlaceholderPhone: "+972501234567",
    step1PlaceholderEmail: "example@email.com",
    step1Btn: "Send Code",
    
    step2Title: "Enter the Code",
    step2Desc: "We sent a 4-digit code to {identifier}.",
    step2Btn: "Verify Code",
    step2ChangePhone: "Change method",
    
    step3Title: "Contract Review",
    step3Desc: "Please review the conditions before signing.",
    step3Client: "Client:",
    step3Prop: "Property:",
    step3Comm: "Agreed Commission:",
    step3DefaultTerms: "The client agrees to pay the brokerage fees if they acquire or rent the mentioned property, in accordance with the Real Estate Brokers Law of 1996.",
    step3IdLabel: "Enter your ID / Passport",
    step3IdPlaceholder: "Ex: 012345678",
    step3SignLabel: "Draw your signature here",
    step3ClearSign: "Clear Signature",
    step3SignBtn: "Accept and Sign",
    
    step4Title: "Signature Completed!",
    step4Desc: "The agreement has been successfully signed with full legal validity.",
    step4Btn: "Download Copy (PDF)",
    
    errNoPhone: "Enter your phone number",
    msgCodeSent: "Code sent via WhatsApp",
    errCodeSent: "Error sending the code. Check the number.",
    errIncompleteCode: "Enter the complete code",
    msgIdVerified: "Identity verified",
    errIncorrectCode: "Incorrect code",
    errNoId: "You must enter your ID / Passport",
    errNoSign: "You must draw your signature",
    errSaveSign: "Error saving signature",
    errUnexpected: "An unexpected error occurred"
  },
  he: {
    step1Title: "אימות זהות",
    step1Desc: "כדי לגשת לחוזה, נאמת את זהותך.",
    step1MethodLabel: "קבל קוד דרך:",
    step1LabelPhone: "מספר ה-WhatsApp שלך",
    step1LabelEmail: "כתובת האימייל שלך",
    step1PlaceholderPhone: "+972501234567",
    step1PlaceholderEmail: "example@email.com",
    step1Btn: "שלח קוד",
    
    step2Title: "הזן את הקוד",
    step2Desc: "שלחנו קוד בן 4 ספרות ל-{identifier}.",
    step2Btn: "אמת קוד",
    step2ChangePhone: "שנה שיטה",
    
    step3Title: "סקירת חוזה",
    step3Desc: "אנא סקור את התנאים לפני החתימה.",
    step3Client: "לקוח:",
    step3Prop: "נכס:",
    step3Comm: "עמלה מוסכמת:",
    step3DefaultTerms: "הלקוח מתחייב לשלם את דמי התיווך אם ירכוש או ישכור את הנכס האמור, בהתאם לחוק המתווכים במקרקעין התשנ\"ו-1996.",
    step3IdLabel: "הכנס תעודת זהות / דרכון",
    step3IdPlaceholder: "לדוגמה: 012345678",
    step3SignLabel: "צייר את החתימה שלך כאן",
    step3ClearSign: "נקה חתימה",
    step3SignBtn: "אשר וחתום",
    
    step4Title: "חתימה הושלמה!",
    step4Desc: "ההסכם נחתם בהצלחה עם תוקף משפטי מלא.",
    step4Btn: "הורד עותק (PDF)",
    
    errNoPhone: "הזן את מספר הטלפון שלך",
    msgCodeSent: "הקוד נשלח דרך WhatsApp",
    errCodeSent: "שגיאה בשליחת הקוד. בדוק את המספר.",
    errIncompleteCode: "הזן את הקוד המלא",
    msgIdVerified: "הזהות אומתה",
    errIncorrectCode: "קוד שגוי",
    errNoId: "עליך להזין תעודת זהות / דרכון",
    errNoSign: "עליך לצייר את החתימה שלך",
    errSaveSign: "שגיאה בשמירת החתימה",
    errUnexpected: "אירעה שגיאה לא צפויה"
  }
};

export default function SignatureFlow({ contract }: { contract: any }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [method, setMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [identifier, setIdentifier] = useState(contract.lead?.phone || "");
  const [otp, setOtp] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const sigCanvas = useRef<any>(null);

  const lang = contract.language || "es";
  const t = uiTranslations[lang] || uiTranslations["es"];
  const isRtl = lang === "he";

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return toast.error(t.errNoPhone);
    
    setLoading(true);
    const res = await sendVerificationOTP(contract.token, method, identifier);
    setLoading(false);

    if (res.success) {
      toast.success(t.msgCodeSent);
      setStep(2);
    } else {
      toast.error(res.error || t.errCodeSent);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) return toast.error(t.errIncompleteCode);
    
    setLoading(true);
    const res = await verifyOTP(contract.token, identifier, otp);
    setLoading(false);

    if (res.success) {
      toast.success(t.msgIdVerified);
      setStep(3);
    } else {
      toast.error(res.error || t.errIncorrectCode);
    }
  };

  const handleSign = async () => {
    if (!idNumber) return toast.error(t.errNoId);
    if (sigCanvas.current?.isEmpty()) return toast.error(t.errNoSign);

    setLoading(true);
    try {
      const signatureBase64 = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      
      let ip = "Desconocida";
      try {
        const ipRes = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch (e) {
        console.warn("No se pudo obtener la IP del cliente");
      }

      const res = await signContract(contract.token, signatureBase64, idNumber, ip, method === "whatsapp" ? identifier : "");
      
      if (res.success) {
        setPdfUrl(res.pdfUrl);
        setStep(4);
        triggerConfetti();
      } else {
        toast.error(res.error || t.errSaveSign);
      }
    } catch (error) {
      toast.error(t.errUnexpected);
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

  const dirClass = isRtl ? "rtl" : "ltr";
  const alignClass = isRtl ? "text-right" : "text-left";

  if (step === 1) {
    return (
      <form onSubmit={handleRequestOTP} className={`space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500`} dir={dirClass}>
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{t.step1Title}</h2>
        <p className="text-slate-500">{t.step1Desc}</p>
        
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => {
              setMethod("whatsapp");
              setIdentifier(contract.lead?.phone || "");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${method === "whatsapp" ? "bg-green-100 text-green-700 border-2 border-green-500" : "bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200"}`}
          >
            <Phone size={18} /> WhatsApp
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod("email");
              setIdentifier(contract.lead?.email || "");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${method === "email" ? "bg-blue-100 text-blue-700 border-2 border-blue-500" : "bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200"}`}
          >
            <Mail size={18} /> Email
          </button>
        </div>

        <div className={`${alignClass} max-w-xs mx-auto`}>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {method === "whatsapp" ? t.step1LabelPhone : t.step1LabelEmail}
          </label>
          <input 
            type={method === "email" ? "email" : "tel"} 
            value={identifier} 
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={method === "whatsapp" ? t.step1PlaceholderPhone : t.step1PlaceholderEmail}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center text-lg tracking-wider ltr"
            dir="ltr"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : t.step1Btn}
        </button>
      </form>
    );
  }

  if (step === 2) {
    return (
      <form onSubmit={handleVerifyOTP} className={`space-y-6 text-center animate-in fade-in slide-in-from-right-8 duration-500`} dir={dirClass}>
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{t.step2Title}</h2>
        <p className="text-slate-500">{t.step2Desc.replace("{identifier}", identifier)}</p>
        
        <div className={`${alignClass} max-w-xs mx-auto`}>
          <input 
            type="text" 
            maxLength={4}
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="0000"
            className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none transition-all text-center text-4xl tracking-[1em] font-mono ltr"
            dir="ltr"
          />
        </div>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button 
            type="submit" 
            disabled={loading || otp.length < 4}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t.step2Btn}
          </button>
          <button 
            type="button" 
            onClick={() => setStep(1)}
            className="text-slate-500 text-sm hover:text-slate-800"
          >
            {t.step2ChangePhone}
          </button>
        </div>
      </form>
    );
  }

  if (step === 3) {
    return (
      <div className={`space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 ${alignClass}`} dir={dirClass}>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">{t.step3Title}</h2>
          <p className="text-slate-500">{t.step3Desc}</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-sm text-slate-700">
          <p><strong className="text-slate-900">{t.step3Client}</strong> {contract.lead.name}</p>
          <p><strong className="text-slate-900">{t.step3Prop}</strong> {contract.property.title} ({contract.property.location})</p>
          <p><strong className="text-slate-900">{t.step3Comm}</strong> {Number(contract.commissionRate)}% + IVA</p>
          <div className="border-t border-slate-200 pt-4 mt-4">
            <p className="text-xs text-slate-500 italic">
              {contract.terms || t.step3DefaultTerms}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.step3IdLabel}</label>
            <input 
              type="text" 
              value={idNumber} 
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder={t.step3IdPlaceholder}
              className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${alignClass}`}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.step3SignLabel}</label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-slate-50 relative">
              <SignatureCanvas 
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ className: "w-full h-48 cursor-crosshair touch-none" }}
              />
            </div>
            <div className={`flex mt-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
              <button 
                onClick={() => sigCanvas.current?.clear()}
                className="text-sm text-slate-500 hover:text-red-500"
              >
                {t.step3ClearSign}
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSign}
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : t.step3SignBtn}
        </button>
      </div>
    );
  }

  return (
    <div className={`text-center space-y-6 py-8 animate-in zoom-in duration-500`} dir={dirClass}>
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={48} />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-slate-800">{t.step4Title}</h2>
        <p className="text-slate-500 mt-2">{t.step4Desc}</p>
      </div>
      
      {pdfUrl && (
        <a 
          href={pdfUrl} 
          download
          target="_blank"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all mt-4"
        >
          <Download size={20} />
          {t.step4Btn}
        </a>
      )}
    </div>
  );
}
