"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, Phone, Mail, DollarSign, Building, AlertCircle, MapPin, Clock, HelpCircle, FileText, ChevronDown, Target, Maximize, Calendar, Users, PawPrint } from 'lucide-react';
import { updateLead } from '../../actions';
import { showToast } from '@/lib/alerts';

export default function EditarProspectoForm({ lead }: { lead: any }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [properties, setProperties] = useState<{id: string, title: string, images: any}[]>([]);
  useEffect(() => {
    fetch('/api/properties?limit=100').then(r => r.json()).then(data => setProperties(data));
  }, []);

  const parsePhone = (fullPhone: string) => {
    if (!fullPhone) return { prefix: '+972', number: '' };
    const commonPrefixes = ['+972', '+1', '+34', '+52', '+54', '+56', '+57', '+51', '+58', '+507', '+598'];
    for (const prefix of commonPrefixes) {
      if (fullPhone.startsWith(prefix)) {
        return { prefix, number: fullPhone.slice(prefix.length).trim() };
      }
    }
    return { prefix: '+972', number: fullPhone };
  };

  const initialPhone = parsePhone(lead.phone || '');

  const [formData, setFormData] = useState({
    name: lead.name || '',
    phonePrefix: initialPhone.prefix,
    phoneNumber: initialPhone.number,
    email: lead.email || '',
    budget: lead.budget ? lead.budget.toString() : '',
    currency: lead.currency || 'ILS',
    status: lead.status || 'NUEVO',
    requiresMortgage: lead.requiresMortgage || false,
    notes: lead.notes || '',
    preferences: lead.preferences || '',
    type: lead.type || 'CLIENTE',
    urgency: lead.urgency || '',
    propertyTypeOfInterest: lead.propertyTypeOfInterest || '',
    propertyId: lead.propertyId || '',
    hasPropertyToSell: lead.hasPropertyToSell || false,
    reasonForSelling: lead.reasonForSelling || '',
    acceptsTrade: lead.acceptsTrade || false,
    viewingAvailability: lead.viewingAvailability || '',
    targetLocations: lead.targetLocations || '',
    targetArea: lead.targetArea ? lead.targetArea.toString() : '',
    minArea: lead.minArea ? lead.minArea.toString() : '',
    maxArea: lead.maxArea ? lead.maxArea.toString() : '',
    moveInDate: lead.moveInDate ? new Date(lead.moveInDate).toISOString().split('T')[0] : '',
    numberOfPeople: lead.numberOfPeople ? lead.numberOfPeople.toString() : '',
    petFriendly: lead.petFriendly || false,
    isLegalClear: lead.isLegalClear !== undefined ? lead.isLegalClear : true,
    hasMortgage: lead.hasMortgage || false,
    mandateType: lead.mandateType || '',
    contactDate: lead.contactDate ? new Date(lead.contactDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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

    if (!formData.name || !formData.phoneNumber) {
      setError('El nombre y el teléfono son obligatorios');
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionData = { ...formData, phone: `${formData.phonePrefix} ${formData.phoneNumber}` };
      const res = await updateLead(lead.id, submissionData);
      
      if (res.success) {
        showToast('Registro actualizado exitosamente', 'success');
        router.push(`/admin/prospectos/${lead.id}`);
      } else {
        setError(res.error || 'Hubo un error al actualizar el registro');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPropietario = formData.type === 'PROPIETARIO';
  const isInquilino = formData.type === 'INQUILINO';
  const isComprador = formData.type === 'COMPRADOR' || formData.type === 'CLIENTE';

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href={`/admin/prospectos/${lead.id}`}
          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Editar {isPropietario ? 'Propietario' : 'Cliente'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Modifica la información de {lead.name}
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
              <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isComprador ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
                <input type="radio" name="type" value="COMPRADOR" checked={isComprador} onChange={handleChange} className="hidden" />
                <User size={18} />
                <span className="font-medium">Comprador</span>
              </label>
              <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isInquilino ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
                <input type="radio" name="type" value="INQUILINO" checked={isInquilino} onChange={handleChange} className="hidden" />
                <Target size={18} />
                <span className="font-medium">Inquilino</span>
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
                <div className="flex gap-2">
                  <select name="phonePrefix" value={formData.phonePrefix} onChange={handleChange} className="w-1/3 bg-background border border-border rounded-lg px-2 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="+972">🇮🇱 +972</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+51">🇵🇪 +51</option>
                    <option value="+58">🇻🇪 +58</option>
                    <option value="+507">🇵🇦 +507</option>
                    <option value="+598">🇺🇾 +598</option>
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Phone size={16} /></div>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Ej. 123 456 7890" className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
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
                      <option value="MANDATO_FIRMADO">Mandato Firmado</option>
                      <option value="PUBLICADO">Publicado</option>
                    </>
                  ) : (
                    <>
                      <option value="VISITA_AGENDADA">Visita Agendada</option>
                      <option value="NEGOCIACION">En Negociación</option>
                      <option value="FIRMA">Firma</option>
                      <option value="CERRADO_GANADO">Cerrado Ganado</option>
                      <option value="CERRADO_PERDIDO">Cerrado Perdido</option>
                    </>
                  )}
                </select>
              </div>

              {/* Fecha de Contacto */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                  <Clock size={16} /> Fecha de Contacto
                </label>
                <input type="date" name="contactDate" value={formData.contactDate} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
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

              {/* Vincular Propiedad */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><Building size={16} /> Vincular Propiedad (Opcional)</label>
                <div className="relative">
                  <div 
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 cursor-pointer flex items-center justify-between hover:border-blue-400 transition-colors"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="truncate flex items-center gap-3">
                      {(() => {
                        const sel = properties.find(p => p.id === formData.propertyId);
                        if (!sel) return "Ninguna";
                        let src = null;
                        try {
                          const imgs = typeof sel.images === 'string' ? JSON.parse(sel.images) : sel.images;
                          if (imgs && imgs.length > 0) {
                            if (imgs[0].startsWith('http')) {
                              if (imgs[0].includes('drive.google.com') && (imgs[0].includes('/preview') || imgs[0].includes('/view'))) {
                                const fileId = imgs[0].match(/\/d\/(.+?)\/(?:preview|view)/)?.[1];
                                src = fileId ? `/api/drive/image/${fileId}` : imgs[0];
                              } else {
                                src = imgs[0];
                              }
                            } else if (imgs[0].startsWith('data:image')) {
                              src = imgs[0];
                            } else {
                              src = `data:image/jpeg;base64,${imgs[0]}`;
                            }
                          }
                        } catch(e) {}
                        return (
                          <>
                            {src && <img src={src} className="w-6 h-6 rounded object-cover" />}
                            {sel.title}
                          </>
                        );
                      })()}
                    </span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-xl max-h-64 overflow-y-auto">
                      <div 
                        className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-sm font-medium transition-colors"
                        onClick={() => { setFormData(prev => ({...prev, propertyId: ''})); setIsDropdownOpen(false); }}
                      >
                        Ninguna
                      </div>
                      {properties.map(p => {
                        let src = null;
                        try {
                          const imgs = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
                          if (imgs && imgs.length > 0) {
                            if (imgs[0].startsWith('http')) {
                              if (imgs[0].includes('drive.google.com') && (imgs[0].includes('/preview') || imgs[0].includes('/view'))) {
                                const fileId = imgs[0].match(/\/d\/(.+?)\/(?:preview|view)/)?.[1];
                                src = fileId ? `/api/drive/image/${fileId}` : imgs[0];
                              } else {
                                src = imgs[0];
                              }
                            } else if (imgs[0].startsWith('data:image')) {
                              src = imgs[0];
                            } else {
                              src = `data:image/jpeg;base64,${imgs[0]}`;
                            }
                          }
                        } catch(e) {}
                        
                        return (
                          <div 
                            key={p.id} 
                            className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 border-t border-border transition-colors ${formData.propertyId === p.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                            onClick={() => { setFormData(prev => ({...prev, propertyId: p.id})); setIsDropdownOpen(false); }}
                          >
                            {src ? (
                              <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <Building size={16} className="text-slate-400" />
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.title}</span>
                              <span className="text-xs text-slate-500">ID: {p.id.slice(-6)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Zonas de Interés (Solo Compradores) */}
              {isPropietario && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><MapPin size={16} /> Ubicación de la Propiedad</label>
                  <input type="text" name="targetLocations" value={formData.targetLocations} onChange={handleChange} placeholder="Dirección o Zona..." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
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

          {!isPropietario && (
            <>
              <hr className="border-border" />
              <section>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target size={18} className="text-blue-500" />
                  Datos de lo que busca
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Presupuesto / Precio */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Presupuesto Estimado</label>
                    <div className="flex gap-2">
                      <select name="currency" value={formData.currency} onChange={handleChange} className="w-1/4 bg-background border border-border rounded-lg px-2 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="ILS">₪</option>
                        <option value="USD">$</option>
                        <option value="EUR">€</option>
                        <option value="MXN">MX$</option>
                      </select>
                      <input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder="Ej. 1500000" min="0" step="1000" className="w-3/4 bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  {/* Tipo de propiedad */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tipo de Propiedad Deseada</label>
                    <select name="propertyTypeOfInterest" value={formData.propertyTypeOfInterest} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                      <option value="">Cualquiera...</option>
                      <option value="Departamento">Departamento</option>
                      <option value="Casa">Casa</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Oficina">Oficina</option>
                      <option value="Local Comercial">Local Comercial</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  {/* Zonas de Interés */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><MapPin size={16} /> Zonas de Interés</label>
                    <input type="text" name="targetLocations" value={formData.targetLocations} onChange={handleChange} placeholder="Norte de la ciudad, Centro, etc." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  {/* Metros Cuadrados */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><Maximize size={16} /> Metros Cuadrados (m²)</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs text-slate-500 mb-1 block">Esperados</span>
                        <input type="number" name="targetArea" value={formData.targetArea} onChange={handleChange} placeholder="Ej. 100" min="0" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 mb-1 block">Mínimo</span>
                        <input type="number" name="minArea" value={formData.minArea} onChange={handleChange} placeholder="Ej. 80" min="0" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 mb-1 block">Máximo</span>
                        <input type="number" name="maxArea" value={formData.maxArea} onChange={handleChange} placeholder="Ej. 120" min="0" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>

                  {/* Fecha y Personas */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><Calendar size={16} /> {isInquilino ? 'Inicio de Contrato' : 'Fecha de Mudanza'}</label>
                    <input type="date" name="moveInDate" value={formData.moveInDate} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><Users size={16} /> Número de Personas</label>
                    <input type="number" name="numberOfPeople" value={formData.numberOfPeople} onChange={handleChange} placeholder="Ej. 2" min="1" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  {/* Mascotas */}
                  {isInquilino && (
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <input name="petFriendly" type="checkbox" checked={formData.petFriendly} onChange={handleChange} className="w-5 h-5 border-slate-300 rounded text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2"><PawPrint size={16} className="text-slate-500" /> Tiene Mascotas / Requiere Pet Friendly</span>
                      </label>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

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
          <Link href={`/admin/prospectos/${lead.id}`} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50">
            <Save size={18} />
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </>
  );
}
