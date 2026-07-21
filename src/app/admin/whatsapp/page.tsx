"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Image as ImageIcon, Bot, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusTab from "./components/StatusTab";
import ConnectionsTab from "./components/ConnectionsTab";

const tabs = [
  { id: "conexiones", label: "Dispositivos", icon: Smartphone },
  { id: "estados", label: "Estados Automáticos", icon: ImageIcon },
  { id: "chatbot", label: "Chatbot (Próximamente)", icon: Bot },
  { id: "plantillas", label: "Plantillas (Próximamente)", icon: FileText },
];

export default function WhatsAppHub() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          WhatsApp Enterprise Hub
        </h1>
        <p className="text-muted-foreground">
          Centro de control unificado para tus conexiones, estados y mensajería automática.
        </p>
      </div>

      {/* Modern Tabs */}
      <div className="flex space-x-1 p-1 bg-muted/50 rounded-xl overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-background shadow-sm rounded-lg border border-border/50"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="relative mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "conexiones" && <ConnectionsTab />}
            {activeTab === "estados" && <StatusTab />}
            {activeTab === "chatbot" && (
              <div className="p-12 text-center border border-dashed rounded-xl bg-card">
                <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold">Motor de Inteligencia Artificial en Construcción</h3>
                <p className="text-muted-foreground mt-2">
                  Pronto podrás configurar embudos de respuesta automática y conectar Gemini a tus números de WhatsApp.
                </p>
              </div>
            )}
            {activeTab === "plantillas" && (
              <div className="p-12 text-center border border-dashed rounded-xl bg-card">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold">Gestor de Plantillas en Construcción</h3>
                <p className="text-muted-foreground mt-2">
                  Aquí podrás personalizar los textos que se envían por defecto (como los PIN de contratos).
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
