"use client";

import React, { useState } from 'react';
import { Bot, Send, Search, MapPin, Building, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: string;
  minPrice: string | null;
  status: string;
  images: string;
}

interface MatchResult {
  propertyId: string;
  reasoning: string;
  property: Property;
}

interface ChatResponse {
  matches: MatchResult[];
  generalAdvice: string;
}

export default function AIMatchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error('Error al conectar con la IA');
      
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS' }).format(Number(price));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border px-8 py-6 shrink-0 shadow-sm relative z-10 animate-in">
        <h1 className="text-3xl font-black tracking-tight text-gradient flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          IA Matchmaker
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Describe lo que busca tu cliente y la IA encontrará los mejores proyectos de tu catálogo al instante.
        </p>
      </div>

      <div className="flex-1 overflow-auto p-8 flex flex-col md:flex-row gap-8 relative">
        {/* Glow background effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Chat / Input Section */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 animate-in" style={{animationDelay: '100ms'}}>
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 flex-1 flex flex-col relative overflow-hidden glass">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/20 p-3 rounded-full glow-effect">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Asistente IA</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 bg-muted/50 p-5 rounded-xl border border-border/50">
              ¡Hola! Escribe los requerimientos de tu cliente. Por ejemplo: <br/><br/>
              <span className="italic text-foreground">"Busco un departamento en Polanco para una familia. Tienen un presupuesto de 10 a 15 millones."</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-auto flex flex-col gap-4">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe el perfil del cliente aquí..."
                className="w-full p-4 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none resize-none h-32 bg-background/50 backdrop-blur-sm text-foreground transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="w-full bg-primary text-primary-foreground rounded-xl py-3 px-4 font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover-lift shadow-lg shadow-primary/25"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analizando Catálogo...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" /> Encontrar Match
                  </>
                )}
              </button>
            </form>
            {error && <p className="text-destructive text-sm mt-4 text-center font-medium">{error}</p>}
          </div>
        </div>

        {/* Results Section */}
        <div className="w-full md:w-2/3 animate-in" style={{animationDelay: '200ms'}}>
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-4">
              <Sparkles className="w-12 h-12 animate-pulse text-primary/50 glow-effect rounded-full" />
              <p className="font-medium animate-pulse">La IA está evaluando cientos de opciones...</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 text-foreground shadow-sm glass">
                <p className="font-medium flex gap-3"><Sparkles className="text-primary w-5 h-5 shrink-0"/> <span><strong>Análisis de IA:</strong> {result.generalAdvice}</span></p>
              </div>

              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">Top Resultados <span className="bg-primary text-primary-foreground text-sm px-2 py-0.5 rounded-md">{result.matches?.length || 0}</span></h3>
              
              <div className="grid grid-cols-1 gap-6">
                {result.matches?.map((match, index) => {
                  let img = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600";
                  try { const p = JSON.parse(match.property.images); if(p[0]) img = p[0]; } catch(e){}

                  return (
                    <div key={index} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col md:flex-row group hover-lift animate-in" style={{animationDelay: `${index * 100}ms`}}>
                      <div className="w-full md:w-56 h-56 md:h-auto relative shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 md:bg-gradient-to-l"></div>
                        <img src={img} alt={match.property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-3 left-3 z-20 bg-primary/90 backdrop-blur text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          Match #{index + 1}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col justify-center flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">{match.property.title}</h4>
                          <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold px-3 py-1 rounded-full border border-green-500/20 shrink-0">
                            {match.property.minPrice ? `Desde ${formatPrice(match.property.minPrice)}` : formatPrice(match.property.price)}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground mb-4 font-medium">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-primary/70" /> {match.property.location}</span>
                          <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md"><Building className="w-4 h-4 text-primary/70" /> {match.property.type}</span>
                        </div>
                        <div className="bg-background/50 rounded-xl p-4 border border-border mt-auto relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                          <p className="text-sm text-foreground/80 italic font-medium">
                            "{match.reasoning}"
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-8 border-2 border-dashed border-border rounded-3xl bg-card/50 glass">
              <div className="bg-primary/10 p-5 rounded-full mb-6">
                <Bot className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">IA Lista para Operar</h3>
              <p className="max-w-md font-medium">Ingresa las preferencias de tu cliente en el chat y el algoritmo buscará el match perfecto en el catálogo.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
