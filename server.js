const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4200;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints for future integration
app.use(express.json());

// Mock API endpoints
app.post('/api/analyze-disease', async (req, res) => {
    // Mock disease analysis endpoint
    setTimeout(() => {
        res.json({
            disease: 'Leaf Blight',
            confidence: 89,
            severity: 'Moderate',
            treatments: ['Apply fungicide', 'Remove affected leaves', 'Improve ventilation']
        });
    }, 2000);
});

app.get('/api/weather/:location', async (req, res) => {
    // Mock weather API endpoint
    setTimeout(() => {
        res.json({
            temperature: 28,
            humidity: 65,
            condition: 'Partly Cloudy',
            forecast: [
                { day: 'Today', temp: 28, condition: 'Partly Cloudy' },
                { day: 'Tomorrow', temp: 30, condition: 'Sunny' }
            ]
        });
    }, 1000);
});

app.get('/api/market-prices/:crop', async (req, res) => {
    // Mock market prices endpoint
    setTimeout(() => {
        res.json({
            crop: req.params.crop,
            prices: [
                { variety: 'Grade A', price: 25, market: 'Local Market' },
                { variety: 'Grade B', price: 22, market: 'Local Market' }
            ]
        });
    }, 1000);
});

app.post('/api/chat', async (req, res) => {
    // Mock chat API endpoint
    const { message, language } = req.body;
    setTimeout(() => {
        res.json({
            response: 'This is a mock response to: ' + message,
            language: language || 'en'
        });
    }, 1000);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
