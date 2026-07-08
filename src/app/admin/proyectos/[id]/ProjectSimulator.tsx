"use client";

import { useState, useMemo } from "react";
import { Calculator, Settings2, Info, TrendingUp, AlertCircle } from "lucide-react";

interface ProjectSimulatorProps {
  initialData?: any;
}

export default function ProjectSimulator({ initialData }: ProjectSimulatorProps) {
  // Configuración del proyecto
  const [totalUnits, setTotalUnits] = useState(initialData?.totalUnits || 39);
  const [sellableArea, setSellableArea] = useState(2651); // Área de venta en m2
  const [ownershipShare, setOwnershipShare] = useState(initialData?.ownershipShare || 20);
  
  // Ingresos
  const [pricePerSqm, setPricePerSqm] = useState(initialData?.financialData?.pricePerSqm || 45000);
  
  // Costos de Construcción (Directos)
  const [constructionCostPerSqm, setConstructionCostPerSqm] = useState(initialData?.financialData?.constructionCostPerSqm || 7500);
  const [parkingCostPerSqm, setParkingCostPerSqm] = useState(initialData?.financialData?.parkingCostPerSqm || 420);
  const [balconyCostPerSqm, setBalconyCostPerSqm] = useState(initialData?.financialData?.balconyCostPerSqm || 2600);
  const [serviceAreaCostPerSqm, setServiceAreaCostPerSqm] = useState(initialData?.financialData?.serviceAreaCostPerSqm || 2800);
  const [elevatorCost, setElevatorCost] = useState(initialData?.financialData?.elevatorCost || 4000);
  
  // Áreas (m2)
  const [parkingArea, setParkingArea] = useState(initialData?.financialData?.parkingArea || 2971);
  const [balconyArea, setBalconyArea] = useState(initialData?.financialData?.balconyArea || 468);
  const [serviceArea, setServiceArea] = useState(initialData?.financialData?.serviceArea || 1072);
  const [principalArea, setPrincipalArea] = useState(initialData?.financialData?.principalArea || 4816);
  const [totalGrossArea, setTotalGrossArea] = useState(initialData?.financialData?.totalGrossArea || 6098);
  
  // Costos Indirectos / Fijos
  const [landCost, setLandCost] = useState(initialData?.financialData?.landCost || 20000000); 
  const [demolitionCost, setDemolitionCost] = useState(initialData?.financialData?.demolitionCost || 700000);
  const [consultingCostPerUnit, setConsultingCostPerUnit] = useState(initialData?.financialData?.consultingCostPerUnit || 35000); 
  
  const [generalExpensesPercent, setGeneralExpensesPercent] = useState(initialData?.financialData?.generalExpensesPercent || 4.5);
  const [unexpectedCostsPercent, setUnexpectedCostsPercent] = useState(initialData?.financialData?.unexpectedCostsPercent || 3);
  const [brokeragePercent, setBrokeragePercent] = useState(initialData?.financialData?.brokeragePercent || 0);
  const [landTaxPercent, setLandTaxPercent] = useState(initialData?.financialData?.landTaxPercent || 0);
  const [financingPercent, setFinancingPercent] = useState(initialData?.financialData?.financingPercent || 7);
  
  const [isSaving, setIsSaving] = useState(false);

  const calculateROI = useMemo(() => {
    // Ingresos Brutos
    const grossRevenue = sellableArea * pricePerSqm;
    
    // Costos Directos Construcción
    const mainConstructionCost = totalGrossArea * constructionCostPerSqm; // 6098 * 7500
    const parkingConstructionCost = parkingArea * 2800; // 2971 * 2800
    const balconyTotalCost = balconyArea * balconyCostPerSqm; // 468 * 2600
    
    // Base para porcentajes (Rasante + Estacionamiento + Balcones)
    const baseConstructionCost = mainConstructionCost + parkingConstructionCost + balconyTotalCost;
    
    // Costos Fijos por Unidad / Área
    const parkingFees = totalGrossArea * parkingCostPerSqm; // 6098 * 420
    const elevatorTotal = totalUnits * elevatorCost; // 39 * 4000
    const totalConsulting = totalUnits * consultingCostPerUnit; // 39 * 35000
    
    // Costos Porcentuales sobre la base de construcción
    const generalExpenses = baseConstructionCost * (generalExpensesPercent / 100); // 4.5% de la base
    const unexpectedCosts = baseConstructionCost * (unexpectedCostsPercent / 100); // 3% de la base
    
    // Subtotal del Proyecto (Antes de Financiación)
    const subtotalProject = landCost + demolitionCost + baseConstructionCost + parkingFees + elevatorTotal + generalExpenses + totalConsulting + unexpectedCosts;
    
    // Financiación (Calculada sobre TODO el subtotal, incluido terreno)
    const financing = subtotalProject * (financingPercent / 100); // 7% del subtotal
    
    // Costos Adicionales de Venta (Corretaje, Impuestos)
    const brokerageCost = grossRevenue * (brokeragePercent / 100);
    const landTaxCost = grossRevenue * (landTaxPercent / 100); 

    const totalCosts = subtotalProject + financing + brokerageCost + landTaxCost;
    
    // Beneficio (Monto sin IVA estimado)
    const netProfit = grossRevenue - totalCosts;
    const roiPercentage = (netProfit / totalCosts) * 100;
    
    // Beneficio del Propietario (según porcentaje)
    const ownerProfit = netProfit * (ownershipShare / 100);

    return {
      grossRevenue,
      baseConstructionCost,
      totalConstruction,
      totalCosts,
      netProfit,
      roiPercentage,
      ownerProfit,
      brokerageCost,
      landTaxCost
    };
  }, [
    sellableArea, pricePerSqm, principalArea, constructionCostPerSqm, parkingCostPerSqm, 
    balconyArea, balconyCostPerSqm, serviceArea, serviceAreaCostPerSqm, totalUnits, 
    generalExpensesPercent, unexpectedCostsPercent, landCost, brokeragePercent, 
    landTaxPercent, ownershipShare, demolitionCost, consultingCostPerUnit, elevatorCost, totalGrossArea
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/projects/${initialData?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialData: {
            sellableArea, pricePerSqm, principalArea, constructionCostPerSqm,
            parkingCostPerSqm, balconyArea, balconyCostPerSqm, serviceArea, serviceAreaCostPerSqm,
            totalGrossArea, landCost, demolitionCost, consultingCostPerUnit, generalExpensesPercent,
            unexpectedCostsPercent, brokeragePercent, landTaxPercent, financingPercent, elevatorCost
          }
        })
      });
      if (response.ok) {
        alert("Configuración Financiera Guardada Correctamente");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Parámetros */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              Ingresos y Escenario de Ventas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Área Vendible (m²)</label>
                <input 
                  type="number" 
                  value={sellableArea} 
                  onChange={(e) => setSellableArea(Number(e.target.value))}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Precio de Venta estimado (₪/m²)</label>
                <input 
                  type="number" 
                  value={pricePerSqm} 
                  onChange={(e) => setPricePerSqm(Number(e.target.value))}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2 font-semibold text-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-primary" />
              Costos de Construcción (Directos)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Área Principal (m²) | Costo (₪/m²)</label>
                <div className="flex gap-2">
                  <input type="number" value={principalArea} onChange={(e) => setPrincipalArea(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2" />
                  <input type="number" value={constructionCostPerSqm} onChange={(e) => setConstructionCostPerSqm(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Balcones (m²) | Costo (₪/m²)</label>
                <div className="flex gap-2">
                  <input type="number" value={balconyArea} onChange={(e) => setBalconyArea(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2" />
                  <input type="number" value={balconyCostPerSqm} onChange={(e) => setBalconyCostPerSqm(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Estacionamiento (m²) | Costo (₪/m²)</label>
                <div className="flex gap-2">
                  <input type="number" value={parkingArea} onChange={(e) => setParkingArea(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2" />
                  <input type="number" value={parkingCostPerSqm} onChange={(e) => setParkingCostPerSqm(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Áreas de Servicio (m²) | Costo (₪/m²)</label>
                <div className="flex gap-2">
                  <input type="number" value={serviceArea} onChange={(e) => setServiceArea(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2" />
                  <input type="number" value={serviceAreaCostPerSqm} onChange={(e) => setServiceAreaCostPerSqm(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-primary" />
              Costos Indirectos y Ocultos
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Tasas e Imprevistos (%)</label>
                <div className="flex gap-2">
                  <input type="number" value={generalExpensesPercent} onChange={(e) => setGeneralExpensesPercent(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm" placeholder="Tasas 4.5%" />
                  <input type="number" value={unexpectedCostsPercent} onChange={(e) => setUnexpectedCostsPercent(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm" placeholder="Imprevistos 3%" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Financiación (%) | Ascensor (x Ud)</label>
                <div className="flex gap-2">
                  <input type="number" value={financingPercent} onChange={(e) => setFinancingPercent(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm" />
                  <input type="number" value={elevatorCost} onChange={(e) => setElevatorCost(Number(e.target.value))} className="w-1/2 bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Compra Terreno / Acuerdo</label>
                <input type="number" value={landCost} onChange={(e) => setLandCost(Number(e.target.value))} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Demolición y Evacuación</label>
                <input type="number" value={demolitionCost} onChange={(e) => setDemolitionCost(Number(e.target.value))} className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm" />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end print:hidden">
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSaving ? "Guardando..." : "Guardar Configuración Financiera"}
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resultados */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg shadow-primary/20 print:text-black print:bg-transparent print:border print:shadow-none">
            <h3 className="font-medium text-primary-foreground/80 print:text-muted-foreground mb-1">Ventas Totales Estimadas</h3>
            <p className="text-4xl font-bold mb-6">{formatCurrency(calculateROI.grossRevenue)}</p>

            <h3 className="font-medium text-primary-foreground/80 print:text-muted-foreground mb-1">Costo Total del Proyecto</h3>
            <p className="text-2xl font-bold mb-6">{formatCurrency(calculateROI.totalCosts)}</p>

            <div className="pt-4 border-t border-primary-foreground/20 print:border-border">
              <h3 className="font-medium text-primary-foreground/80 print:text-muted-foreground mb-1">Beneficio Neto Estimado</h3>
              <p className="text-3xl font-bold mb-1">{formatCurrency(calculateROI.netProfit)}</p>
              <p className="text-sm bg-primary-foreground/20 print:bg-muted text-primary-foreground print:text-foreground inline-block px-2 py-1 rounded-md font-medium">
                ROI: {calculateROI.roiPercentage.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <h4 className="font-semibold mb-4 text-muted-foreground uppercase text-xs tracking-wider">Desglose de Participación</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Participación Mi Cassa</span>
              <input type="number" value={ownershipShare} onChange={(e) => setOwnershipShare(Number(e.target.value))} className="w-16 bg-muted/30 border border-border rounded-md px-2 py-1 text-right text-sm font-medium text-primary" /> <span className="text-sm">%</span>
            </div>
            <div className="pt-2 border-t border-border mt-2">
              <span className="text-sm text-muted-foreground">Ganancia Proporcional</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(calculateROI.ownerProfit)}</p>
            </div>
          </div>
          
          <div className="bg-muted/40 rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Este simulador usa los cálculos de la hoja "בדיקת כדאיות פרוייקט". Todos los valores no incluyen IVA. Ajusta los campos de m² y costos para simular diferentes escenarios del mercado.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
