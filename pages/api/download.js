import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  const filePath = path.resolve('./downloads', 'BIGFOOT-Connect-1.0.0.exe');
  const fileStat = fs.statSync(filePath);

  res.setHeader('Content-Length', fileStat.size);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', 'attachment; filename="BIGFOOT-Connect.exe"');

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}
