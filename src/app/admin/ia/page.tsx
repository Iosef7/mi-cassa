import { prisma } from '@/lib/prisma';
import { Activity, BrainCircuit, Zap, BarChart3, Database, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default async function AIDashboardPage() {
  // Fetch AI usage data
  const logs = await prisma.aiUsage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50 // last 50 operations
  });

  // Calculate totals
  const totalCost = logs.reduce((acc, log) => acc + log.costUSD, 0);
  const totalPromptTokens = logs.reduce((acc, log) => acc + log.promptTokens, 0);
  const totalCompletionTokens = logs.reduce((acc, log) => acc + log.completionTokens, 0);
  
  // Budget Limit Configuration (can be moved to SiteSettings later)
  const monthlyBudget = 20.00;
  const percentUsed = Math.min((totalCost / monthlyBudget) * 100, 100);
  
  const successCount = logs.filter(l => l.status === 'SUCCESS').length;
  const errorCount = logs.filter(l => l.status === 'ERROR').length;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-2 tracking-tight">
            <BrainCircuit className="w-8 h-8 text-primary" />
            Control de Inteligencia Artificial
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Monitorea el consumo, gasto de tokens y estado de tus modelos (Gemini, OpenAI, Claude).</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/ajustes" className="px-5 py-2.5 bg-muted text-muted-foreground font-semibold rounded-2xl hover:bg-muted/80 transition-colors">
            Ajustes de API
          </Link>
          <button className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 flex items-center gap-2 shadow-sm">
            <RefreshCw className="w-4 h-4" /> Recargar
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Budget Progress Box (Spans 2 columns) */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-card to-muted border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Presupuesto Mensual</p>
              <h2 className="text-4xl font-black text-foreground mt-1">
                ${totalCost.toFixed(3)} <span className="text-xl text-muted-foreground font-semibold">/ $${monthlyBudget.toFixed(2)}</span>
              </h2>
            </div>
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2 relative z-10">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-foreground">{percentUsed.toFixed(1)}% Consumido</span>
              <span className="text-muted-foreground">${(monthlyBudget - totalCost).toFixed(2)} restantes</span>
            </div>
            <div className="w-full bg-border rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${percentUsed > 90 ? 'bg-destructive' : percentUsed > 75 ? 'bg-orange-500' : 'bg-primary'}`} 
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tokens Stats */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Database className="w-4 h-4" /> Tokens Totales
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-black text-foreground">{(totalPromptTokens / 1000).toFixed(1)}k</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Prompt (Entrada)</p>
            </div>
            <div className="h-px bg-border w-full"></div>
            <div>
              <p className="text-3xl font-black text-foreground">{(totalCompletionTokens / 1000).toFixed(1)}k</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Completion (Salida)</p>
            </div>
          </div>
        </div>

        {/* Operations Stats */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Zap className="w-4 h-4" /> Operaciones
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-black text-green-600">{successCount}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Operaciones Exitosas</p>
            </div>
            <div className="h-px bg-border w-full"></div>
            <div>
              <p className="text-3xl font-black text-destructive">{errorCount}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Errores de API</p>
            </div>
          </div>
        </div>

      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" /> Registro de Operaciones
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Proveedor / Modelo</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Operación</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tokens (P / C)</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Costo (USD)</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium">
                    No hay operaciones de IA registradas aún.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {log.createdAt.toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{log.provider}</span>
                        <span className="text-xs font-medium text-muted-foreground">{log.model}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      {log.operationType}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                      {log.promptTokens} / {log.completionTokens}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                      ${log.costUSD.toFixed(5)}
                    </td>
                    <td className="px-6 py-4">
                      {log.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          Exitoso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold" title={log.errorMessage || 'Error desconocido'}>
                          <AlertCircle className="w-3 h-3" /> Error
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
