const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Latest API token configured for IP 27.59.108.71
let API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijc0M2RmYjk2LWZmYjMtNDIwMC1iMmYxLThjNWRjYzNlNzVhMyIsImlhdCI6MTc0NTA1NTU0NSwic3ViIjoiZGV2ZWxvcGVyLzdiZWIyNGYzLTg4YWYtMThlYi1mZDk5LWMzMzVmZjJkZDYyOCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjI3LjU5LjEwOC43MSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.vhJIobdEO2kRXf75aM1c1yJqh0gpIrakJUtYImHIcrvRDJEcbjnng-br7WP_PGZFwSYjfxIFfTpQNDqtKhnJsA';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Root route - serves the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Set API token route
app.post('/set-token', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }
    
    API_TOKEN = token;
    res.json({ success: true, message: 'Token set successfully' });
});

// Proxy route for player details
app.get('/api/players/:playerTag', async (req, res) => {
    try {
        let { playerTag } = req.params;
        
        if (!API_TOKEN) {
            return res.status(401).json({ error: 'API token not set. Please set a token first.' });
        }
        
        // Ensure the player tag has a # symbol
        if (!playerTag.startsWith('#')) {
            playerTag = `#${playerTag}`;
        }
        
        // URL encode the player tag (specifically the # symbol to %23)
        // Remove any existing URL encoding first to avoid double encoding
        playerTag = playerTag.replace(/%23/g, '#');
        const encodedTag = encodeURIComponent(playerTag);
        
        console.log(`Searching for player tag: ${playerTag}`);
        console.log(`Encoded player tag: ${encodedTag}`);
        
        const apiUrl = `https://api.clashofclans.com/v1/players/${encodedTag}`;
        console.log(`API URL: ${apiUrl}`);
        
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching player data:', error.response?.data || error.message);
        
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.message || 'An error occurred while fetching player data';
        
        res.status(statusCode).json({
            error: true,
            message: errorMessage
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
}); 