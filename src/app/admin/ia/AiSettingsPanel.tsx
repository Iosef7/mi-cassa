"use client";

import { useState, useTransition } from "react";
import { Settings2, Save, Loader2, LayoutTemplate } from "lucide-react";
import { GeminiIcon } from '@/components/icons/GeminiIcon';
import { updateAiSettings } from "./actions";

const OPERATIONS = [
  { id: "PropertyDescriptionGeneration", name: "Generador de Descripciones", icon: LayoutTemplate },
  { id: "DelegationChat", name: "Asistente Conversacional", icon: GeminiIcon },
  { id: "TaskDelegation", name: "Delegación Automática", icon: GeminiIcon },
  { id: "PropertyMatch", name: "Matching de Propiedades", icon: GeminiIcon },
  { id: "TaskExtraction", name: "Extracción de Tareas", icon: GeminiIcon },
  { id: "PropertyDataExtraction", name: "Lector Inteligente de Documentos", icon: GeminiIcon },
  { id: "TwilioCallBot", name: "Bot Telefónico (Twilio)", icon: GeminiIcon },
  { id: "WhatsAppBot", name: "Bot de WhatsApp", icon: GeminiIcon },
  { id: "CallSummaryAndExtraction", name: "Transcripción de Llamadas (Plaud)", icon: GeminiIcon },
];

const MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Rápido y Económico)" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Avanzado y Preciso)" },
];

export function AiSettingsPanel({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);
  const [budget, setBudget] = useState(initialSettings["ai_monthly_budget"] || "20.00");

  const handleSave = () => {
    startTransition(async () => {
      const dataToSave = { ...settings, ai_monthly_budget: budget };
      await updateAiSettings(dataToSave);
      setIsOpen(false);
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 bg-muted text-muted-foreground font-semibold rounded-2xl hover:bg-muted/80 transition-colors flex items-center gap-2"
      >
        <Settings2 className="w-4 h-4" /> Configuración de Modelos
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Settings2 className="w-6 h-6 text-primary" />
                Configuración de Inteligencia Artificial
              </h2>
              <p className="text-muted-foreground mt-1">Selecciona qué modelo utilizar para cada módulo de la plataforma.</p>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              
              {/* Budget Setting */}
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                  Presupuesto Mensual de Alerta (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                  <input 
                    type="number" 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-semibold"
                    placeholder="20.00"
                    step="0.10"
                  />
                </div>
              </div>

              {/* Models Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b border-border pb-2">
                  Modelos Asignados por Función
                </h3>
                {OPERATIONS.map((op) => {
                  const settingKey = `ai_model_${op.id}`;
                  const currentValue = settings[settingKey] || "gemini-2.5-flash";
                  const Icon = op.icon;

                  return (
                    <div key={op.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-lg shadow-sm border border-border">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{op.name}</p>
                          <p className="text-xs text-muted-foreground font-medium">Clave: {op.id}</p>
                        </div>
                      </div>
                      <select
                        value={currentValue}
                        onChange={(e) => setSettings(prev => ({ ...prev, [settingKey]: e.target.value }))}
                        className="py-2.5 px-4 rounded-xl border border-border bg-background font-medium text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm min-w-[200px]"
                      >
                        {MODELS.map(model => (
                          <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={isPending}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
