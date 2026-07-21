import { Suspense } from 'react';
import ProjectDashboard from './ProjectDashboard';
import { Loader2 } from 'lucide-react';
import { auth } from "@/auth";

function ProjectSkeleton() {
  return (
    <div className="p-8 animate-pulse space-y-8 h-screen">
      <div className="h-12 w-1/3 bg-muted rounded"></div>
      <div className="h-8 w-1/4 bg-muted rounded"></div>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded"></div>)}
      </div>
      <div className="h-96 w-full bg-muted rounded mt-8"></div>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const resolvedParams = await params;
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectDashboard projectId={resolvedParams.id} userRole={session?.user?.role} />
    </Suspense>
  );
}
