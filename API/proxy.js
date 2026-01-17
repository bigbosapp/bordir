// Vercel Serverless Function (Node.js)
// Ini berjalan di server Vercel untuk mengambil file dari Google Drive
// agar tidak diblokir browser (Bypass CORS).

export default async function handler(req, res) {
  const { id, key } = req.query;

  if (!id || !key) {
    return res.status(400).json({ error: 'Missing id or key parameters' });
  }

  try {
    // 1. URL Download Google Drive
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`;

    // 2. Fetch file dari Google
    const response = await fetch(driveUrl);

    if (!response.ok) {
      throw new Error(`Google Drive Error: ${response.statusText}`);
    }

    // 3. Ambil data biner
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Kirim balik ke browser dengan Header yang benar
    res.setHeader('Access-Control-Allow-Origin', '*'); // Ijinkan akses dari mana saja
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
