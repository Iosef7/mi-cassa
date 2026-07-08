import Importer from 'mysql-import';

const host = 'bypl9cekpnftzdhicmpb-mysql.services.clever-cloud.com';
const port = 3306;
const database = 'bypl9cekpnftzdhicmpb';
const user = 'uvzcalvyrqkphyy4';
const password = 'kYTtO6nLnZzesK3aWUhx';
const sqlFilePath = 'C:\\Users\\iosef\\Downloads\\u777600273_aGgYS.micassaisrael-com.20260621033627.sql\\u777600273_aGgYS.sql';

const importer = new Importer({host, port, user, password, database});

let lastLog = 0;
importer.onProgress(progress => {
  const percent = Math.floor(progress.bytes_processed / progress.total_bytes * 100);
  if (percent > lastLog) {
      console.log(`${percent}% Completed`);
      lastLog = percent;
  }
});

importer.import(sqlFilePath).then(()=>{
  var files_imported = importer.getImported();
  console.log(`${files_imported.length} SQL file(s) imported.`);
}).catch(err=>{
  console.error(err);
});
