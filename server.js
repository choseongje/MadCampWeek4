const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MUSIXMATCH_API_KEY = 'ae23e58adf36a1ba35f6f4911fe01518';

app.use(cors());

app.get('/lyrics', async (req, res) => {
  const { track, artist } = req.query;

  try {
    const response = await axios.get('https://api.musixmatch.com/ws/1.1/matcher.lyrics.get', {
      params: {
        q_track: track,
        q_artist: artist,
        apikey: MUSIXMATCH_API_KEY,
      },
    });

    res.json(response.data.message.body.lyrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
