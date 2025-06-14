import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// ES module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch balances
app.get('/api/balance/:address', async (req, res) => {
  const address = req.params.address;

  try {
    const [v1, v2] = await Promise.all([
      fetch(`https://explorer.brn.t3rn.io/address/${address}`).then(r => r.json()),
      fetch(`https://b2n.explorer.caldera.xyz/address/${address}`).then(r => r.json())
    ]);

    res.json({
      v1: v1.balance || 0,
      v2: v2.balance || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

app.listen(port, () => {
  console.log(`BRN Balance Checker running at http://localhost:${port}`);
});
