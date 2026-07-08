import fs from 'fs';

const sqlFilePath = 'C:\\Users\\iosef\\Downloads\\u777600273_aGgYS.micassaisrael-com.20260621033627.sql\\u777600273_aGgYS.sql';

function parseSqlDump() {
  console.log('Reading SQL file...');
  const content = fs.readFileSync(sqlFilePath, 'utf-8');
  
  console.log('Extracting posts...');
  const properties = [];
  
  // A naive parser for wp_posts values
  // We look for INSERT INTO `wp_posts` VALUES
  let startIndex = 0;
  while ((startIndex = content.indexOf('INSERT INTO `wp_posts` VALUES', startIndex)) !== -1) {
    const endIndex = content.indexOf(';\n', startIndex);
    if (endIndex === -1) break;
    const block = content.substring(startIndex, endIndex);
    
    // Rows are separated by '),\n(' or similar. Let's use a regex to extract individual tuples safely.
    // Since post_content can contain anything, splitting by '),(' is slightly risky but usually works if we check the structure.
    // A safer way: match tuples that end with 'venta','','\d+' or similar.
    // Format: (ID, author, date, date_gmt, content, title, excerpt, status, comment_status, ping_status, password, name, to_ping, pinged, modified, modified_gmt, content_filtered, parent, guid, menu_order, post_type, mime_type, comment_count)
    
    // Regex for 'venta' posts:
    const regex = /\((\d+),\d+,'[^']+','[^']+',(?:'[^']*'|'.*?'),'([^']*)',.*?'(publish)','[^']*','[^']*','[^']*','[^']*','[^']*','[^']*','[^']+','[^']+',.*?\d+,'[^']*',\d+,'(venta)','',0\)/g;
    
    // The regex above is too complex and brittle. Let's do a simpler approach:
    // Split the block into rows by looking for (\d+, (which is the ID).
    // Actually, splitting by \n( is standard for mysqldump extended inserts.
    const rows = block.split(/\n\(/);
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.includes(",'venta',") && row.includes(",'publish',") && !row.includes('revision')) {
            // Extract ID: first number before comma
            const idMatch = row.match(/^(\d+),/);
            if (idMatch) {
                properties.push({ id: idMatch[1], raw: row });
            }
        }
    }
    
    startIndex = endIndex;
  }
  
  console.log(`Found ${properties.length} 'venta' properties.`);
  
  if (properties.length > 0) {
      console.log('Sample property ID:', properties[0].id);
      
      // Let's find postmeta for this property
      console.log('Extracting postmeta for property ID:', properties[0].id);
      
      let metaStartIndex = 0;
      const meta = [];
      while ((metaStartIndex = content.indexOf('INSERT INTO `wp_postmeta` VALUES', metaStartIndex)) !== -1) {
          const metaEndIndex = content.indexOf(';\n', metaStartIndex);
          if (metaEndIndex === -1) break;
          const metaBlock = content.substring(metaStartIndex, metaEndIndex);
          
          const metaRows = metaBlock.split(/\n\(/);
          for (let i = 1; i < metaRows.length; i++) {
              const row = metaRows[i];
              if (row.includes(`,${properties[0].id},`)) {
                  // extract key and value: (meta_id, post_id, 'meta_key', 'meta_value')
                  const metaMatch = row.match(/^\d+,\d+,'([^']+)','(.*)'\)?$/);
                  if (metaMatch) {
                      meta.push({ key: metaMatch[1], value: metaMatch[2] });
                  } else {
                      // fallback for values that might contain quotes
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
      
      console.log('Postmeta keys for first property:');
      console.log(meta.map(m => m.key).join(', '));
  }
}

parseSqlDump();
