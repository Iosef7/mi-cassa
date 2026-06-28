const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'admin', 'propiedades', '[id]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const helperFunction = `
// --- Lead Scoring Helper ---
const calculateLeadScore = (lead: any, propertyPrice: number) => {
  let score = 0;
  const breakdown = [];

  // 1. Status (Max 40)
  let statusScore = 0;
  if (lead.status === 'CERRADO_GANADO') statusScore = 40;
  else if (lead.status === 'FIRMA') statusScore = 35;
  else if (lead.status === 'NEGOCIACION') statusScore = 30;
  else if (lead.status === 'VISITA_AGENDADA') statusScore = 20;
  else if (lead.status === 'CONTACTADO') statusScore = 10;
  else statusScore = 5; // NUEVO
  score += statusScore;
  breakdown.push({ name: 'Progreso (Status)', score: statusScore, max: 40, desc: 'Avanza conforme el cliente pasa de Nuevo hasta Cierre.' });

  // 2. Budget (Max 30)
  let budgetScore = 0;
  if (!lead.budget) {
    budgetScore = 5;
  } else if (propertyPrice && Number(lead.budget) >= propertyPrice) {
    budgetScore = 30;
  } else if (propertyPrice && Number(lead.budget) >= propertyPrice * 0.9) {
    budgetScore = 20;
  } else {
    budgetScore = 10;
  }
  score += budgetScore;
  breakdown.push({ name: 'Presupuesto', score: budgetScore, max: 30, desc: 'Compara el presupuesto del cliente con el precio de la propiedad. Mayor presupuesto = mejor puntuación.' });

  // 3. Finance (Max 15)
  let financeScore = lead.requiresMortgage ? 5 : 15;
  score += financeScore;
  breakdown.push({ name: 'Financiamiento', score: financeScore, max: 15, desc: 'Compras de contado (sin crédito) obtienen mayor puntuación por rapidez de cierre.' });

  // 4. Source (Max 15)
  let sourceScore = 5;
  const src = (lead.source || '').toLowerCase();
  if (src.includes('referido') || src.includes('directo')) sourceScore = 15;
  else if (src.includes('whatsapp') || src.includes('web')) sourceScore = 10;
  score += sourceScore;
  breakdown.push({ name: 'Origen (Source)', score: sourceScore, max: 15, desc: 'Leads referidos u orgánicos suelen tener mayor intención de compra que los de anuncios.' });

  let summary = '';
  if (score >= 80) summary = '🔥 Prospecto Muy Caliente. Altamente calificado, excelente presupuesto y etapa avanzada. ¡Prioridad máxima!';
  else if (score >= 50) summary = '⭐ Prospecto Interesante. Buen perfil, pero requiere más seguimiento o empujar a la siguiente etapa del embudo.';
  else summary = '❄️ Prospecto Frío. Recién llegado o con presupuesto limitado. Mantener en nutrición a largo plazo.';

  return { total: score, breakdown, summary };
};

export default function PropertyDetailsPage({ params }: any) {`;

content = content.replace(/export default function PropertyDetailsPage\(\{ params \}: any\) \{/, helperFunction);

// Add state
const stateRegex = /const \[expandedLeadId, setExpandedLeadId\] = useState<string \| null>\(null\);/;
const stateRepl = `const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);\n  const [showScoreForLead, setShowScoreForLead] = useState<string | null>(null);`;
content = content.replace(stateRegex, stateRepl);

// Map the score calculation and button
const leadHeaderRegex = /<h5 className="font-bold text-sm text-foreground leading-tight flex items-center gap-1">\s*\{lead\.name\}/m;
const leadHeaderRepl = `
const scoreData = calculateLeadScore(lead, Number(property.price));

                          return (
                            <div key={lead.id} className="p-3 bg-muted rounded-2xl flex flex-col gap-2 border border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-sm text-foreground leading-tight flex items-center gap-1">
                                    {lead.name}
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setShowScoreForLead(showScoreForLead === lead.id ? null : lead.id); }}
                                      className="ml-2 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-black flex items-center gap-1 border border-orange-200 hover:bg-orange-200 transition-colors"
                                      title="Ver Calificación (Scoring)"
                                    >
                                      🔥 {scoreData.total}%
                                    </button>
