import fs from 'fs';

const sqlFilePath = 'C:\\Users\\iosef\\Downloads\\u777600273_aGgYS.micassaisrael-com.20260621033627.sql\\u777600273_aGgYS.sql';

function analyzeSql() {
  const content = fs.readFileSync(sqlFilePath, 'utf-8');
  
  const postId = 3693; // Apartamento en la calle Duvdevani
  
  let metaStartIndex = 0;
  const meta = [];
  while ((metaStartIndex = content.indexOf('INSERT INTO `wp_postmeta` VALUES', metaStartIndex)) !== -1) {
      const metaEndIndex = content.indexOf(';\n', metaStartIndex);
      if (metaEndIndex === -1) break;
      const metaBlock = content.substring(metaStartIndex, metaEndIndex);
      
      const metaRows = metaBlock.split(/\n\(/);
      for (let i = 1; i < metaRows.length; i++) {
          const row = metaRows[i];
          if (row.includes(`,${postId},`)) {
              const metaMatch = row.match(/^\d+,\d+,'([^']+)','(.*)'\)?$/);
              if (metaMatch) {
                  meta.push({ key: metaMatch[1], value: metaMatch[2] });
              } else {
                  const parts = row.split(`,'`);
                  if (parts.length >= 2) {
                      const keyPart = parts[1].split(`',`)[0];
                      meta.push({ key: keyPart, rawValue: row });
                  }
              }
          }
      }
      metaStartIndex = metaEndIndex;
  }
  
  console.log(`Postmeta for post ID ${postId}:`);
  for (const m of meta) {
      console.log(`- ${m.key}: ${m.value ? m.value.substring(0, 50) : '<complex/raw>'}`);
  }
}

analyzeSql();
