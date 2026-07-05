import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import TareasFetcher from './TareasFetcher';

export const dynamic = 'force-dynamic';

function TareasSkeleton() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Fake Sidebar */}
      <div className="w-[250px] border-r border-border bg-card p-4 hidden md:flex flex-col gap-4">
        <div className="h-12 bg-muted/50 rounded-2xl animate-pulse"></div>
        <div className="space-y-2 mt-4">
          {[1, 2, 3].map(i => <div key={i} className="h-10 bg-muted/50 rounded-xl animate-pulse"></div>)}
        </div>
        <div className="mt-8 space-y-2">
          <div className="h-4 w-24 bg-muted/50 rounded animate-pulse mb-4"></div>
          {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-muted/50 rounded-xl animate-pulse"></div>)}
        </div>
      </div>

      {/* Fake Main Content */}
      <div className="flex-1 flex flex-col bg-background md:bg-muted/30">
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="h-10 w-48 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-64 bg-card border border-border rounded-xl animate-pulse"></div>
        </div>
        
        <div className="px-8 pb-4">
          <div className="h-14 w-full bg-card border border-border rounded-2xl animate-pulse"></div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
            <p className="font-medium animate-pulse">Cargando tu espacio de trabajo...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TareasPage() {
  return (
    <Suspense fallback={<TareasSkeleton />}>
      <TareasFetcher />
    </Suspense>
  );
}
