"use client";

import React, { useEffect, useState } from "react";
import { getCmsConfig, saveCmsConfig } from "@/actions/cms";
import { toast } from "sonner";
import { Save, Globe, Video, Phone, Mail, MessageSquare, Palette } from "lucide-react";

export default function CMSPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      const data = await getCmsConfig();
      setConfig(data);
      setLoading(false);
    }
    loadConfig();
  }, []);

  const handleChange = (section: string, field: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await saveCmsConfig(config);
    if (result.success) {
      toast.success("Configuración web guardada correctamente.");
    } else {
      toast.error("Error al guardar la configuración.");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando editor CMS...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="text-indigo-600" /> Editor Web (CMS)
          </h1>
          <p className="text-gray-500 mt-2">Administra el contenido, textos y diseño de la página principal de Mi Cassa.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          <Save size={20} /> {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Sección HERO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Video className="text-gray-400" /> Pantalla Principal (Hero)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título Principal</label>
              <input 
                type="text" 
                value={config?.hero?.title || ""} 
                onChange={(e) => handleChange("hero", "title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
              <textarea 
                value={config?.hero?.subtitle || ""} 
                onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL del Video de Fondo (MP4)</label>
              <input 
                type="text" 
                value={config?.hero?.videoUrl || ""} 
                onChange={(e) => handleChange("hero", "videoUrl", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Ingresa el enlace directo a un archivo de video (ej. .mp4).</p>
            </div>
          </div>
        </div>

        {/* Sección CONTACTO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Phone className="text-gray-400" /> Información de Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Phone size={14} /> Teléfono Fijo</label>
              <input 
                type="text" 
                value={config?.contact?.phone || ""} 
                onChange={(e) => handleChange("contact", "phone", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Mail size={14} /> Correo Electrónico</label>
              <input 
                type="email" 
                value={config?.contact?.email || ""} 
                onChange={(e) => handleChange("contact", "email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><MessageSquare size={14} /> WhatsApp (Botón Flotante)</label>
              <input 
                type="text" 
                value={config?.contact?.whatsapp || ""} 
                onChange={(e) => handleChange("contact", "whatsapp", e.target.value)}
                placeholder="ej: 972587137208"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Sección BRANDING */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Palette className="text-gray-400" /> Colores Corporativos (Branding)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Primario</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={config?.branding?.primaryColor || "#000000"} 
                  onChange={(e) => handleChange("branding", "primaryColor", e.target.value)}
                  className="w-12 h-12 p-1 bg-white border border-gray-300 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  value={config?.branding?.primaryColor || ""} 
                  onChange={(e) => handleChange("branding", "primaryColor", e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md font-mono text-sm uppercase"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Secundario</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={config?.branding?.secondaryColor || "#000000"} 
                  onChange={(e) => handleChange("branding", "secondaryColor", e.target.value)}
                  className="w-12 h-12 p-1 bg-white border border-gray-300 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  value={config?.branding?.secondaryColor || ""} 
                  onChange={(e) => handleChange("branding", "secondaryColor", e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md font-mono text-sm uppercase"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
