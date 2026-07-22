import { getContractByToken } from "@/actions/contracts";
import { notFound } from "next/navigation";
import SignatureFlow from "./SignatureFlow";
import Image from "next/image";

export default async function FirmaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  const res = await getContractByToken(token);
  
  if (!res.success || !res.contract) {
    notFound();
  }

  // Serialize the contract to a plain object to remove Prisma Decimal and Date objects
  const contract = JSON.parse(JSON.stringify(res.contract));

  if (contract.status === "FIRMADO") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Contrato Firmado</h1>
          <p className="text-slate-600">Este contrato ya ha sido firmado digitalmente.</p>
          {contract.pdfUrl && (
            <a 
              href={contract.pdfUrl} 
              download
              target="_blank"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Descargar Copia
            </a>
          )}
        </div>
      </div>
    );
  }

  const titles: Record<string, string> = {
    es: "Acuerdo de Corretaje",
    en: "Brokerage Agreement",
    he: "הסכם תיווך",
  };
  const title = titles[contract.language || "es"] || titles.es;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 sm:p-8 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          <div className="relative z-10 mb-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
            <Image src="/micassa-brand.png" alt="Mi Cassa" width={180} height={60} className="object-contain h-10 sm:h-12 w-auto" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white relative z-10 tracking-tight">{title}</h1>
          <p className="text-slate-300 relative z-10 mt-2">Mi Cassa Inmobiliaria</p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10">
          <SignatureFlow contract={contract} />
        </div>
      </div>
    </div>
  );
}
