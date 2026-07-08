import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Users, Target, CheckSquare, Inbox, Loader2 } from 'lucide-react';
import ProspectControls from './ProspectControls';
import ProspectosContent from './ProspectosContent';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const dynamic = 'force-dynamic';

function ProspectosSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-card/50 p-5 rounded-xl border border-border flex items-center gap-4 h-[90px]">
            <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-[500px] bg-card/50 rounded-xl border border-border flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

export default async function ProspectosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  
  const query = typeof sp.q === 'string' ? sp.q : '';
  const status = typeof sp.status === 'string' ? sp.status : '';
  const page = typeof sp.page === 'string' ? Number(sp.page) : 1;
  const view = typeof sp.view === 'string' ? sp.view : 'list';
  const tab = typeof sp.tab === 'string' ? sp.tab : 'clientes'; // 'clientes' o 'propietarios'

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value;
  const dict = getDictionary(locale);

  return (
    <div className="p-8 overflow-auto">
      {/* Header (Instantly visible) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {tab === 'propietarios' ? dict.prospectsPage.owners : dict.prospectsPage.clients}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {tab === 'propietarios' 
              ? dict.prospectsPage.ownersDesc 
              : dict.prospectsPage.clientsDesc}
          </p>
        </div>
        <Link 
          href={`/admin/prospectos/nuevo?type=${tab === 'propietarios' ? 'PROPIETARIO' : 'CLIENTE'}`} 
          className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>{tab === 'propietarios' ? dict.prospectsPage.newOwner : dict.prospectsPage.newClient}</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border mb-6">
        <Link
          href={`/admin/prospectos?tab=clientes&view=${view}`}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            tab === 'clientes'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          {dict.prospectsPage.clients}
        </Link>
        <Link
          href={`/admin/prospectos?tab=propietarios&view=${view}`}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            tab === 'propietarios'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          {dict.prospectsPage.owners}
        </Link>
      </div>

      {/* Controls (Instantly visible) */}
      <ProspectControls currentTab={tab} />

      {/* Heavy Content (Streamed) */}
      <Suspense fallback={<ProspectosSkeleton />} key={`${query}-${status}-${page}-${view}-${tab}`}>
        <ProspectosContent query={query} status={status} page={page} view={view} tab={tab} />
      </Suspense>
    </div>
  );
}
