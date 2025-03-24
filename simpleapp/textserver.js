const express = require('express');
const app = express();
const PORT = 3000;

// Simple poem text (no encoding)
const poem = `
The sun sets low in crimson hues,
A golden glow on morning dews,
Whispers of wind in endless flight,
Paints the sky with fading light.
`;

app.get('/api/poem', (req, res) => {
    res.json({ poem });
});

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


