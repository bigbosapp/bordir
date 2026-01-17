const https = require('https');

module.exports = (req, res) => {
    // 1. SETUP CORS (Agar tidak diblokir browser)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id, key } = req.query;

    if (!id || !key) {
        return res.status(400).json({ error: 'ID dan Key wajib diisi' });
    }

    const driveUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`;

    // 2. REQUEST MENGGUNAKAN HTTPS NODE.JS (Lebih Stabil)
    https.get(driveUrl, (googleRes) => {
        // Cek jika Google menolak (Misal 403 Forbidden / 404 Not Found)
        if (googleRes.statusCode !== 200) {
            return res.status(googleRes.statusCode).json({ 
                error: `Google Drive Error: ${googleRes.statusCode}`,
                message: "Pastikan API Key benar dan File/Folder di-set 'Anyone with the link'"
            });
        }

        // Set header agar dianggap file binary
        res.setHeader('Content-Type', 'application/octet-stream');
        
        // Pipe (salurkan) data langsung dari Google ke Browser pengguna
        googleRes.pipe(res);
        
    }).on('error', (e) => {
        res.status(500).json({ error: e.message });
    });
};
