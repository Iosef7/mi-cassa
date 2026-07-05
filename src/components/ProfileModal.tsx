"use client";

import React, { useState, useRef } from 'react';
import { X, Save, Camera, Loader2, Phone, AlignLeft, Link as LinkIcon, Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileModalProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    // We'll fetch these extra fields via API since session might not have them yet
  };
  onClose: () => void;
}

export default function ProfileModal({ user: sessionUser, onClose }: ProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false); // Eliminado el bloqueo de carga
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: sessionUser.name || '',
    email: sessionUser.email || '',
    password: '',
    phone: '',
    bio: '',
    instagram: '',
    linkedin: '',
    website: '',
    image: sessionUser.image || ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Fetch extra data in background without blocking UI
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const users = await res.json();
          const me = users.find((u: any) => u.id === sessionUser.id);
          if (me) {
            let parsedSocials = { instagram: '', linkedin: '', website: '' };
            if (me.socialLinks) {
              try { parsedSocials = JSON.parse(me.socialLinks); } catch (e) {}
            }
            setFormData(prev => ({
              ...prev,
              name: prev.name || me.name,
              email: prev.email || me.email,
              image: prev.image || me.image,
              phone: me.phone || prev.phone,
              bio: me.bio || prev.bio,
              ...parsedSocials
            }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserData();
  }, [sessionUser.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Resize image to 256x256 before saving as base64 to keep DB small
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxSize = 256;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP for best compression
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        setFormData(prev => ({ ...prev, image: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const socialLinksStr = JSON.stringify({
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        website: formData.website
      });

      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        socialLinks: socialLinksStr,
        image: formData.image
      };

      if (formData.password.trim() !== '') {
        payload.password = formData.password;
      }

      const res = await fetch(`/api/users/${sessionUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Perfil actualizado correctamente");
        if (formData.email !== sessionUser.email || formData.name !== sessionUser.name) {
          toast.info("Tus datos principales cambiaron. Por favor inicia sesión nuevamente.");
          setTimeout(() => signOut(), 2000);
        } else {
          onClose();
          // Reload page to reflect avatar changes if needed
          window.location.reload();
        }
      } else {
        toast.error("Hubo un error al guardar tu perfil");
      }
    } catch (e) {
      toast.error("Error de conexión al guardar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-card w-full max-w-3xl rounded-[2rem] shadow-2xl border border-border flex flex-col max-h-[95vh] overflow-hidden relative overflow-hidden"
      >
        {/* Glassmorphism gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm font-medium">Cargando tu información...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pb-8 custom-scrollbar">
            
            {/* Banner Header inside scroll container to prevent avatar clipping */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-r from-primary/80 via-blue-600/80 to-indigo-600/80 shrink-0">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors z-10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar Section - Overlaps header */}
            <div className="px-8 -mt-16 sm:-mt-20 mb-8 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 relative z-10">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full ring-8 bg-card ring-card shadow-2xl overflow-hidden flex items-center justify-center relative opacity-100"
                >
                  {formData.image ? (
                    <Image src={formData.image} alt="Avatar" fill className="object-cover" sizes="160px" />
                  ) : (
                    <span className="text-5xl font-black text-primary uppercase">
                      {formData.name.substring(0, 2)}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                    <Camera className="w-8 h-8 text-white mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Cambiar Foto</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="pb-2 text-center sm:text-left">
                <h2 className="text-3xl font-black text-foreground tracking-tight">{formData.name || 'Mi Perfil'}</h2>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">
                  {sessionUser.role === 'ADMIN' ? 'Administrador del Sistema' : 'Asesor Inmobiliario'}
                </p>
              </div>
            </div>

            <div className="px-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* Basic Info */}
              <div className="space-y-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary/80 flex items-center gap-2">
                  <User className="w-4 h-4" /> Información Básica
                </h3>
                
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                      placeholder="Nombre Completo"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input 
                      type="email" 
                      className="w-full pl-11 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                      placeholder="Correo Electrónico"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="Cambiar contraseña (opcional)..."
                      className="w-full pl-11 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-muted-foreground/60"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Marketing / Contact */}
              <div className="space-y-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary/80 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4" /> Perfil Profesional
                </h3>
                
                <div className="space-y-4">
                  <div className="relative group flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                      <Phone className="w-4 h-4" />
                    </div>
                    <select
                      className="pl-11 pr-2 py-3.5 bg-muted/30 border border-border/50 border-r-0 rounded-l-2xl text-sm focus:border-primary transition-all outline-none font-medium cursor-pointer"
                      value={
                        [
                          '+52','+1','+34','+972','+54','+57','+56','+51','+507','+506',
                          '+58','+593','+55','+598','+595','+502','+503','+504','+505','+1-809'
                        ].find(c => formData.phone.startsWith(c)) || '+52'
                      }
                      onChange={(e) => {
                        const newCode = e.target.value;
                        const currentCode = [
                          '+52','+1','+34','+972','+54','+57','+56','+51','+507','+506',
                          '+58','+593','+55','+598','+595','+502','+503','+504','+505','+1-809'
                        ].find(c => formData.phone.startsWith(c)) || '';
                        
                        const numberOnly = currentCode ? formData.phone.slice(currentCode.length).trim() : formData.phone.trim();
                        setFormData({...formData, phone: `${newCode} ${numberOnly}`});
                      }}
                    >
                      <option value="+52" className="bg-background text-foreground">🇲🇽 +52</option>
                      <option value="+1" className="bg-background text-foreground">🇺🇸 +1</option>
                      <option value="+34" className="bg-background text-foreground">🇪🇸 +34</option>
                      <option value="+972" className="bg-background text-foreground">🇮🇱 +972</option>
                      <option value="+54" className="bg-background text-foreground">🇦🇷 +54</option>
                      <option value="+57" className="bg-background text-foreground">🇨🇴 +57</option>
                      <option value="+56" className="bg-background text-foreground">🇨🇱 +56</option>
                      <option value="+51" className="bg-background text-foreground">🇵🇪 +51</option>
                      <option value="+507" className="bg-background text-foreground">🇵🇦 +507</option>
                      <option value="+506" className="bg-background text-foreground">🇨🇷 +506</option>
                      <option value="+58" className="bg-background text-foreground">🇻🇪 +58</option>
                      <option value="+593" className="bg-background text-foreground">🇪🇨 +593</option>
                      <option value="+55" className="bg-background text-foreground">🇧🇷 +55</option>
                      <option value="+598" className="bg-background text-foreground">🇺🇾 +598</option>
                      <option value="+595" className="bg-background text-foreground">🇵🇾 +595</option>
                      <option value="+502" className="bg-background text-foreground">🇬🇹 +502</option>
                      <option value="+503" className="bg-background text-foreground">🇸🇻 +503</option>
                      <option value="+504" className="bg-background text-foreground">🇭🇳 +504</option>
                      <option value="+505" className="bg-background text-foreground">🇳🇮 +505</option>
                      <option value="+1-809" className="bg-background text-foreground">🇩🇴 +1 (DO)</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Número..."
                      className="w-full pl-3 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-r-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                      value={
                        (() => {
                          const code = [
                            '+52','+1','+34','+972','+54','+57','+56','+51','+507','+506',
                            '+58','+593','+55','+598','+595','+502','+503','+504','+505','+1-809'
                          ].find(c => formData.phone.startsWith(c)) || '';
                          return code ? formData.phone.slice(code.length).trim() : formData.phone;
                        })()
                      }
                      onChange={e => {
                        const code = [
                          '+52','+1','+34','+972','+54','+57','+56','+51','+507','+506',
                          '+58','+593','+55','+598','+595','+502','+503','+504','+505','+1-809'
                        ].find(c => formData.phone.startsWith(c)) || '+52';
                        setFormData({...formData, phone: `${code} ${e.target.value}`});
                      }}
                    />
                  </div>

                  <div className="relative group">
                    <textarea 
                      placeholder="Escribe una breve biografía o lema profesional..."
                      className="w-full p-4 bg-muted/30 border border-border/50 rounded-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none min-h-[120px] font-medium leading-relaxed"
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-5 md:col-span-2 pt-4 border-t border-border/50">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary/80 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> Redes y Enlaces
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-pink-500 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Instagram URL"
                      className="w-full pl-11 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-2xl text-sm focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none font-medium"
                      value={formData.instagram}
                      onChange={e => setFormData({...formData, instagram: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="LinkedIn URL"
                      className="w-full pl-11 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-2xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                      value={formData.linkedin}
                      onChange={e => setFormData({...formData, linkedin: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Sitio Web Personal"
                      className="w-full pl-11 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                      value={formData.website}
                      onChange={e => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 border-t border-border/50 shrink-0 flex justify-end gap-3 bg-muted/10">
          <button 
            onClick={onClose} 
            className="px-6 py-3 text-sm font-bold text-muted-foreground hover:bg-muted rounded-2xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || isLoading} 
            className="px-8 py-3 text-sm font-bold bg-gradient-to-r from-primary to-indigo-600 text-white hover:opacity-90 rounded-2xl shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
