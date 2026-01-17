// File: api/proxy.js
module.exports = async (req, res) => {
    const { id, key } = req.query;

    if (!id || !key) return res.status(400).send("ID & Key Missing");

    try {
        const url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${key}`;
        
        // Gunakan fetch bawaan Node.js (Vercel support Node 18+)
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(await response.text());
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/octet-stream');
        res.status(200).send(buffer);
    } catch (e) {
        res.status(500).send(e.message);
    }
};
