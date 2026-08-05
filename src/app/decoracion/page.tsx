import React from "react";
import PublicHeader from "@/components/ui/PublicHeader";

export default function Decoracion() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden flex flex-col">
      <PublicHeader />
      <main className="flex-grow max-w-[1140px] mx-auto px-4 py-24 w-full">
        <h1 className="text-4xl font-bold text-[#214953] mb-6">Decoración</h1>
        <div className="w-[80px] h-[3px] bg-[#5280A4] mb-6"></div>
        <p className="text-gray-600 text-lg">Esta página está en construcción y pronto será poblada con el contenido de la web original.</p>
      </main>
    </div>
  );
}
