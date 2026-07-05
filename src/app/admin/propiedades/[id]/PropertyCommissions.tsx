"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Save, Plus, Trash2, ShieldAlert, DollarSign, Percent, TrendingDown, Users, CheckCircle2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyCommissionsProps {
  property: any;
  onSave: () => void;
}

export function PropertyCommissions({ property, onSave }: PropertyCommissionsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [commissions, setCommissions] = useState<any>({
    agencyCommission: { type: 'percentage', value: 5 },
    expenses: [],
    participants: []
  });

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [openDropdownId, setDropdownId] = useState<string | null>(null);
  const [openExpenseDropdownId, setExpenseDropdownId] = useState<string | null>(null);

  const COMMON_EXPENSES = [
    "Fotografía / Video",
    "Marketing / Anuncios",
    "Honorarios Legales",
    "Notaría",
    "Home Staging",
    "Limpieza",
    "Mantenimiento",
    "Trámites Administrativos",
    "Gestoría",
    "Otros"
  ];

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTeamMembers(data);
      })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    if (property?.commissions) {
      try {
        const parsed = JSON.parse(property.commissions);
        if (parsed) setCommissions(parsed);
      } catch (e) {}
    }
  }, [property]);

  const propertyPrice = Number(property.price) || 0;

  const agencyTotal = useMemo(() => {
    if (commissions.agencyCommission?.type === 'percentage') {
      return (propertyPrice * (commissions.agencyCommission.value || 0)) / 100;
    }
    return commissions.agencyCommission?.value || 0;
  }, [propertyPrice, commissions.agencyCommission]);

  const totalExpenses = useMemo(() => {
    return (commissions.expenses || []).reduce((acc: number, exp: any) => acc + (Number(exp.value) || 0), 0);
  }, [commissions.expenses]);

  const agencyNet = agencyTotal - totalExpenses;

  const participantsTotal = useMemo(() => {
    return (commissions.participants || []).reduce((acc: number, part: any) => {
      let val = 0;
      if (part.type === 'fixed') {
        val = Number(part.value) || 0;
      } else {
        const base = part.base === 'agency_commission' ? agencyTotal : propertyPrice;
        val = (base * (Number(part.value) || 0)) / 100;
      }
      return acc + val;
    }, 0);
  }, [commissions.participants, agencyTotal, propertyPrice]);

  const finalAgencyProfit = agencyNet - participantsTotal;
  const isOverDistributed = finalAgencyProfit < 0;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissions })
      });
      if (!res.ok) throw new Error('Error saving');
      toast.success('Comisiones guardadas exitosamente');
      onSave();
    } catch (e) {
      toast.error('Error al guardar comisiones');
    } finally {
      setIsSaving(false);
    }
  };

  const addExpense = () => {
    setCommissions((prev: any) => ({
      ...prev,
      expenses: [...(prev.expenses || []), { id: Date.now().toString(), name: '', value: 0 }]
    }));
  };

  const removeExpense = (id: string) => {
    setCommissions((prev: any) => ({
      ...prev,
      expenses: prev.expenses.filter((e: any) => e.id !== id)
    }));
  };

  const addParticipant = () => {
    setCommissions((prev: any) => ({
      ...prev,
      participants: [...(prev.participants || []), { 
        id: Date.now().toString(), 
        name: '', 
        role: 'Vendedor', 
        type: 'percentage', 
        value: 1, 
        base: 'agency_commission',
        status: 'Proyectado'
      }]
    }));
  };

  const removeParticipant = (id: string) => {
    setCommissions((prev: any) => ({
      ...prev,
      participants: prev.participants.filter((p: any) => p.id !== id)
    }));
  };

  const updateExpense = (id: string, field: string, value: any) => {
    setCommissions((prev: any) => ({
      ...prev,
      expenses: prev.expenses.map((e: any) => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const updateParticipant = (id: string, field: string, value: any) => {
    setCommissions((prev: any) => ({
      ...prev,
      participants: prev.participants.map((p: any) => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Settings */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Agency Commission */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Comisión de la Agencia
            </h3>
            <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-2xl">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Precio Propiedad</p>
                <p className="font-bold text-xl">{formatCurrency(propertyPrice)}</p>
              </div>
              <div className="h-10 w-px bg-border hidden sm:block"></div>
              <div className="flex items-center gap-2 flex-1">
                <select 
                  value={commissions.agencyCommission?.type || 'percentage'}
                  onChange={(e) => setCommissions((prev: any) => ({ ...prev, agencyCommission: { ...prev.agencyCommission, type: e.target.value } }))}
                  className="bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none w-32"
                >
                  <option value="percentage">Porcentaje</option>
                  <option value="fixed">Monto Fijo</option>
                </select>
                <input 
                  type="number" 
                  value={commissions.agencyCommission?.value || 0}
                  onChange={(e) => setCommissions((prev: any) => ({ ...prev, agencyCommission: { ...prev.agencyCommission, value: parseFloat(e.target.value) || 0 } }))}
                  className="bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none flex-1"
                />
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-500" /> Deducciones y Gastos
              </h3>
              <button onClick={addExpense} className="text-sm font-medium text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                <Plus className="w-4 h-4" /> Agregar Gasto
              </button>
            </div>
            {!(commissions.expenses?.length > 0) ? (
              <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl text-center">No hay deducciones registradas.</p>
            ) : (
              <div className="space-y-3">
                {commissions.expenses.map((exp: any) => (
                  <div key={exp.id} className="flex items-center gap-3 bg-muted/30 p-3 rounded-2xl flex-wrap">
                    <div className="relative flex-1 min-w-[150px]">
                      <input 
                        type="text" 
                        placeholder="Concepto (Ej. Abogado)" 
                        value={exp.name}
                        onChange={(e) => updateExpense(exp.id, 'name', e.target.value)}
                        onFocus={() => setExpenseDropdownId(exp.id)}
                        onBlur={() => setTimeout(() => setExpenseDropdownId(null), 200)}
                        className="bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none w-full pr-8"
                      />
                      <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      
                      {openExpenseDropdownId === exp.id && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-[#1c1c1e] text-white rounded-xl shadow-lg border border-white/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                          <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#1c1c1e] border-l border-t border-white/10 rotate-45"></div>
                          <div className="relative z-10 max-h-48 overflow-y-auto py-1">
                            {COMMON_EXPENSES.filter(c => c.toLowerCase().includes(exp.name.toLowerCase())).length > 0 ? (
                              COMMON_EXPENSES.filter(c => c.toLowerCase().includes(exp.name.toLowerCase())).map(category => (
                                <div 
                                  key={category} 
                                  onClick={() => {
                                    updateExpense(exp.id, 'name', category);
                                    setExpenseDropdownId(null);
                                  }}
                                  className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm font-medium transition-colors"
                                >
                                  {category}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-white/50">No hay coincidencias</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">₪</span>
                      <input 
                        type="number" 
                        placeholder="Monto" 
                        value={exp.value}
                        onChange={(e) => updateExpense(exp.id, 'value', parseFloat(e.target.value) || 0)}
                        className="bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none w-32"
                      />
                    </div>
                    <button onClick={() => removeExpense(exp.id)} className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Participants */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" /> Reparto de Equipo
              </h3>
              <button onClick={addParticipant} className="text-sm font-medium text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                <Plus className="w-4 h-4" /> Agregar Participante
              </button>
            </div>
            {!(commissions.participants?.length > 0) ? (
              <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl text-center">No hay participantes asignados a esta venta.</p>
            ) : (
              <div className="space-y-4">
                {commissions.participants.map((part: any) => {
                  let calcVal = 0;
                  if (part.type === 'fixed') {
                    calcVal = Number(part.value) || 0;
                  } else {
                    const base = part.base === 'agency_commission' ? agencyTotal : propertyPrice;
                    calcVal = (base * (Number(part.value) || 0)) / 100;
                  }

                  return (
                    <div key={part.id} className="bg-card shadow-sm p-4 rounded-3xl border border-border transition-colors group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                            {part.name ? part.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          
                          <div className="flex flex-col flex-1">
                            {/* Name Input - Styled as text */}
                            <div className="relative flex items-center w-full max-w-sm">
                              <input 
                                type="text" 
                                placeholder="Nombre del Agente" 
                                value={part.name}
                                onChange={(e) => updateParticipant(part.id, 'name', e.target.value)}
                                onFocus={() => setDropdownId(part.id)}
                                onBlur={() => setTimeout(() => setDropdownId(null), 200)}
                                className="bg-transparent border-none p-0 text-base font-bold outline-none flex-1 focus:ring-0 placeholder:text-muted-foreground/50 w-full"
                              />
                              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2 pointer-events-none" />
                              
                              {openDropdownId === part.id && teamMembers.length > 0 && (
                                <div className="absolute top-full left-0 mt-1 w-full bg-[#1c1c1e] text-white rounded-xl shadow-lg border border-white/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                  {/* Triangle pointer */}
                                  <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#1c1c1e] border-l border-t border-white/10 rotate-45"></div>
                                  <div className="relative z-10 max-h-48 overflow-y-auto py-1">
                                    {teamMembers.filter(m => (m.name || m.email).toLowerCase().includes(part.name.toLowerCase())).length > 0 ? (
                                      teamMembers.filter(m => (m.name || m.email).toLowerCase().includes(part.name.toLowerCase())).map(member => (
                                        <div 
                                          key={member.id} 
                                          onClick={() => {
                                            updateParticipant(part.id, 'name', member.name || member.email);
                                            setDropdownId(null);
                                          }}
                                          className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm font-medium transition-colors"
                                        >
                                          {member.name || member.email}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-4 py-2 text-sm text-white/50">No hay coincidencias</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Role Input - Styled as subtitle */}
                            <input 
                              type="text" 
                              placeholder="Rol (Ej. Vendedor)" 
                              value={part.role}
                              onChange={(e) => updateParticipant(part.id, 'role', e.target.value)}
                              className="bg-transparent border-none p-0 text-sm text-muted-foreground outline-none focus:ring-0 placeholder:text-muted-foreground/40 mt-0.5 w-full max-w-sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 justify-end">
                          <select 
                            value={part.status}
                            onChange={(e) => updateParticipant(part.id, 'status', e.target.value)}
                            className={`rounded-full px-3 py-1 text-xs font-bold outline-none uppercase tracking-wider cursor-pointer transition-colors ${
                              part.status === 'Pagado' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 
                              part.status === 'Pendiente' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 
                              'bg-primary/10 text-primary hover:bg-primary/20'
                            }`}
                          >
                            <option value="Proyectado">Proyectado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Pagado">Pagado</option>
                          </select>
                          
                          <div className="font-black text-lg text-foreground min-w-[100px] text-right">
                            {formatCurrency(calcVal)}
                          </div>

                          <button onClick={() => removeParticipant(part.id)} className="p-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Eliminar participante">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap bg-muted/40 p-2.5 rounded-2xl border border-border/50 text-muted-foreground">
                        <select 
                          value={part.type}
                          onChange={(e) => updateParticipant(part.id, 'type', e.target.value)}
                          className="bg-transparent rounded-lg px-2 py-1 text-sm outline-none w-28 hover:bg-muted"
                        >
                          <option value="percentage">Porcentaje</option>
                          <option value="fixed">Monto Fijo</option>
                        </select>
                        <div className="h-6 w-px bg-border hidden sm:block"></div>
                        <input 
                          type="number" 
                          step="0.1"
                          placeholder="Valor" 
                          value={part.value}
                          onChange={(e) => updateParticipant(part.id, 'value', parseFloat(e.target.value) || 0)}
                          className="bg-transparent px-2 py-1 text-sm outline-none w-20 hover:bg-muted rounded-lg"
                        />
                        {part.type === 'percentage' && (
                          <>
                            <span className="text-muted-foreground text-sm">de</span>
                            <select 
                              value={part.base}
                              onChange={(e) => updateParticipant(part.id, 'base', e.target.value)}
                              className="bg-transparent rounded-lg px-2 py-1 text-sm outline-none w-40 hover:bg-muted"
                            >
                              <option value="agency_commission">Comisión Agencia</option>
                              <option value="property_price">Precio Propiedad</option>
                            </select>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Summary Widget */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">Resumen de Rentabilidad</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Comisión Total</span>
                <span className="font-bold">{formatCurrency(agencyTotal)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-rose-500">
                <span>Gastos Deductibles</span>
                <span className="font-bold">-{formatCurrency(totalExpenses)}</span>
              </div>

              <div className="h-px bg-border my-2"></div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Agencia Neto (Post-gastos)</span>
                <span className="font-bold">{formatCurrency(agencyNet)}</span>
              </div>

              <div className="flex justify-between items-center text-sm text-amber-600">
                <span>Reparto a Equipo</span>
                <span className="font-bold">-{formatCurrency(participantsTotal)}</span>
              </div>

              <div className="h-px bg-border my-4"></div>

              <div className={`p-5 rounded-2xl ${isOverDistributed ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  {isOverDistributed ? 'Pérdida para Agencia' : 'Ganancia Neta Agencia'}
                </p>
                <div className={`text-3xl font-black ${isOverDistributed ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatCurrency(finalAgencyProfit)}
                </div>
              </div>

              {isOverDistributed && (
                <div className="flex gap-3 items-start bg-rose-100/50 p-4 rounded-xl mt-4 border border-rose-200 text-rose-800 text-xs">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500" />
                  <p className="font-medium leading-relaxed">Estás repartiendo más dinero del que ingresa a la agencia. Por favor revisa los porcentajes y montos fijos.</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save className="w-5 h-5" /> Guardar Comisiones</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
