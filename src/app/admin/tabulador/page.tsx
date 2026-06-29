import { MortgageCalculator } from "@/components/MortgageCalculator";
import { Calculator } from "lucide-react";

export const metadata = {
  title: "Tabulador / Simulador | Mi Cassa",
  description: "Simulador de crédito y tabulador",
};

export default function TabuladorPage() {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <Calculator className="h-8 w-8 text-red-600" />
          Simulador de Crédito
        </h1>
      </div>
      
      <p className="text-gray-500 max-w-2xl">
        Utiliza esta herramienta interactiva para calcular pagos mensuales, montos de crédito e intereses 
        para las propiedades basándote en el precio y el enganche.
      </p>

      <div className="pt-8">
        <MortgageCalculator />
      </div>
    </div>
  );
}
