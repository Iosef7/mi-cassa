'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building, MapPin, Bed, Bath, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getSmartMatches } from './actions';

interface SmartMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadName: string;
}

export default function SmartMatchModal({ isOpen, onClose, leadId, leadName }: SmartMatchModalProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && leadId) {
      setLoading(true);
      getSmartMatches(leadId).then((res) => {
        if (res.success && res.matches) {
          setMatches(res.matches);
        }
        setLoading(false);
      });
    }
  }, [isOpen, leadId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 p-1.5 rounded-lg">
                  <Building size={18} />
                </span>
                Smart Match
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Sugerencias para {leadName} basadas en su presupuesto.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-indigo-600 dark:text-indigo-400">
                <Loader2 size={32} className="animate-spin mb-4" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Buscando el match perfecto...</p>
              </div>
            ) : matches.length > 0 ? (
              <div className="grid gap-4">
                {matches.map((property) => {
                  let imageUrl = null;
                  try {
                    if (property.images) {
                      const parsed = JSON.parse(property.images);
                      if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
                      else if (typeof property.images === 'string' && property.images.startsWith('http')) imageUrl = property.images;
                    }
                  } catch (e) {
                     // ignore
                  }
                  
                  return (
                    <div key={property.id} className="flex gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all group bg-white dark:bg-slate-900">
                      <div className="w-24 h-24 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden relative">
                        {imageUrl ? (
                          <Image src={imageUrl} alt={property.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Building size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{property.title}</h3>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0 ml-2">
                            ${Number(property.price).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {property.location}
                        </p>
                        <div className="flex gap-3 mt-auto pt-2">
                          {property.bedrooms && (
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                              <Bed size={12} className="text-slate-400" /> {property.bedrooms}
                            </span>
                          )}
                          {property.bathrooms && (
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                              <Bath size={12} className="text-slate-400" /> {property.bathrooms}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Building size={24} />
                </div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-1">Sin coincidencias exactas</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  No encontramos propiedades que se ajusten al presupuesto de este cliente en este momento.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mostrando las top 3 coincidencias
            </p>
            <Link 
              href={`/admin/prospectos/${leadId}?tab=match`}
              className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Ver Análisis Completo <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
