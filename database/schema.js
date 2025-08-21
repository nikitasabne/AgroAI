// Database Schema and Mock Data for AgroAI Platform
// This file contains the structure for user data, crop information, and market data

const mockDatabase = {
  users: [
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      location: { lat: 28.6139, lng: 77.2090, address: 'Delhi, India' },
      language: 'hi',
      crops: ['rice', 'wheat'],
      farmSize: 5, // in acres
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Priya Patel',
      phone: '+91 98765 43211',
      location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai, India' },
      language: 'mr',
      crops: ['tomato', 'onion'],
      farmSize: 3,
      createdAt: new Date().toISOString()
    }
  ],

  crops: [
    {
      id: 1,
      name: 'Rice',
      scientificName: 'Oryza sativa',
      category: 'cereal',
      seasons: ['kharif'],
      soilTypes: ['clay', 'loam'],
      waterRequirement: 'high',
      diseases: [
        {
          name: 'Rice Blast',
          symptoms: ['circular spots on leaves', 'white centers with dark borders'],
          treatment: 'Apply tricyclazole fungicide',
          prevention: 'Use resistant varieties'
        },
        {
          name: 'Brown Spot',
          symptoms: ['brown oval spots', 'yellowing leaves'],
          treatment: 'Mancozeb spray',
          prevention: 'Proper seed treatment'
        }
      ],
      marketInfo: {
        avgPrice: 22,
        priceRange: { min: 18, max: 26 },
        demand: 'high',
        exportPotential: true
      }
    },
    {
      id: 2,
      name: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      category: 'vegetable',
      seasons: ['rabi', 'summer'],
      soilTypes: ['sandy-loam', 'loam'],
      waterRequirement: 'medium',
      diseases: [
        {
          name: 'Late Blight',
          symptoms: ['dark spots on leaves', 'white fungal growth'],
          treatment: 'Copper-based fungicides',
          prevention: 'Crop rotation and drainage'
        },
        {
          name: 'Leaf Curl',
          symptoms: ['curled leaves', 'yellowing', 'stunted growth'],
          treatment: 'Remove infected plants',
          prevention: 'Use virus-free seeds'
        }
      ],
      marketInfo: {
        avgPrice: 30,
        priceRange: { min: 20, max: 45 },
        demand: 'very high',
        exportPotential: true
      }
    }
  ],

  diseaseAnalysis: [
    {
      id: 1,
      userId: 1,
      imageUrl: '/uploads/plant-image-1.jpg',
      cropType: 'rice',
      diagnosis: {
        disease: 'Rice Blast',
        confidence: 89,
        severity: 'moderate',
        treatments: [
          'Apply tricyclazole fungicide at 0.6g/L',
          'Remove infected plant debris',
          'Improve field drainage',
          'Use resistant varieties for next season'
        ]
      },
      timestamp: new Date().toISOString()
    }
  ],

  marketData: [
    {
      id: 1,
      crop: 'rice',
      market: 'Delhi Mandi',
      price: 22,
      unit: 'per kg',
      quality: 'Grade A',
      date: new Date().toISOString(),
      trend: 'stable',
      volume: 1500 // in quintals
    },
    {
      id: 2,
      crop: 'tomato',
      market: 'Mumbai Market',
      price: 35,
      unit: 'per kg',
      quality: 'Premium',
      date: new Date().toISOString(),
      trend: 'rising',
      volume: 800
    }
  ],

  weather: [
    {
      location: 'Delhi',
      current: {
        temperature: 28,
        humidity: 65,
        rainfall: 0,
        windSpeed: 12,
        condition: 'partly_cloudy'
      },
      forecast: [
        { date: '2024-01-15', temp: { min: 15, max: 28 }, condition: 'sunny', rainfall: 0 },
        { date: '2024-01-16', temp: { min: 16, max: 30 }, condition: 'partly_cloudy', rainfall: 0 },
        { date: '2024-01-17', temp: { min: 18, max: 26 }, condition: 'rainy', rainfall: 15 }
      ],
      advisory: {
        irrigation: 'Moderate watering recommended',
        planting: 'Good conditions for winter crops',
        protection: 'Cover sensitive plants during rain',
        harvest: 'Ideal weather for harvesting'
      }
    }
  ],

  buyers: [
    {
      id: 1,
      name: 'Rajesh Agricultural Supplies',
      contact: '+91 98765 43210',
      location: 'District Market, Delhi',
      cropsInterested: ['rice', 'wheat', 'corn'],
      paymentTerms: 'immediate',
      capacity: 1000, // quintals per month
      rating: 4.5,
      verified: true
    },
    {
      id: 2,
      name: 'Green Valley Traders',
      contact: '+91 98765 43211',
      location: 'State Market, Mumbai',
      cropsInterested: ['vegetables', 'fruits'],
      paymentTerms: '30 days',
      capacity: 500,
      rating: 4.2,
      verified: true
    }
  ],

  cropListings: [
    {
      id: 1,
      sellerId: 1,
      cropType: 'rice',
      quantity: 50, // quintals
      pricePerKg: 22,
      quality: 'Grade A',
      harvestDate: '2024-01-10',
      location: 'Delhi',
      contact: '+91 98765 43210',
      status: 'available',
      images: ['/uploads/rice-listing-1.jpg'],
      description: 'High quality basmati rice, freshly harvested'
    }
  ],

  chatHistory: [
    {
      id: 1,
      userId: 1,
      messages: [
        {
          type: 'user',
          content: 'What is the best fertilizer for tomatoes?',
          timestamp: new Date().toISOString(),
          language: 'en'
        },
        {
          type: 'bot',
          content: 'For tomatoes, I recommend using NPK fertilizer with ratio 10:10:10 during vegetative growth, then switch to high potassium fertilizer during flowering.',
          timestamp: new Date().toISOString(),
          language: 'en'
        }
      ]
    }
  ]
};

