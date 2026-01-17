// api/proxy.js
// Menggunakan format CommonJS agar kompatibel dengan Vercel default

module.exports = async (req, res) => {
  // 1. Ambil ID dan Key dari URL
  const { id, key } = req.query;

  if (!id || !key) {
    return res.status(400).json({ error: 'Parameter id dan key wajib ada.' });
  }

  try {
    // 2. URL Google Drive
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`;

    // 3. Fetch ke Google
    // Node.js 18+ di Vercel sudah support fetch bawaan
    const response = await fetch(driveUrl);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Error (${response.status}): ${errorText}`);
    }

    // 4. Ambil Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Kirim ke Browser dengan Header CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Penting untuk CORS
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Cache-Control', 's-maxage=86400'); // Cache agar cepat
    
    res.status(200).send(buffer);

  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ 
      error: 'Gagal mengambil file.', 
      details: error.message 
    });
  }
};
