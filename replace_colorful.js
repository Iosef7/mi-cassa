const fs = require('fs');
const path = require('path');

const filesToProcess = [
  "src/app/admin/propiedades/new/PropertyNewClient.tsx",
  "src/app/admin/rentas/new/page.tsx",
  "src/app/admin/proyectos/new/page.tsx",
  "src/app/admin/propiedades/[id]/PropertyDetailClient.tsx",
  "src/app/admin/rentas/[id]/page.tsx",
];

const processFile = (filePath) => {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;

  // w-32 h-32 text-indigo-600
  content = content.replace(/<GeminiIcon className="w-32 h-32 text-indigo-600" \/>/g, '<GeminiIcon className="w-32 h-32" colorful />');
  
  // text-fuchsia-600
  content = content.replace(/<GeminiIcon className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-600" \/>/g, '<GeminiIcon className="w-5 h-5 md:w-6 md:h-6" colorful />');

  // text-primary mx-auto mb-3
  content = content.replace(/<GeminiIcon className="w-8 h-8 text-primary mx-auto mb-3" \/>/g, '<GeminiIcon className="w-8 h-8 mx-auto mb-3" colorful />');
  
  if (originalContent !== content) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log("Updated: " + filePath);
  }
};

filesToProcess.forEach(processFile);
