const express = require('express');
const { createCanvas } = require('canvas');

const app = express();
const PORT = 3000;

// Poem to embed in the image
const poem = `
The sun sets low in crimson hues,
A golden glow on morning dews,
Whispers of wind in endless flight,
Paints the sky with fading light.
`;

app.get('/api/poem-image', (req, res) => {
    const canvas = createCanvas(400, 300);
    const ctx = canvas.getContext('2d');

    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    const lines = poem.trim().split('\n');
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, 40 + index * 30);
    });

    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
});

app.get('/api/poem', (req, res) => {
    res.json({ poem });
});

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