`;

// Wait, the `return (` is before this. Let's do it carefully.
const renderLeadRegex = /const nextAppointment = lead\.appointments && lead\.appointments\.length > 0 \n\s*\? new Date\(lead\.appointments\[0\]\.date\) \n\s*: null;\n\n\s*return \(\n\s*<div key=\{lead\.id\} className="p-3 bg-muted rounded-2xl flex flex-col gap-2 border border-border\/50 hover:border-border transition-colors cursor-pointer" onClick=\{\(\) => setExpandedLeadId\(isExpanded \? null : lead\.id\)\}>\n\s*<div className="flex justify-between items-start">\n\s*<div>\n\s*<h5 className="font-bold text-sm text-foreground leading-tight flex items-center gap-1">\n\s*\{lead\.name\}/m;

const renderLeadRepl = `const nextAppointment = lead.appointments && lead.appointments.length > 0 
                            ? new Date(lead.appointments[0].date) 
                            : null;

                          const scoreData = calculateLeadScore(lead, Number(property.price));

                          return (
                            <div key={lead.id} className="p-3 bg-muted rounded-2xl flex flex-col gap-2 border border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-sm text-foreground leading-tight flex items-center gap-1">
                                    {lead.name}
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setShowScoreForLead(showScoreForLead === lead.id ? null : lead.id); }}
                                      className="ml-2 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-black flex items-center gap-1 border border-orange-200 hover:bg-orange-200 transition-all hover:scale-105"
                                    >
                                      🔥 {scoreData.total}%
                                    </button>`;

content = content.replace(renderLeadRegex, renderLeadRepl);

// Add the Scoring Panel just before the end of the main lead card content, maybe after the Select element?
// Or right below the header row!
const underHeaderRegex = /<span className="text-\[10px\] font-semibold bg-secondary\/30 text-secondary-foreground px-1\.5 py-0\.5 rounded-md border border-border\/50">\n\s*\{lead\.source\}\n\s*<\/span>\n\s*\)\}\n\s*<\/div>\n\s*<\/div>\n\s*<select/m;

const underHeaderRepl = `<span className="text-[10px] font-semibold bg-secondary/30 text-secondary-foreground px-1.5 py-0.5 rounded-md border border-border/50">
                                        {lead.source}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <select`;

// Wait, I want to insert the Scoring UI directly under the "select" row so it's a full width block
const afterSelectRegex = /<\/select>\n\s*<\/div>\n\s*<div className="flex gap-2 mt-2" onClick=\{\(e\) => e\.stopPropagation\(\)\}>/m;

const afterSelectRepl = `</select>
                              </div>

                              {/* Lead Scoring Popover / Panel */}
                              {showScoreForLead === lead.id && (
                                <div className="mt-2 p-3 bg-background border border-orange-200 rounded-xl shadow-sm animate-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex justify-between items-center mb-2">
                                    <h6 className="font-bold text-xs text-foreground flex items-center gap-1">
                                      <Activity className="w-3.5 h-3.5 text-orange-500" /> Desglose de Calificación (Scoring)
                                    </h6>
                                    <button onClick={() => setShowScoreForLead(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5"/></button>
                                  </div>
                                  <div className="space-y-3 mt-3">
                                    {scoreData.breakdown.map((cat, idx) => (
                                      <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-semibold">
                                          <span className="flex items-center gap-1">
                                            {cat.name} 
                                            <span title={cat.desc} className="cursor-help text-muted-foreground hover:text-primary transition-colors">
                                              <Info className="w-3 h-3" />
                                            </span>
                                          </span>
                                          <span>{cat.score} / {cat.max}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: \`\${(cat.score / cat.max) * 100}%\` }}></div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-4 pt-3 border-t border-border/50 bg-orange-50/50 p-2 rounded-lg">
                                    <p className="text-[10px] text-foreground font-medium leading-relaxed">
                                      {scoreData.summary}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>`;

content = content.replace(afterSelectRegex, afterSelectRepl);

// Need to import Info from lucide-react if not imported
const lucideRegex = /import \{(.*?)\} from 'lucide-react';/m;
content = content.replace(lucideRegex, (match, p1) => {
  if (!p1.includes('Info')) {
    return `import {${p1}, Info} from 'lucide-react';`;
  }
  return match;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Lead scoring implementation added');
