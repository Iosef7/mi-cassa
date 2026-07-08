"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    architect: "",
    totalUnits: "",
    floors: "",
    description: "",
    status: "EVALUACION",
    dealType: "",
    ownershipShare: "",
    driveFolderId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Error al crear el proyecto");
      }

      const data = await res.json();
      toast.success("Proyecto creado con éxito");
      router.push(`/admin/proyectos/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema al crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/proyectos">
            <button type="button" className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Proyecto</h1>
            <p className="text-muted-foreground">Configura los datos básicos del desarrollo</p>
          </div>
        </div>
        <button type="button" onClick={handleSubmit} disabled={loading} className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-all font-medium disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Proyecto
        </button>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del Proyecto *</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Ktav Sofer Jerusalén"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ubicación</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej. Calle Ksav Sofer 8-10, Jerusalén"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Arquitecto</label>
              <input
                name="architect"
                value={formData.architect}
                onChange={handleChange}
                placeholder="Ej. Amatzia Aharonson"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="EVALUACION">Evaluación / En espera de permiso</option>
                <option value="PLANIFICACION">Planificación</option>
                <option value="EN_CONSTRUCCION">En Construcción</option>
                <option value="TERMINADO">Terminado</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Total de Unidades / Departamentos</label>
              <input
                type="number"
                name="totalUnits"
                value={formData.totalUnits}
                onChange={handleChange}
                placeholder="Ej. 39"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Número de Pisos</label>
              <input
                type="number"
                name="floors"
                value={formData.floors}
                onChange={handleChange}
                placeholder="Ej. 11"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Acuerdo</label>
              <input
                name="dealType"
                value={formData.dealType}
                onChange={handleChange}
                placeholder="Ej. Combinación"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Porcentaje de Propiedad (%)</label>
              <input
                type="number"
                step="0.01"
                name="ownershipShare"
                value={formData.ownershipShare}
                onChange={handleChange}
                placeholder="Ej. 20"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detalles sobre el proyecto, T.B.A., áreas verdes..."
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">ID Carpeta de Drive (Opcional)</label>
            <input
              name="driveFolderId"
              value={formData.driveFolderId}
              onChange={handleChange}
              placeholder="Ej. 1A2b3C4d5E6f7G8h9I"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
