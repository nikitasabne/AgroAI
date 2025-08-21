const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { DatabaseManager } = require('./database/schema');

const app = express();
const PORT = process.env.PORT || 4200;
const db = new DatabaseManager();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// User Management
app.post('/api/users', async (req, res) => {
    try {
        const user = await db.createUser(req.body);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await db.getUserById(parseInt(req.params.id));
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Disease Analysis
app.post('/api/analyze-disease', async (req, res) => {
    try {
        const { imageData, cropType, userId } = req.body;

        // Simulate AI analysis processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get crop information from database
        const cropInfo = await db.getCropInfo(cropType || 'tomato');

        // Mock AI analysis result
        const diseases = cropInfo ? cropInfo.diseases : [
            {
                name: 'Leaf Blight',
                symptoms: ['circular spots on leaves', 'yellowing'],
                treatment: 'Apply copper-based fungicide',
                prevention: 'Improve air circulation'
            }
        ];

        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
        const confidence = Math.floor(Math.random() * 20) + 80; // 80-100%

        const analysis = {
            disease: randomDisease.name,
            confidence: confidence,
            severity: confidence > 90 ? 'High' : confidence > 70 ? 'Moderate' : 'Low',
            symptoms: randomDisease.symptoms,
            treatments: Array.isArray(randomDisease.treatment) ? randomDisease.treatment : [randomDisease.treatment],
            prevention: randomDisease.prevention
        };

        // Save analysis to database
        if (userId) {
            await db.saveDiseaseAnalysis({
                userId: parseInt(userId),
                cropType: cropType || 'unknown',
                diagnosis: analysis
            });
        }

        res.json({ success: true, analysis });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/disease-history/:userId', async (req, res) => {
    try {
        const history = await db.getDiseaseHistory(parseInt(req.params.userId));
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Weather API
app.get('/api/weather/:location', async (req, res) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const weatherData = await db.getWeatherData(req.params.location);
        res.json({ success: true, weather: weatherData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Market Data
app.get('/api/market-prices', async (req, res) => {
    try {
        const { crop, market } = req.query;
        const prices = await db.getMarketPrices(crop, market);
        res.json({ success: true, prices });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/buyers', async (req, res) => {
    try {
        const { cropType, location } = req.query;
        const buyers = await db.getBuyers(cropType, location);
        res.json({ success: true, buyers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/crop-listings', async (req, res) => {
    try {
        const listing = await db.createCropListing(req.body);
        res.json({ success: true, listing });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/crop-listings', async (req, res) => {
    try {
        const listings = await db.getCropListings(req.query);
        res.json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Chat API
app.post('/api/chat', async (req, res) => {
    try {
        const { message, language, userId } = req.body;

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate AI response based on message content
        const response = await generateAIResponse(message, language);

        // Save chat history
        if (userId) {
            await db.saveChatMessage(parseInt(userId), {
                type: 'user',
                content: message,
                language: language || 'en'
            });

            await db.saveChatMessage(parseInt(userId), {
                type: 'bot',
                content: response,
                language: language || 'en'
            });
        }

        res.json({ success: true, response, language: language || 'en' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/chat-history/:userId', async (req, res) => {
    try {
        const history = await db.getChatHistory(parseInt(req.params.userId));
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Crop Information
app.get('/api/crops', async (req, res) => {
    try {
        const crops = await db.getAllCrops();
        res.json({ success: true, crops });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/crops/:name', async (req, res) => {
    try {
        const crop = await db.getCropInfo(req.params.name);
        if (crop) {
            res.json({ success: true, crop });
        } else {
            res.status(404).json({ success: false, error: 'Crop not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Helper function for AI responses
async function generateAIResponse(message, language) {
    const lowerMessage = message.toLowerCase();

    const responses = {
        en: {
            weather: 'Based on current weather data, expect partly cloudy skies with temperatures around 28°C. Good conditions for most crops.',
            soil: 'For your soil type, I recommend crops like rice, wheat, or vegetables depending on the season. Consider soil testing for specific nutrients.',
            crop: 'Popular crops for this season include tomatoes, peppers, and leafy greens. Consider market demand in your area.',
            disease: 'Common plant diseases this season include leaf blight and powdery mildew. Ensure proper spacing and ventilation.',
            price: 'Current market prices show good rates for vegetables. Check the market section for detailed pricing.',
            irrigation: 'Water your crops early morning or evening. Check soil moisture before watering.',
            fertilizer: 'Use NPK fertilizer in ratio 10:10:10 for vegetative growth. Switch to high potassium during flowering.',
            harvest: 'Harvest vegetables when they reach proper size and color. Early morning harvest is best.',
            default: 'I understand you want farming advice. Could you be more specific about crops, weather, soil, diseases, or market prices?'
        },
        hi: {
            weather: 'मौजूदा मौसम के आधार पर, 28°C के आसपास तापमान के साथ आंशिक रूप से बादल छाए रहेंगे। अधिकांश फसलों के लिए अच्छी स्थिति।',
            soil: 'आपकी मिट्टी के प्रकार के लिए, मैं मौसम के आधार पर चावल, गेहूं या ���ब्जियों की सिफारिश करता हूं।',
            crop: 'इस मौसम की लोकप्रिय फसलों में टमाटर, मिर्च और पत्तेदार सब्जियां शामिल हैं।',
            default: 'मैं समझता हूं कि आप खेती की सलाह चाहते हैं। कृपया फसल, मौसम, मिट्टी या रोग के बारे में और स्पष्ट रूप से बताएं।'
        }
    };

    const langResponses = responses[language] || responses.en;

    for (const [key, response] of Object.entries(langResponses)) {
        if (lowerMessage.includes(key) || (key === 'default' && !lowerMessage.match(/weather|soil|crop|disease|price|irrigation|fertilizer|harvest/))) {
            return response;
        }
    }

    return langResponses.default;
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
