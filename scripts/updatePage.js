const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'admin', 'propiedades', '[id]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add editingSection and isSaving
content = content.replace(
  `const [isEditing, setIsEditing] = useState(false);`,
  `const [editingSection, setEditingSection] = useState<string | null>(null);\n  const [isSaving, setIsSaving] = useState(false);`
);

// 2. Add handleSaveSection right after handleSaveLead
content = content.replace(
  `const handleLeadStatusChange`,
  `const handleSaveSection = async (sectionFields: string[]) => {
    setIsSaving(true);
    try {
      const payload: any = {};
      sectionFields.forEach(f => {
        payload[f] = formData[f];
      });
      if (sectionFields.includes('imagesList')) payload.images = imagesList.filter(url => url.trim() !== '');
      if (sectionFields.includes('presentationsList')) payload.presentations = presentationsList.filter(url => url.trim() !== '');
      if (sectionFields.includes('plansList')) payload.plans = plansList.filter(url => url.trim() !== '');
      if (sectionFields.includes('videosList')) payload.videos = videosList.filter(url => url.trim() !== '');
      if (sectionFields.includes('legalDocsList')) payload.legalDocs = legalDocsList.filter(url => url.trim() !== '');
      if (sectionFields.includes('postersList')) payload.posters = postersList.filter(url => url.trim() !== '');

      await fetch(\`/api/properties/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setEditingSection(null);
      fetchProperty();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeadStatusChange`
);

// 3. Remove massive isEditing block
// We need to find {isEditing ? ( ... ) : ( <div className="space-y-8"> ... )}
const editingRegex = /\{\s*isEditing\s*\?\s*\([\s\S]*?\)\s*:\s*\(\s*<div className="space-y-8">/m;
content = content.replace(editingRegex, `<div className="space-y-8">`);
// Remove the closing bracket of the ternary operator at the very end
// Actually the end of that block is `          </div>\n        )}\n      </div>`
content = content.replace(/          <\/div>\n        \)}\n      <\/div>/, `          </div>\n      </div>`);


// 4. Header title edit mode
content = content.replace(
  /\{isEditing \? 'Editando Propiedad' : property.title\}/,
  `{editingSection === 'header' ? (
                  <div className="flex gap-2 items-center">
                    <input 
                      autoFocus
                      value={formData.title} 
                      onChange={e=>setFormData({...formData, title: e.target.value})} 
                      className="bg-background border border-border rounded-lg px-3 py-1 text-2xl font-black w-96" 
                    />
                    <button onClick={() => setEditingSection(null)} className="p-1 hover:bg-muted rounded-full"><X className="w-5 h-5 text-muted-foreground"/></button>
                    <button onClick={() => handleSaveSection(['title'])} disabled={isSaving} className="p-1 hover:bg-primary/20 bg-primary/10 rounded-full"><Save className="w-5 h-5 text-primary"/></button>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center group">
                    {property.title}
                    <button onClick={() => setEditingSection('header')} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                  </div>
                )}`
);

// 5. Header price edit mode
content = content.replace(
  /\{!isEditing && \(\s*<div className="mt-1">\s*<p className="text-primary font-bold text-lg">\{formatPrice\(property\.price\)\}<\/p>\s*(?:\{[^\}]*\})?\s*<\/div>\s*\)\}/m,
  `{editingSection === 'header' ? (
                  <div className="mt-2 flex gap-2">
                    <input 
                      type="number"
                      value={formData.price} 
                      onChange={e=>setFormData({...formData, price: e.target.value})} 
                      className="bg-background border border-border rounded-lg px-3 py-1 w-48 text-sm"
                      placeholder="Precio..."
                    />
                    <button onClick={() => handleSaveSection(['price'])} disabled={isSaving} className="text-xs px-2 py-1 bg-primary text-white rounded-lg">Guardar Precio</button>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="text-primary font-bold text-lg">{formatPrice(property.price)}</p>
                    {property.area && property.area > 0 && !isNaN(Number(property.price)) && (
                      <p className="text-muted-foreground text-sm font-medium">
                        {formatPrice((Number(property.price) / property.area).toString())} / m²
                      </p>
                    )}
                  </div>
                )}`
);

