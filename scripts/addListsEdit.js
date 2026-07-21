const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'admin', 'propiedades', '[id]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Helper function to build the edit block
function buildEditBlock(sectionName, stateList, setStateList, handleSaveKey) {
  return `{editingSection === '${sectionName}' ? (
                    <div className="space-y-4">
                      {${stateList}.map((url, i) => (
                        <div key={i} className="flex gap-2">
                          <input value={url} onChange={(e) => {
                            const newList = [...${stateList}]; newList[i] = e.target.value; ${setStateList}(newList);
                          }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                          <button onClick={() => ${setStateList}(${stateList}.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <button onClick={() => ${setStateList}([...${stateList}, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                      <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                        <button onClick={() => handleSaveSection(['${handleSaveKey}'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                      </div>
                    </div>
                  ) : (
                    <>`;
}


// 1. Recorridos Virtuales y Videos
const videosHeader = /<h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">\s*<Building className="text-primary w-5 h-5" \/> Recorridos Virtuales y Videos\s*<\/h3>/m;
const videosReplacement = `<div className="flex justify-between items-center mb-4 group">
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Building className="text-primary w-5 h-5" /> Recorridos Virtuales y Videos
                      </h3>
                      {editingSection !== 'videos' && (
                        <button onClick={() => setEditingSection('videos')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                      )}
                    </div>`;
content = content.replace(videosHeader, videosReplacement);
content = content.replace(/\{videosList\.length > 0 \? \(/m, buildEditBlock('videos', 'videosList', 'setVideosList', 'videosList') + '\n{videosList.length > 0 ? (');
content = content.replace(/No se han subido recorridos virtuales para esta propiedad\.<\/p>\s*<\/div>\s*\)\}/m, 'No se han subido recorridos virtuales para esta propiedad.</p>\n                      </div>\n                    )}\n                    </>\n                  )}');


// 2. Presentaciones y Brochures
const presHeader = /<h4 className="font-bold text-lg mb-4">Presentaciones y Brochures<\/h4>/m;
const presReplacement = `<div className="flex justify-between items-center mb-4 group">
                      <h4 className="font-bold text-lg">Presentaciones y Brochures</h4>
                      {editingSection !== 'presentations' && (
                        <button onClick={() => setEditingSection('presentations')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                      )}
                    </div>`;
content = content.replace(presHeader, presReplacement);
content = content.replace(/\{presentationsList\.length > 0 \? \(/m, buildEditBlock('presentations', 'presentationsList', 'setPresentationsList', 'presentationsList') + '\n{presentationsList.length > 0 ? (');
content = content.replace(/No hay presentaciones cargadas\.<\/p>\s*\)\}/m, 'No hay presentaciones cargadas.</p>\n                    )}\n                    </>\n                  )}');


// 3. Afiches Promocionales
const postersHeader = /<h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">\s*<ImageIcon className="text-primary w-5 h-5" \/> Afiches Promocionales\s*<\/h3>/m;
const postersReplacement = `<div className="flex justify-between items-center mb-4 group">
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <ImageIcon className="text-primary w-5 h-5" /> Afiches Promocionales
                      </h3>
                      {editingSection !== 'posters' && (
                        <button onClick={() => setEditingSection('posters')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                      )}
                    </div>`;
content = content.replace(postersHeader, postersReplacement);
content = content.replace(/\{postersList\.length > 0 \? \(/m, buildEditBlock('posters', 'postersList', 'setPostersList', 'postersList') + '\n{postersList.length > 0 ? (');
content = content.replace(/No se han subido afiches\.<\/p>\s*<\/div>\s*\)\}/m, 'No se han subido afiches.</p>\n                      </div>\n                    )}\n                    </>\n                  )}');


// 4. Planos Arquitectónicos
const plansHeader = /<h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">\s*<MapPin className="text-primary w-6 h-6" \/> Planos Arquitectónicos\s*<\/h3>/m;
const plansReplacement = `<div className="flex justify-between items-center mb-6 group">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <MapPin className="text-primary w-6 h-6" /> Planos Arquitectónicos
                    </h3>
                    {editingSection !== 'plans' && (
                      <button onClick={() => setEditingSection('plans')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                    )}
                  </div>`;
content = content.replace(plansHeader, plansReplacement);
content = content.replace(/\{plansList\.length > 0 \? \(/m, buildEditBlock('plans', 'plansList', 'setPlansList', 'plansList') + '\n{plansList.length > 0 ? (');
content = content.replace(/No se han subido planos arquitectónicos\.<\/p>\s*<\/div>\s*\)\}/m, 'No se han subido planos arquitectónicos.</p>\n                    </div>\n                  )}\n                  </>\n                )}');


// 5. Documentos Legales (in Comercial)
const legalDocsHeader = /<h4 className="font-bold text-lg mb-4">Documentos Legales<\/h4>/m;
const legalDocsReplacement = `<div className="flex justify-between items-center mb-4 group">
                      <h4 className="font-bold text-lg">Documentos Legales</h4>
                      {editingSection !== 'legalDocs' && (
                        <button onClick={() => setEditingSection('legalDocs')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                      )}
                    </div>`;
content = content.replace(legalDocsHeader, legalDocsReplacement);
content = content.replace(/\{legalDocsList && legalDocsList\.length > 0 \? \(/m, buildEditBlock('legalDocs', 'legalDocsList', 'setLegalDocsList', 'legalDocsList') + '\n{legalDocsList && legalDocsList.length > 0 ? (');
content = content.replace(/No hay documentos legales adjuntos\.<\/p>\s*\)\}/m, 'No hay documentos legales adjuntos.</p>\n                      )}\n                      </>\n                    )}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Modified multimedia and legal docs sections');
