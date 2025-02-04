const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Enable CORS for frontend requests
app.use(cors());

// Serve the frontend HTML file
app.use(express.static('public'));

// Fetch data from the first external API
app.get('/api/fetchData', async (req, res) => {
  try {
    const response = await axios.get('https://www.site24x7.com/app/api/short/current_status', {
      headers: {
        'Authorization': 'Zoho-oauthtoken 1000.ee5b5a29a3aefb467d5084416a6556b3.1fe24a3ad67453166b6f9bbc4c162b28',
        'Content-Type': 'application/json',
      }
    });

    // Check if response data exists
    if (response.data && response.data.data && response.data.data.monitors) {
      const monitors = response.data.data.monitors;
      const monitorId = req.query.monitor_id;

      if (monitorId) {
        // Filter data for the specific Monitor ID
        const filteredMonitors = monitors.filter(monitor => monitor.monitor_id === monitorId);
        res.json({ data: { monitors: filteredMonitors } });
      } else {
        // Return all data
        res.json(response.data);
      }
    } else {
      res.status(500).send({ message: 'Invalid response structure from external API.' });
    }
  } catch (error) {
    // Log error to help debug the problem
    console.error('Error fetching data:', error.message);
    res.status(500).send({ message: 'Error fetching data from external API', error: error.message });
  }
});

// Fetch data from the second external API
app.get('/api/fetchServerData', async (req, res) => {
  try {
    const response = await axios.get('https://www.site24x7.com/app/api/current_status/type/SERVER', {
      headers: {
        'Authorization': 'Zoho-oauthtoken 1000.6330a69e8425352db80c76e543e46374.42c853e0779724e75fe5524475f3624d',
        'Content-Type': 'application/json',
      }
    });

    // Check if response data exists
    if (response.data && response.data.data && response.data.data.monitors_count) {
      const monitorsCount = response.data.data.monitors_count;
      res.json({ data: { monitors_count: monitorsCount } });
    } else {
      res.status(500).send({ message: 'Invalid response structure from external API.' });
    }
  } catch (error) {
    // Log error to help debug the problem
    console.error('Error fetching server data:', error.message);
    res.status(500).send({ message: 'Error fetching server data from external API', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
