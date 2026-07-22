"use client";

import React from "react";
import { Smartphone, Settings, QrCode } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppLinkGuide() {
  const steps = [
    {
      icon: Smartphone,
      title: "Abre WhatsApp",
      description: "Abre la aplicación en tu celular.",
    },
    {
      icon: Settings,
      title: "Dispositivos Vinculados",
      description: "Ve a Configuración y selecciona 'Dispositivos Vinculados'.",
    },
    {
      icon: QrCode,
      title: "Vincular",
      description: "Toca 'Vincular dispositivo' y escanea o ingresa el código.",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-5 border border-green-100 dark:border-green-900/30">
      <h4 className="font-semibold text-green-800 dark:text-green-400 mb-4 text-sm flex items-center gap-2">
        <Smartphone className="w-4 h-4" />
        Instrucciones de Vinculación
      </h4>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-green-900/50 flex items-center justify-center border border-green-200 dark:border-green-800 shadow-sm text-green-600 dark:text-green-400">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-300">{step.title}</p>
                <p className="text-xs text-green-700/80 dark:text-green-500">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
