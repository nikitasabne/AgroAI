// API Service Manager for Real Data Integration
const axios = require('axios');

class APIManager {
    constructor() {
        // API Keys and URLs
        this.weatherAPI = {
            key: process.env.OPENWEATHER_API_KEY || 'demo_key', // Replace with real key
            baseURL: 'https://api.openweathermap.org/data/2.5'
        };
        
        this.marketAPI = {
            // India's eNAM (National Agriculture Market) API
            enamURL: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
            agmarknetURL: 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24'
        };
        
        this.cropAPI = {
            // Agricultural extension and crop advisory APIs
            krishi: 'https://api.data.gov.in/resource/kisan-call-center',
            season: 'https://api.data.gov.in/resource/crop-production'
        };
    }

    // Weather API Integration
    async getCurrentWeather(location) {
        try {
            let lat, lon;
            
            // If location is coordinates
            if (location.includes(',')) {
                [lat, lon] = location.split(',');
            } else {
                // Get coordinates from location name
                const geoResponse = await axios.get(
                    `${this.weatherAPI.baseURL}/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${this.weatherAPI.key}`
                );
                
                if (geoResponse.data.length === 0) {
                    throw new Error('Location not found');
                }
                
                lat = geoResponse.data[0].lat;
                lon = geoResponse.data[0].lon;
            }

            // Get current weather
            const weatherResponse = await axios.get(
                `${this.weatherAPI.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.weatherAPI.key}&units=metric`
            );

            // Get 5-day forecast
            const forecastResponse = await axios.get(
                `${this.weatherAPI.baseURL}/forecast?lat=${lat}&lon=${lon}&appid=${this.weatherAPI.key}&units=metric`
            );

            return this.formatWeatherData(weatherResponse.data, forecastResponse.data);
        } catch (error) {
            console.error('Weather API Error:', error.message);
            throw new Error('Failed to fetch weather data');
        }
    }

