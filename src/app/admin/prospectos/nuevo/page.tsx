"use client";

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, Phone, Mail, DollarSign, Building, AlertCircle, MapPin, Clock, HelpCircle, FileText } from 'lucide-react';
import { createLead } from '../actions';
import { showToast } from '@/lib/alerts';

function NuevoProspectoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'PROPIETARIO' ? 'PROPIETARIO' : 'CLIENTE';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
    status: 'NUEVO',
    requiresMortgage: false,
    notes: '',
    preferences: '',
    type: initialType,
    urgency: '',
    propertyTypeOfInterest: '',
    hasPropertyToSell: false,
    reasonForSelling: '',
    acceptsTrade: false,
    viewingAvailability: '',
    targetLocations: '',
    isLegalClear: true,
    hasMortgage: false,
    mandateType: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.name || !formData.phone) {
      setError('El nombre y el teléfono son obligatorios');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await createLead(formData);
      
      if (res.success) {
        showToast(formData.type === 'PROPIETARIO' ? 'Propietario creado exitosamente' : 'Prospecto creado exitosamente', 'success');
        router.push(formData.type === 'PROPIETARIO' ? '/admin/prospectos?tab=propietarios' : '/admin/prospectos?tab=clientes');
      } else {
        setError(res.error || 'Hubo un error al crear el registro');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPropietario = formData.type === 'PROPIETARIO';

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href={`/admin/prospectos?tab=${isPropietario ? 'propietarios' : 'clientes'}`}
          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isPropietario ? 'Nuevo Propietario' : 'Nuevo Cliente'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {isPropietario ? 'Registra un nuevo vendedor en el sistema.' : 'Registra un nuevo comprador potencial.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 animate-in slide-in-from-top-2">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Tipo de Contacto */}
          <section>
            <div className="flex gap-4">
              <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-colors flex items-center justify-center gap-2 ${!isPropietario ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
                <input type="radio" name="type" value="CLIENTE" checked={!isPropietario} onChange={handleChange} className="hidden" />
                <User size={18} />
                <span className="font-medium">Comprador / Inquilino</span>
              </label>
              <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isPropietario ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
                <input type="radio" name="type" value="PROPIETARIO" checked={isPropietario} onChange={handleChange} className="hidden" />
                <Building size={18} />
                <span className="font-medium">Vendedor / Propietario</span>
              </label>
            </div>
          </section>

          {/* Información Personal */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre Completo *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Teléfono *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Phone size={16} /></div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. +52 123 456 7890" className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Correo Electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={16} /></div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Ej. juan@ejemplo.com" className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-border" />

          {/* Detalles Específicos */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Building size={18} className="text-blue-500" />
              Detalles {isPropietario ? 'de la Captación' : 'del Interés'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Estado Inicial</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="NUEVO">Nuevo</option>
                  <option value="CONTACTADO">Contactado</option>
                  {isPropietario ? (
                    <>
                      <option value="VALORACION_PROPIEDAD">Valoración de Propiedad</option>
                      <option value="NEGOCIACION_MANDATO">Negociación de Mandato</option>
                    </>
                  ) : (
                    <>
                      <option value="VISITA_AGENDADA">Visita Agendada</option>
                      <option value="NEGOCIACION">En Negociación</option>
                    </>
                  )}
                </select>
              </div>

              {/* Presupuesto / Precio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{isPropietario ? 'Precio Esperado' : 'Presupuesto Estimado'}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><DollarSign size={16} /></div>
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder="Ej. 1500000" min="0" step="1000" className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              {/* Urgencia */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Urgencia de {isPropietario ? 'Venta' : 'Compra'}</label>
                <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Selecciona...</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>

              {/* Tipo de propiedad */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tipo de Propiedad {isPropietario ? 'a Vender' : 'Deseada'}</label>
                <input type="text" name="propertyTypeOfInterest" value={formData.propertyTypeOfInterest} onChange={handleChange} placeholder="Casa, Departamento, Terreno..." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* Zonas de Interés (Solo Compradores) */}
              {!isPropietario && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><MapPin size={16} /> Zonas de Interés</label>
                  <input type="text" name="targetLocations" value={formData.targetLocations} onChange={handleChange} placeholder="Norte de la ciudad, Centro, etc." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              )}

              {/* Motivo de Venta (Solo Propietarios) */}
              {isPropietario && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><HelpCircle size={16} /> Motivo de Venta</label>
                  <input type="text" name="reasonForSelling" value={formData.reasonForSelling} onChange={handleChange} placeholder="Inversión, Mudanza, Herencia..." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              )}
              
              {/* Disponibilidad Visitas (Solo Propietarios) */}
              {isPropietario && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><Clock size={16} /> Disponibilidad para Visitas</label>
                  <input type="text" name="viewingAvailability" value={formData.viewingAvailability} onChange={handleChange} placeholder="Fines de semana, solo tardes, etc." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              )}

              {/* Campos booleanos */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isPropietario && (
                  <>
                    <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <input name="requiresMortgage" type="checkbox" checked={formData.requiresMortgage} onChange={handleChange} className="w-5 h-5 border-slate-300 rounded text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Requiere hipoteca</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <input name="hasPropertyToSell" type="checkbox" checked={formData.hasPropertyToSell} onChange={handleChange} className="w-5 h-5 border-slate-300 rounded text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Tiene propiedad para vender</span>
                    </label>
                  </>
                )}
                {isPropietario && (
                  <>
                    <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <input name="isLegalClear" type="checkbox" checked={formData.isLegalClear} onChange={handleChange} className="w-5 h-5 border-slate-300 rounded text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Documentos al día</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <input name="hasMortgage" type="checkbox" checked={formData.hasMortgage} onChange={handleChange} className="w-5 h-5 border-slate-300 rounded text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">La propiedad está hipotecada</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <input name="acceptsTrade" type="checkbox" checked={formData.acceptsTrade} onChange={handleChange} className="w-5 h-5 border-slate-300 rounded text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Acepta permuta</span>
                    </label>
                  </>
                )}
              </div>

              {/* Tipo de Mandato (Solo Propietarios) */}
              {isPropietario && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><FileText size={16} /> Tipo de Mandato</label>
                  <select name="mandateType" value={formData.mandateType} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Ninguno / Sin Firmar</option>
                    <option value="EXCLUSIVA">Exclusiva</option>
                    <option value="ABIERTA">Abierta</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          <hr className="border-border" />

          {/* Información Adicional */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Información Adicional</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notas Privadas / Observaciones</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Añade notas internas que solo tú y tu equipo podrán ver..." className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="bg-muted/30 px-6 py-4 md:px-8 border-t border-border flex items-center justify-end gap-3">
          <Link href={`/admin/prospectos?tab=${isPropietario ? 'propietarios' : 'clientes'}`} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50">
            <Save size={18} />
            <span>{isSubmitting ? 'Guardando...' : `Guardar ${isPropietario ? 'Propietario' : 'Cliente'}`}</span>
          </button>
        </div>
      </form>
    </>
  );
}

export default function NuevoProspectoPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Suspense fallback={<div className="animate-pulse space-y-8"><div className="h-8 bg-muted rounded w-1/4"></div><div className="h-[600px] bg-muted rounded-xl"></div></div>}>
        <NuevoProspectoForm />
      </Suspense>
    </div>
  );
}
