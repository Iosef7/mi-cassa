import { Suspense } from 'react';
import ProjectsFetcher from './ProjectsFetcher';

export const dynamic = 'force-dynamic';

function ProjectsSkeleton() {
  return (
    <div className="p-8 animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-4 w-96 bg-muted rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-48 bg-muted rounded"></div>
        </div>
      </div>
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl border border-border bg-card/50 overflow-hidden h-72">
            <div className="p-6 space-y-4">
              <div className="h-6 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
              <div className="h-20 w-full bg-muted rounded mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProyectosPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsFetcher />
    </Suspense>
  );
}