    formatWeatherData(current, forecast) {
        const currentWeather = {
            temperature: Math.round(current.main.temp),
            humidity: current.main.humidity,
            windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
            rainfall: current.rain ? current.rain['1h'] || 0 : 0,
            condition: current.weather[0].description,
            icon: this.getWeatherIcon(current.weather[0].icon)
        };

        // Process 5-day forecast (every 3 hours, take daily average)
        const dailyForecast = [];
        const grouped = {};
        
        forecast.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(item);
        });

        Object.entries(grouped).slice(0, 5).forEach(([date, items], index) => {
            const avgTemp = items.reduce((sum, item) => sum + item.main.temp, 0) / items.length;
            const mainWeather = items[0].weather[0];
            
            dailyForecast.push({
                day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `Day ${index + 1}`,
                date: date,
                temp: Math.round(avgTemp),
                condition: mainWeather.description,
                icon: this.getWeatherIcon(mainWeather.icon),
                rainfall: items.reduce((sum, item) => sum + (item.rain ? item.rain['3h'] || 0 : 0), 0)
            });
        });

        return {
            current: currentWeather,
            forecast: dailyForecast,
            location: current.name + ', ' + current.sys.country
        };
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain',
            '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };
        return iconMap[iconCode] || 'fas fa-cloud';
    }

    // Market Prices API Integration
    async getMarketPrices(crop = null, state = null, district = null) {
        try {
            // Use India's data.gov.in API for market prices
            let url = `${this.marketAPI.agmarknetURL}?api-key=${process.env.DATA_GOV_IN_KEY || 'demo_key'}&format=json&limit=100`;
            
            if (crop) {
                url += `&filters[commodity]=${encodeURIComponent(crop)}`;
            }
            if (state) {
                url += `&filters[state]=${encodeURIComponent(state)}`;
            }
            if (district) {
                url += `&filters[district]=${encodeURIComponent(district)}`;
            }

            const response = await axios.get(url);
            
            if (response.data && response.data.records) {
                return this.formatMarketData(response.data.records);
            }
            
            // Fallback to sample data structure for demo
            return this.getSampleMarketData(crop);
        } catch (error) {
            console.error('Market API Error:', error.message);
            return this.getSampleMarketData(crop);
        }
    }

    formatMarketData(records) {
        return records.map(record => ({
            crop: record.commodity || record.crop_name,
            market: record.market || record.mandi_name,
            price: parseFloat(record.modal_price || record.price || 0),
            unit: 'per quintal',
            quality: record.variety || 'Standard',
            date: record.price_date || new Date().toISOString(),
            trend: this.calculateTrend(record),
            volume: parseFloat(record.arrivals || 0),
            state: record.state,
            district: record.district
        }));
    }

    calculateTrend(record) {
        // Simple trend calculation based on min/max prices
        const modalPrice = parseFloat(record.modal_price || 0);
        const minPrice = parseFloat(record.min_price || modalPrice);
        const maxPrice = parseFloat(record.max_price || modalPrice);
        
        if (modalPrice > (minPrice + maxPrice) / 2) {
            return 'rising';
        } else if (modalPrice < (minPrice + maxPrice) / 2) {
            return 'falling';
        }
        return 'stable';
    }

    getSampleMarketData(crop) {
        const sampleData = {
            rice: [
                { crop: 'Rice', market: 'Delhi Mandi', price: 2200, unit: 'per quintal', quality: 'Grade A', trend: 'stable' },
                { crop: 'Rice', market: 'Mumbai APMC', price: 2150, unit: 'per quintal', quality: 'Grade B', trend: 'rising' }
            ],
            wheat: [
                { crop: 'Wheat', market: 'Punjab Mandi', price: 1900, unit: 'per quintal', quality: 'Grade A', trend: 'stable' },
                { crop: 'Wheat', market: 'UP Mandi', price: 1850, unit: 'per quintal', quality: 'Grade B', trend: 'falling' }
            ],
            tomato: [
                { crop: 'Tomato', market: 'Bangalore Market', price: 3500, unit: 'per quintal', quality: 'Premium', trend: 'rising' },
                { crop: 'Tomato', market: 'Pune Market', price: 3200, unit: 'per quintal', quality: 'Standard', trend: 'stable' }
            ]
        };
        
        return sampleData[crop] || [
            { crop: crop || 'Mixed', market: 'Local Market', price: 2000, unit: 'per quintal', quality: 'Standard', trend: 'stable' }
        ];
    }

    // Crop Advisory based on Weather and Season
    async getCropAdvisory(location, weatherData) {
        try {
            const currentMonth = new Date().getMonth() + 1;
            const season = this.determineSeason(currentMonth);
            const climateZone = this.determineClimateZone(location);
            
            return this.generateCropRecommendations(season, climateZone, weatherData);
        } catch (error) {
            console.error('Crop Advisory Error:', error.message);
            return this.getDefaultCropAdvisory();
        }
    }

    determineSeason(month) {
        if (month >= 6 && month <= 9) return 'kharif'; // Monsoon season
        if (month >= 10 && month <= 3) return 'rabi'; // Winter season
        return 'zaid'; // Summer season
    }

    determineClimateZone(location) {
        // Simplified climate zone determination
        const locationLower = location.toLowerCase();
        
        if (locationLower.includes('kerala') || locationLower.includes('tamil nadu') || locationLower.includes('karnataka')) {
            return 'tropical';
        }
        if (locationLower.includes('rajasthan') || locationLower.includes('gujarat')) {
            return 'arid';
        }
        if (locationLower.includes('punjab') || locationLower.includes('haryana') || locationLower.includes('delhi')) {
            return 'temperate';
        }
        return 'subtropical'; // Default
    }

    generateCropRecommendations(season, climateZone, weatherData) {
        const recommendations = {
            kharif: {
                tropical: ['Rice', 'Sugarcane', 'Cotton', 'Maize', 'Jowar'],
                temperate: ['Rice', 'Maize', 'Cotton', 'Bajra', 'Pulses'],
                arid: ['Bajra', 'Jowar', 'Cotton', 'Groundnut', 'Castor'],
                subtropical: ['Rice', 'Maize', 'Sugarcane', 'Cotton', 'Arhar']
            },
            rabi: {
                tropical: ['Wheat', 'Barley', 'Gram', 'Peas', 'Mustard'],
                temperate: ['Wheat', 'Barley', 'Gram', 'Mustard', 'Lentils'],
                arid: ['Wheat', 'Barley', 'Gram', 'Mustard', 'Cumin'],
                subtropical: ['Wheat', 'Barley', 'Potato', 'Peas', 'Mustard']
            },
            zaid: {
                tropical: ['Watermelon', 'Muskmelon', 'Cucumber', 'Fodder crops'],
                temperate: ['Fodder Maize', 'Jowar', 'Bajra', 'Vegetables'],
                arid: ['Watermelon', 'Muskmelon', 'Fodder crops'],
                subtropical: ['Maize', 'Jowar', 'Vegetables', 'Watermelon']
            }
        };

        const crops = recommendations[season][climateZone] || recommendations[season]['subtropical'];
        
        return {
            season: season,
            climateZone: climateZone,
            recommendedCrops: crops,
            irrigation: this.getIrrigationAdvice(weatherData),
            planting: this.getPlantingAdvice(season, weatherData),
            protection: this.getProtectionAdvice(weatherData),
            harvest: this.getHarvestAdvice(season, weatherData)
        };
    }

    getIrrigationAdvice(weatherData) {
        if (weatherData.current.rainfall > 10) {
            return 'Reduce irrigation due to recent rainfall. Check soil moisture before watering.';
        }
        if (weatherData.current.humidity > 80) {
            return 'High humidity detected. Monitor for fungal diseases and ensure good drainage.';
        }
        if (weatherData.current.temperature > 35) {
            return 'High temperature. Increase irrigation frequency and consider evening watering.';
        }
        return 'Maintain regular irrigation schedule. Water early morning or evening.';
    }

    getPlantingAdvice(season, weatherData) {
        const advice = {
            kharif: 'Ideal time for monsoon crops. Ensure field preparation is complete.',
            rabi: 'Perfect season for winter crops. Focus on timely sowing.',
            zaid: 'Summer season - choose heat-tolerant varieties and ensure irrigation.'
        };
        
        if (weatherData.current.temperature < 10) {
            return advice[season] + ' Consider frost protection measures.';
        }
        
        return advice[season];
    }

    getProtectionAdvice(weatherData) {
        const forecast = weatherData.forecast;
        const rainExpected = forecast.some(day => day.rainfall > 5);
        
        if (rainExpected) {
            return 'Rain expected in coming days. Protect crops from waterlogging and apply preventive fungicides.';
        }
        
        if (weatherData.current.windSpeed > 20) {
            return 'Strong winds expected. Secure tall crops and check for physical damage.';
        }
        
        return 'Weather conditions are favorable. Continue regular crop monitoring.';
    }

    getHarvestAdvice(season, weatherData) {
        if (weatherData.current.humidity < 60 && weatherData.current.rainfall === 0) {
            return 'Excellent weather for harvesting. Dry conditions will help preserve crop quality.';
        }
        
        if (weatherData.forecast.some(day => day.rainfall > 10)) {
            return 'Plan harvest before expected rains to avoid crop damage.';
        }
        
        return 'Monitor crop maturity and plan harvest timing based on weather conditions.';
    }

    getDefaultCropAdvisory() {
        return {
            season: 'current',
            climateZone: 'general',
            recommendedCrops: ['Seasonal vegetables', 'Cereals', 'Pulses'],
            irrigation: 'Maintain regular watering schedule based on crop needs.',
            planting: 'Choose appropriate varieties for current season.',
            protection: 'Monitor weather conditions and protect crops accordingly.',
            harvest: 'Harvest mature crops at optimal time for best quality.'
        };
    }

    // Buyer-Seller Marketplace API
    async getBuyers(cropType = null, location = null) {
        try {
            // In production, this would connect to a real marketplace API
            // For now, generate realistic buyer data based on location and crop
            return this.generateBuyerData(cropType, location);
        } catch (error) {
            console.error('Buyer API Error:', error.message);
            return [];
        }
    }

    generateBuyerData(cropType, location) {
        const buyers = [
            {
                name: 'Krishi Mandi Traders',
                contact: '+91 98765 43210',
                location: location || 'Local Market',
                cropsInterested: cropType ? [cropType] : ['Rice', 'Wheat', 'Corn'],
                paymentTerms: 'Immediate',
                capacity: 500,
                rating: 4.5,
                verified: true,
                distance: '5 km'
            },
            {
                name: 'Agricultural Cooperative Society',
                contact: '+91 98765 43211',
                location: (location || 'District') + ' Cooperative',
                cropsInterested: cropType ? [cropType, 'Mixed crops'] : ['Vegetables', 'Fruits', 'Cereals'],
                paymentTerms: '15 days',
                capacity: 1000,
                rating: 4.7,
                verified: true,
                distance: '12 km'
            },
            {
                name: 'Farm Fresh Processors',
                contact: '+91 98765 43212',
                location: (location || 'Regional') + ' Processing Unit',
                cropsInterested: cropType ? [cropType] : ['Tomato', 'Potato', 'Onion'],
                paymentTerms: '30 days',
                capacity: 200,
                rating: 4.2,
                verified: true,
                distance: '25 km'
            }
        ];

        return buyers.filter(buyer => 
            !cropType || buyer.cropsInterested.some(crop => 
                crop.toLowerCase().includes(cropType.toLowerCase())
            )
        );
    }

    async createCropListing(listingData) {
        try {
            // In production, this would save to a real database/marketplace
            const listing = {
                id: Date.now(),
                ...listingData,
                status: 'active',
                views: 0,
                inquiries: 0,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            };
            
            return listing;
        } catch (error) {
            console.error('Listing Creation Error:', error.message);
            throw new Error('Failed to create crop listing');
        }
    }

    async getCropListings(filters = {}) {
        try {
            // In production, this would fetch from a real database
            return this.generateCropListings(filters);
        } catch (error) {
            console.error('Crop Listings Error:', error.message);
            return [];
        }
    }

    generateCropListings(filters) {
        const listings = [
            {
                id: 1,
                sellerId: 'farmer001',
                sellerName: 'Rajesh Kumar',
                cropType: 'Rice',
                variety: 'Basmati',
                quantity: 50,
                unit: 'quintals',
                pricePerUnit: 2200,
                quality: 'Grade A',
                harvestDate: '2024-01-15',
                location: 'Punjab',
                contact: '+91 98765 43220',
                status: 'available',
                images: [],
                description: 'Premium quality basmati rice, freshly harvested'
            },
            {
                id: 2,
                sellerId: 'farmer002',
                sellerName: 'Priya Patel',
                cropType: 'Tomato',
                variety: 'Hybrid',
                quantity: 25,
                unit: 'quintals',
                pricePerUnit: 3500,
                quality: 'Premium',
                harvestDate: '2024-01-20',
                location: 'Maharashtra',
                contact: '+91 98765 43221',
                status: 'available',
                images: [],
                description: 'Fresh hybrid tomatoes, excellent for market sale'
            }
        ];

        // Apply filters
        let filteredListings = listings;
        
        if (filters.cropType) {
            filteredListings = filteredListings.filter(listing => 
                listing.cropType.toLowerCase().includes(filters.cropType.toLowerCase())
            );
        }
        
        if (filters.location) {
            filteredListings = filteredListings.filter(listing => 
                listing.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        
        return filteredListings;
    }
}

module.exports = APIManager;
