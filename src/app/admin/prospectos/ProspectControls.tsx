'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, List, LayoutGrid, Download } from 'lucide-react';
import { useCallback, useState } from 'react';
import { showAlert } from '@/lib/alerts';

export default function ProspectControls({ currentTab = 'clientes' }: { currentTab?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  // Función para actualizar parámetros en la URL
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete('page'); // Resetear página al cambiar filtros
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(pathname + '?' + createQueryString('q', searchTerm));
  };

  const currentStatus = searchParams.get('status') || '';
  const currentView = searchParams.get('view') || 'list';

  return (
    <div className="flex flex-wrap items-center justify-between bg-card p-4 rounded-xl shadow-sm border border-border mb-8 gap-4">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto flex-1">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <Search size={18} />
          </button>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, teléfono o email..." 
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
          />
        </form>

        <select 
          value={currentStatus}
          onChange={(e) => router.push(pathname + '?' + createQueryString('status', e.target.value))}
          className="py-2 px-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        >
          <option value="">Todos los estados</option>
          {currentTab === 'propietarios' ? (
            <>
              <option value="NUEVO">Nuevo</option>
              <option value="CONTACTADO">Contactado</option>
              <option value="VALORACION_PROPIEDAD">Valoración de Propiedad</option>
              <option value="NEGOCIACION_MANDATO">Negociación de Mandato</option>
              <option value="MANDATO_FIRMADO">Mandato Firmado / Exclusiva</option>
              <option value="PUBLICADO">Publicado</option>
            </>
          ) : (
            <>
              <option value="NUEVO">Nuevo</option>
              <option value="CONTACTADO">Contactado</option>
              <option value="VISITA_AGENDADA">Visita Agendada</option>
              <option value="NEGOCIACION">Negociación</option>
              <option value="FIRMA">Firma</option>
              <option value="CERRADO_GANADO">Cerrado Ganado</option>
            </>
          )}
        </select>
      </div>

      {/* View Toggles & Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-muted p-1 rounded-lg border border-border">
          <button
            onClick={() => router.push(pathname + '?' + createQueryString('view', 'list'))}
            className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
              currentView === 'list' 
                ? 'bg-card shadow-sm text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Vista de Lista"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => router.push(pathname + '?' + createQueryString('view', 'board'))}
            className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
              currentView === 'board' 
                ? 'bg-card shadow-sm text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Vista de Tablero (Kanban)"
          >
            <LayoutGrid size={18} />
          </button>
        </div>

        <button 
          onClick={() => {
            const queryParams = new URLSearchParams(searchParams.toString());
            // TODO: Redirigir a API de exportación
            showAlert('Función en desarrollo', 'La exportación a CSV estará disponible pronto.', 'info');
          }}
          className="flex items-center gap-2 text-sm text-foreground bg-muted/50 hover:bg-muted px-3 py-2 rounded-md border border-border transition-colors"
          title="Exportar Vista Actual a CSV"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>
    </div>
  );
}