// Database operations (mock implementation)
class DatabaseManager {
  constructor() {
    this.data = mockDatabase;
  }

  // User operations
  async createUser(userData) {
    const newUser = {
      id: this.data.users.length + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    return newUser;
  }

  async getUserById(userId) {
    return this.data.users.find(user => user.id === userId);
  }

  async updateUser(userId, updateData) {
    const userIndex = this.data.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.data.users[userIndex] = { ...this.data.users[userIndex], ...updateData };
      return this.data.users[userIndex];
    }
    return null;
  }

  // Crop operations
  async getCropInfo(cropName) {
    return this.data.crops.find(crop => 
      crop.name.toLowerCase() === cropName.toLowerCase()
    );
  }

  async getAllCrops() {
    return this.data.crops;
  }

  // Disease analysis operations
  async saveDiseaseAnalysis(analysisData) {
    const newAnalysis = {
      id: this.data.diseaseAnalysis.length + 1,
      ...analysisData,
      timestamp: new Date().toISOString()
    };
    this.data.diseaseAnalysis.push(newAnalysis);
    return newAnalysis;
  }

  async getDiseaseHistory(userId) {
    return this.data.diseaseAnalysis.filter(analysis => analysis.userId === userId);
  }

  // Market operations
  async getMarketPrices(crop, market) {
    return this.data.marketData.filter(item => 
      (!crop || item.crop === crop) && (!market || item.market.includes(market))
    );
  }

  async addMarketData(marketData) {
    const newData = {
      id: this.data.marketData.length + 1,
      ...marketData,
      date: new Date().toISOString()
    };
    this.data.marketData.push(newData);
    return newData;
  }

  // Buyer operations
  async getBuyers(cropType, location) {
    return this.data.buyers.filter(buyer => 
      (!cropType || buyer.cropsInterested.includes(cropType)) &&
      (!location || buyer.location.includes(location))
    );
  }

  // Crop listing operations
  async createCropListing(listingData) {
    const newListing = {
      id: this.data.cropListings.length + 1,
      ...listingData,
      status: 'available',
      createdAt: new Date().toISOString()
    };
    this.data.cropListings.push(newListing);
    return newListing;
  }

  async getCropListings(filters = {}) {
    let listings = this.data.cropListings;
    
    if (filters.cropType) {
      listings = listings.filter(listing => listing.cropType === filters.cropType);
    }
    
    if (filters.location) {
      listings = listings.filter(listing => listing.location.includes(filters.location));
    }
    
    return listings;
  }

  // Chat operations
  async saveChatMessage(userId, message) {
    let userChat = this.data.chatHistory.find(chat => chat.userId === userId);
    
    if (!userChat) {
      userChat = {
        id: this.data.chatHistory.length + 1,
        userId: userId,
        messages: []
      };
      this.data.chatHistory.push(userChat);
    }
    
    userChat.messages.push({
      ...message,
      timestamp: new Date().toISOString()
    });
    
    return userChat;
  }

  async getChatHistory(userId) {
    const userChat = this.data.chatHistory.find(chat => chat.userId === userId);
    return userChat ? userChat.messages : [];
  }

  // Weather operations
  async getWeatherData(location) {
    return this.data.weather.find(weather => 
      weather.location.toLowerCase().includes(location.toLowerCase())
    ) || this.data.weather[0]; // fallback to first weather data
  }
}

module.exports = {
  DatabaseManager,
  mockDatabase
};
