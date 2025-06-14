const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/balance/:address', async (req, res) => {
  const address = req.params.address;

  try {
    // Request ke dua explorer
    const [v1Resp, v2Resp] = await Promise.all([
      fetch(`https://explorer.brn.t3rn.io/address/${address}`),
      fetch(`https://b2n.explorer.caldera.xyz/address/${address}`)
    ]);

    // Cek dulu apakah response OK
    if (!v1Resp.ok || !v2Resp.ok) {
      return res.status(500).json({ error: 'Failed to fetch from one or both APIs' });
    }

    const v1Data = await v1Resp.json();
    const v2Data = await v2Resp.json();

    // Ambil properti balance (kalau tidak ada, default 0)
    const v1Balance = v1Data.balance || 0;
    const v2Balance = v2Data.balance || 0;

    res.json({ v1: v1Balance, v2: v2Balance });
  } catch (error) {
    console.error('Error fetching balances:', error);
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

app.listen(port, () => {
  console.log(`BRN Balance Checker running at http://localhost:${port}`);
});