// 6. Header Buttons
const headerButtonsRegex = /\{isEditing \? \([\s\S]*?\} \([\s\S]*?Editar Propiedad[\s\S]*?<\/button>\s*\)\}/;
content = content.replace(headerButtonsRegex, ``);

// 7. Tabs nav - remove !isEditing
content = content.replace(/\{!isEditing && \(\s*<div className="bg-card border-b border-border/m, `<div className="bg-card border-b border-border`);
content = content.replace(/<\/button>\s*<\/div>\s*<\/div>\s*\)\}\s*<div className="p-8 max-w-6xl/m, `</button>\n          </div>\n        </div>\n\n      <div className="p-8 max-w-6xl`);

// 8. Description edit mode
const descRegex = /<h3 className="text-2xl font-bold mb-4 text-foreground">Acerca de la propiedad<\/h3>\s*<div className="relative">[\s\S]*?<\/button>\s*\)\}\s*<\/div>/m;
content = content.replace(descRegex, `<div className="flex justify-between items-center mb-4 group">
                        <h3 className="text-2xl font-bold text-foreground">Acerca de la propiedad</h3>
                        {editingSection !== 'description' && (
                          <button onClick={() => setEditingSection('description')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                        )}
                      </div>
                      
                      {editingSection === 'description' ? (
                        <div className="space-y-4">
                          <textarea 
                            rows={6}
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none resize-none"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                            <button onClick={() => handleSaveSection(['description'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
                              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <p className={\`text-muted-foreground whitespace-pre-wrap leading-relaxed transition-all duration-300 \${!isDescriptionExpanded ? 'line-clamp-4' : ''}\`}>
                            {property.description || "Sin descripción proporcionada."}
                          </p>
                          {property.description && property.description.length > 200 && (
                            <button 
                              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                              className="text-primary font-bold mt-3 text-sm hover:underline focus:outline-none flex items-center gap-1"
                            >
                              {isDescriptionExpanded ? 'Mostrar menos' : 'Leer descripción completa'}
                            </button>
                          )}
                        </div>
                      )}`);


// 9. Location edit mode
const locRegex = /<h4 className="font-bold text-lg mb-1">Ubicación<\/h4>\s*<p className="text-muted-foreground">\{property.location\}<\/p>/m;
content = content.replace(locRegex, `<div className="flex justify-between items-center w-full group">
                          <h4 className="font-bold text-lg mb-1">Ubicación</h4>
                          {editingSection !== 'location' && (
                            <button onClick={() => setEditingSection('location')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-full transition-opacity -mt-2"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                          )}
                        </div>
                        {editingSection === 'location' ? (
                          <div className="space-y-3 w-full">
                            <input 
                              value={formData.location}
                              onChange={e => setFormData({...formData, location: e.target.value})}
                              className="w-full p-2 rounded-lg bg-background border border-border outline-none"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button onClick={() => setEditingSection(null)} className="px-3 py-1.5 text-xs font-semibold hover:bg-muted rounded-lg">Cancelar</button>
                              <button onClick={() => handleSaveSection(['location'])} disabled={isSaving} className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg">Guardar</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">{property.location}</p>
                        )}`);


// 10. Ficha Técnica edit mode
const fichaRegex = /<h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">\s*<FileText className="text-primary w-6 h-6" \/> Ficha Técnica\s*<\/h3>/m;
content = content.replace(fichaRegex, `<div className="flex justify-between items-center mb-6 group">
                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                          <FileText className="text-primary w-6 h-6" /> Ficha Técnica
                        </h3>
                        {editingSection !== 'specs' && (
                          <button onClick={() => setEditingSection('specs')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                        )}
                      </div>`);

// Replace the specs grid with conditional
const specsGridRegex = /<div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/m;
const matchSpecs = content.match(specsGridRegex);
if (matchSpecs) {
  content = content.replace(specsGridRegex, `{editingSection === 'specs' ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Tipo de Inmueble</label>
                              <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none">
                                <option value="CASA">Casa</option>
                                <option value="DEPARTAMENTO">Departamento</option>
                                <option value="TERRENO">Terreno</option>
                                <option value="PROYECTO">Proyecto</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Habitaciones</label>
                              <input type="number" value={formData.bedrooms} onChange={e=>setFormData({...formData, bedrooms: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Baños</label>
                              <input type="number" value={formData.bathrooms} onChange={e=>setFormData({...formData, bathrooms: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Construcción (m²)</label>
                              <input type="number" value={formData.area} onChange={e=>setFormData({...formData, area: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                            <button onClick={() => handleSaveSection(['type', 'bedrooms', 'bathrooms', 'area'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                          </div>
                        </div>
                      ) : (
                        ${matchSpecs[0]}
                      )}`);
}

// 11. Datos del propietario edit mode
const ownerRegex = /<h4 className="font-bold text-lg mb-4">Datos del Propietario<\/h4>/m;
content = content.replace(ownerRegex, `<div className="flex justify-between items-center mb-4 group">
                        <h4 className="font-bold text-lg">Datos del Propietario</h4>
                        {editingSection !== 'owner' && (
                          <button onClick={() => setEditingSection('owner')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                        )}
                      </div>`);

// Replace owner view
const ownerViewRegex = /\{property\.ownerName \|\| property\.ownerPhone \|\| property\.ownerEmail \|\| property\.ownerNotes \? \([\s\S]*?\} \([\s\S]*?Registrar Propietario\s*<\/button>\s*<\/div>\s*\)\}/m;
const matchOwner = content.match(ownerViewRegex);
if(matchOwner){
  content = content.replace(ownerViewRegex, `{editingSection === 'owner' ? (
                        <div className="space-y-4">
                          <input placeholder="Nombre" value={formData.ownerName} onChange={e=>setFormData({...formData, ownerName: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                          <div className="flex gap-4">
                            <input placeholder="Teléfono" value={formData.ownerPhone} onChange={e=>setFormData({...formData, ownerPhone: e.target.value})} className="flex-1 p-2 rounded-lg border border-border bg-background outline-none" />
                            <input placeholder="Correo" value={formData.ownerEmail} onChange={e=>setFormData({...formData, ownerEmail: e.target.value})} className="flex-1 p-2 rounded-lg border border-border bg-background outline-none" />
                          </div>
                          <textarea rows={3} placeholder="Notas internas..." value={formData.ownerNotes} onChange={e=>setFormData({...formData, ownerNotes: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none resize-none" />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingSection(null)} className="px-3 py-1.5 text-xs font-semibold hover:bg-muted rounded-lg">Cancelar</button>
                            <button onClick={() => handleSaveSection(['ownerName', 'ownerPhone', 'ownerEmail', 'ownerNotes'])} disabled={isSaving} className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg">Guardar</button>
                          </div>
                        </div>
                      ) : (
                        ${matchOwner[0].replace(/setIsEditing\(true\)/g, `setEditingSection('owner')`)}
                      )}`);
}

// 12. Fix the parenthesis matching for ownerViewRegex since matchOwner[0] might be missing a parenthesis
// The match is { ... } inside a JSX block.

// 13. Galleries edit mode? Let's add basic pencil to "Multimedia y Planos" sections (images are already somewhat handled if we edit... actually images gallery only has "View" mode now).
// For images:
const imagesRegex = /\{imagesList\.length > 0 \? \(\s*<div className="grid grid-cols-1 md:grid-cols-3 gap-4">/m;
content = content.replace(imagesRegex, `<div className="flex justify-between items-center mb-4 group">
                    <h3 className="text-xl font-bold">Imágenes Principales</h3>
                    {editingSection !== 'images' && (
                      <button onClick={() => setEditingSection('images')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                    )}
                  </div>
                  {editingSection === 'images' ? (
                    <div className="space-y-4 bg-card border border-border rounded-3xl p-6 shadow-sm">
                      {imagesList.map((img, i) => (
                        <div key={i} className="flex gap-2">
                          <input value={img} onChange={(e) => {
                            const newList = [...imagesList]; newList[i] = e.target.value; setImagesList(newList);
                          }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                          <button onClick={() => setImagesList(imagesList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <button onClick={() => setImagesList([...imagesList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir Imagen</button>
                      <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                        <button onClick={() => handleSaveSection(['imagesList'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                      </div>
                    </div>
                  ) : (
                  {imagesList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">`);
                    
// Need to add closing `)}` after the images display
content = content.replace(/No hay imágenes cargadas\s*<\/div>\s*\)\}/m, `No hay imágenes cargadas\n                  </div>\n                )}\n                )}`);


fs.writeFileSync(filePath, content, 'utf8');
console.log('Done modifying page.tsx');
