"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../actions";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState('PROYECTO');
  const [dynamicFeatures, setDynamicFeatures] = useState<any>({});
  const [nearbyPlacesList, setNearbyPlacesList] = useState<{name: string, category: string, distance: string}[]>([]);
  const [driveFolders, setDriveFolders] = useState<{id: string, name: string}[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [loadingFolders, setLoadingFolders] = useState(true);

  useEffect(() => {
    fetch('/api/drive/folders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDriveFolders(data);
          if (data.length > 0) setSelectedFolder(data[0].id);
        }
        setLoadingFolders(false);
      })
      .catch(err => {
        console.error("Error fetching folders:", err);
        setLoadingFolders(false);
      });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await createProject(formData);

    if (result.success) {
      router.push("/admin/propiedades");
      router.refresh();
    } else {
      setError(result.error || "Ocurrió un error");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 p-8 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Subir Nuevo Proyecto</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-card p-6 rounded-xl border shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label htmlFor="parentDriveFolderId" className="text-sm font-medium flex items-center gap-2">
                Carpeta en Google Drive <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">Autocreado</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">Selecciona la carpeta principal donde se creará automáticamente la subcarpeta de este proyecto.</p>
              {loadingFolders ? (
                <div className="p-2 border rounded-md bg-muted text-sm text-muted-foreground">Cargando carpetas de Drive...</div>
              ) : (
                <select id="parentDriveFolderId" name="parentDriveFolderId" value={selectedFolder} onChange={e => setSelectedFolder(e.target.value)} className="w-full p-2 rounded-md border bg-background">
                  {driveFolders.length === 0 ? (
                    <option value="">No se encontraron carpetas compartidas con el bot</option>
                  ) : (
                    driveFolders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))
                  )}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Nombre del Proyecto</label>
              <input required type="text" id="title" name="title" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: Torre Lumiere" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Ubicación</label>
              <input required type="text" id="location" name="location" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: Polanco, CDMX" />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">Precio Base (Desde)</label>
              <input required type="number" id="price" name="price" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: 5000000" />
            </div>

            <div className="space-y-2">
              <label htmlFor="minPrice" className="text-sm font-medium">Precio Mínimo del Rango</label>
              <input type="number" id="minPrice" name="minPrice" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: 5000000" />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxPrice" className="text-sm font-medium">Precio Máximo del Rango</label>
              <input type="number" id="maxPrice" name="maxPrice" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: 10000000" />
            </div>

            <div className="space-y-2">
              <label htmlFor="availableUnits" className="text-sm font-medium">Unidades Disponibles</label>
              <input type="number" id="availableUnits" name="availableUnits" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: 24" />
            </div>

            <div className="space-y-2">
              <label htmlFor="deliveryDate" className="text-sm font-medium">Fecha de Entrega Aproximada</label>
              <input type="text" id="deliveryDate" name="deliveryDate" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: Q3 2026 o Inmediata" />
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Tipo de Proyecto</label>
              <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 rounded-md border bg-background">
                <option value="PROYECTO">Proyecto / Desarrollo Vertical</option>
                <option value="CASA">Casas en Condominio</option>
                <option value="TERRENO">Lotes / Terrenos</option>
                <option value="DEPARTAMENTO">Departamento</option>
              </select>
            </div>

            {/* Dynamic Features Fields */}
            {type !== 'TERRENO' && type !== 'PROYECTO' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Habitaciones</label>
                  <input type="number" name="bedrooms" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: 3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Baños</label>
                  <input type="number" name="bathrooms" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: 2" />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{type === 'TERRENO' ? 'Área Total (m²)' : 'Construcción (m²)'}</label>
              <input type="number" name="area" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: 150" />
            </div>

            {type === 'TERRENO' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Metros de Frente</label>
                  <input type="number" value={dynamicFeatures.frontMeters || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, frontMeters: e.target.value})} className="w-full p-2 rounded-md border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Metros de Fondo</label>
                  <input type="number" value={dynamicFeatures.depthMeters || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, depthMeters: e.target.value})} className="w-full p-2 rounded-md border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Uso de Suelo</label>
                  <input type="text" value={dynamicFeatures.zoning || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, zoning: e.target.value})} className="w-full p-2 rounded-md border bg-background" />
                </div>
              </>
            )}

            {type === 'DEPARTAMENTO' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Piso (Nivel)</label>
                  <input type="number" value={dynamicFeatures.floorNumber || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, floorNumber: e.target.value})} className="w-full p-2 rounded-md border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Elevadores</label>
                  <input type="number" value={dynamicFeatures.elevators || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, elevators: e.target.value})} className="w-full p-2 rounded-md border bg-background" />
                </div>
              </>
            )}
            
            <input type="hidden" name="dynamicFeatures" value={JSON.stringify(dynamicFeatures)} />
            <input type="hidden" name="nearbyPlaces" value={JSON.stringify(nearbyPlacesList)} />
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-bold mb-4">Datos del Propietario (CRM Interno)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="ownerName" className="text-sm font-medium">Nombre del Propietario</label>
                <input type="text" id="ownerName" name="ownerName" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: Juan Pérez" />
              </div>
              <div className="space-y-2">
                <label htmlFor="ownerPhone" className="text-sm font-medium">Teléfono</label>
                <input type="text" id="ownerPhone" name="ownerPhone" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: +52 55 1234 5678" />
              </div>
              <div className="space-y-2">
                <label htmlFor="ownerEmail" className="text-sm font-medium">Correo Electrónico</label>
                <input type="email" id="ownerEmail" name="ownerEmail" className="w-full p-2 rounded-md border bg-background" placeholder="Ej: juan.perez@email.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="ownerNotes" className="text-sm font-medium">Notas Internas</label>
                <textarea id="ownerNotes" name="ownerNotes" rows={3} className="w-full p-2 rounded-md border bg-background" placeholder="Ej: Mostrar solo martes por la mañana"></textarea>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Descripción Completa</label>
            <textarea id="description" name="description" rows={5} className="w-full p-2 rounded-md border bg-background" placeholder="Detalles de amenidades, acabados, etc..."></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Subir Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
