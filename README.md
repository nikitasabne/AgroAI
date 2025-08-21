# AgroAI - Smart Farming Assistant Platform

A comprehensive AI-powered platform designed to assist farmers with crop disease detection, multilingual voice assistance, weather advisory, and market linkage capabilities.

## 🌟 Features

### 1. **Crop Disease Detection (AI Vision Model)**
- Upload plant photos for instant AI-powered disease diagnosis
- Get confidence scores and severity assessments
- Receive specific treatment recommendations
- Access prevention tips and best practices
- Maintain disease analysis history

### 2. **Voice-Based Q&A Chatbot (Multilingual Support)**
- Ask questions in your local language
- Supported languages: English, Hindi, Marathi, Kannada, Tamil, Telugu
- Voice recognition and text-to-speech capabilities
- Expert farming advice and recommendations
- Chat history tracking

### 3. **Weather Prediction & Crop Advisory**
- Real-time weather data and 5-day forecasts
- Location-based weather information
- Personalized crop recommendations based on weather
- Irrigation and planting advisories
- Harvest timing guidance

### 4. **Market Linkage & Price Updates**
- Real-time market price information
- Connect with verified buyers
- List crops for sale
- Local mandi price updates
- Buyer-seller communication platform

## 🚀 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: In-memory mock database (easily replaceable with MongoDB/PostgreSQL)
- **PWA**: Service Worker, Web App Manifest
- **APIs**: REST API architecture
- **Features**: Speech Recognition, Text-to-Speech, Geolocation

## 📱 Progressive Web App (PWA)

The platform is designed as a PWA with:
- **Offline Functionality**: Core features work without internet
- **Mobile Installation**: Can be installed on mobile devices
- **Push Notifications**: Important farming alerts
- **Responsive Design**: Works on all screen sizes
- **Fast Loading**: Optimized for slow network connections

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd agroai-platform

# Install dependencies
npm install

# Start the development server
npm run dev

# The application will be available at http://localhost:4200
```

### Production Deployment
```bash
# Start production server
npm start
```

## 📊 API Documentation

### Disease Analysis
```http
POST /api/analyze-disease
Content-Type: application/json

{
  "imageData": "base64_encoded_image",
  "cropType": "tomato",
  "userId": 1
}
```

### Weather Information
```http
GET /api/weather/:location
```

### Market Prices
```http
GET /api/market-prices?crop=rice&market=local
```

### Chat API
```http
POST /api/chat
Content-Type: application/json

{
  "message": "What fertilizer should I use for tomatoes?",
  "language": "en",
  "userId": 1
}
```

### Crop Listings
```http
POST /api/crop-listings
Content-Type: application/json

{
  "cropType": "rice",
  "quantity": 100,
  "pricePerKg": 25,
  "contact": "+91 9876543210"
}
```

## 🗄 Database Schema

The platform includes comprehensive data models for:

- **Users**: Farmer profiles and preferences
- **Crops**: Detailed crop information and disease database
- **Disease Analysis**: Historical analysis results
- **Market Data**: Price trends and market information
- **Weather**: Location-based weather data
- **Buyers**: Verified buyer information
- **Chat History**: Conversation logs

## 🌐 Multilingual Support

The platform supports multiple Indian languages:
- **English** (en)
- **Hindi** (hi) - हिंदी
- **Marathi** (mr) - मराठी
- **Kannada** (kn) - ಕನ್ನಡ
- **Tamil** (ta) - தமிழ்
- **Telugu** (te) - తెలుగు

## 📱 Mobile Features

### Voice Commands
- Tap-to-speak functionality
- Voice recognition in local languages
- Text-to-speech responses
- Offline voice processing

### Camera Integration
- Plant photo capture
- Image upload and analysis
- Photo gallery access
- Real-time disease detection

### Location Services
- Automatic location detection
- Weather data based on location
- Nearby market information
- Local buyer connections

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting on API endpoints
- Secure file upload handling
- User data protection
- CORS policy implementation

## 🚀 Future Enhancements

### AI Integration Opportunities
- **Computer Vision**: Advanced plant disease detection using TensorFlow.js or OpenCV
- **Natural Language Processing**: Enhanced multilingual chat capabilities
- **Machine Learning**: Crop yield prediction and optimization
- **Deep Learning**: Soil analysis from images

### External API Integrations
- **Weather APIs**: OpenWeatherMap, AccuWeather
- **Market Data**: Government agricultural APIs
- **Payment Gateways**: For buyer-seller transactions
- **SMS/WhatsApp**: Notifications and alerts

### Database Migration
- **MongoDB**: For scalable NoSQL data storage
- **PostgreSQL**: For relational data requirements
- **Redis**: For caching and session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🌱 About AgroAI

AgroAI is designed to bridge the technology gap in agriculture by providing farmers with accessible, AI-powered tools for better crop management, disease prevention, and market access. The platform focuses on:

- **Accessibility**: Simple interface in local languages
- **Reliability**: Offline capabilities for rural areas
- **Accuracy**: AI-powered recommendations
- **Community**: Connecting farmers with buyers and experts

---

**Built with ❤️ for farmers by AgroAI Team**
