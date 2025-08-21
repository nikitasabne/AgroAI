// AgroAI - Smart Farming Assistant Application
class AgroAI {
    constructor() {
        this.currentSection = 'home';
        this.recognition = null;
        this.isListening = false;
        this.currentLanguage = 'en';
        this.diseaseModel = null;
        this.modelLoading = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDiseaseDetection();
        this.setupVoiceAssistant();
        this.setupWeatherSystem();
        this.setupMarketSystem();
        this.setupSpeechRecognition();
        this.initializeDiseaseModel();
    }

    async initializeDiseaseModel() {
        try {
            this.diseaseModel = new PlantDiseaseModel();
            this.modelLoading = true;
            this.updateModelStatus('Loading AI model...', 'loading');

            const loaded = await this.diseaseModel.loadModel();
            this.modelLoading = false;

            if (loaded || this.diseaseModel.isModelReady()) {
                this.updateModelStatus('AI model ready for disease detection', 'success');
                console.log('Disease detection model initialized:', this.diseaseModel.getModelInfo());
            } else {
                this.updateModelStatus('Using demo mode - AI model not available', 'info');
            }
        } catch (error) {
            console.error('Failed to initialize disease model:', error);
            this.modelLoading = false;
            this.updateModelStatus('Model loading failed - using demo mode', 'error');
        }
    }

    updateModelStatus(message, type) {
        // Add a status indicator for the AI model
        const existingStatus = document.getElementById('modelStatus');
        if (existingStatus) {
            existingStatus.remove();
        }

        const statusDiv = document.createElement('div');
        statusDiv.id = 'modelStatus';
        statusDiv.className = `model-status ${type}`;
        statusDiv.innerHTML = `
            <i class="fas fa-${type === 'loading' ? 'spinner fa-spin' : type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        const diseaseSection = document.getElementById('disease-detection');
        const sectionHeader = diseaseSection.querySelector('.section-header');
        sectionHeader.appendChild(statusDiv);

        // Auto-hide non-loading status after 5 seconds
        if (type !== 'loading') {
            setTimeout(() => {
                if (statusDiv.parentNode) {
                    statusDiv.remove();
                }
            }, 5000);
        }
    }

    // Navigation System
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const featureCards = document.querySelectorAll('.feature-card');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.navigateToSection(section);
            });
        });

        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const section = card.dataset.navigate;
                if (section) {
                    this.navigateToSection(section);
                }
            });
        });
    }

    navigateToSection(sectionId) {
        // Update active nav button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionId);
        });

        // Update active section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });

        this.currentSection = sectionId;
    }

    // Disease Detection System
    setupDiseaseDetection() {
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        const imagePreview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const analysisResults = document.getElementById('analysisResults');

        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver);
        uploadArea.addEventListener('drop', (e) => this.handleImageDrop(e, imageInput));

        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.displayImagePreview(file, previewImg, imagePreview, uploadArea);
            }
        });

        analyzeBtn.addEventListener('click', () => {
            this.analyzePlantDisease(previewImg.src, analysisResults);
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.style.borderColor = '#2e7d32';
        e.currentTarget.style.background = '#f8f9fa';
    }

    handleImageDrop(e, imageInput) {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            imageInput.files = files;
            const event = new Event('change', { bubbles: true });
            imageInput.dispatchEvent(event);
        }
    }

    displayImagePreview(file, previewImg, imagePreview, uploadArea) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            uploadArea.style.display = 'none';
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    async analyzePlantDisease(imageSrc, resultsContainer) {
        resultsContainer.style.display = 'block';
        const diseaseInfo = document.getElementById('diseaseInfo');
        const treatmentRecommendations = document.getElementById('treatmentRecommendations');

        // Show loading
        diseaseInfo.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Analyzing plant image...</p></div>';
        treatmentRecommendations.innerHTML = '';

        try {
            // Simulate AI analysis (replace with actual AI service)
            await this.delay(2000);
            
            const mockAnalysis = this.getMockDiseaseAnalysis();
            
            diseaseInfo.innerHTML = `
                <h4><i class="fas fa-bug"></i> Disease Detected: ${mockAnalysis.disease}</h4>
                <p><strong>Confidence:</strong> ${mockAnalysis.confidence}%</p>
                <p><strong>Severity:</strong> ${mockAnalysis.severity}</p>
                <p><strong>Description:</strong> ${mockAnalysis.description}</p>
            `;

            treatmentRecommendations.innerHTML = `
                <h4><i class="fas fa-prescription-bottle-alt"></i> Treatment Recommendations</h4>
                <ul>
                    ${mockAnalysis.treatments.map(treatment => `<li>${treatment}</li>`).join('')}
                </ul>
                <p><strong>Prevention:</strong> ${mockAnalysis.prevention}</p>
            `;
        } catch (error) {
            diseaseInfo.innerHTML = '<div class="status-error">Error analyzing image. Please try again.</div>';
        }
    }

    getMockDiseaseAnalysis() {
        const diseases = [
            {
                disease: 'Leaf Blight',
                confidence: 89,
                severity: 'Moderate',
                description: 'A fungal infection affecting the leaf tissues, causing brown spots and yellowing.',
                treatments: [
                    'Apply copper-based fungicide spray',
                    'Remove affected leaves immediately',
                    'Improve air circulation around plants',
                    'Avoid overhead watering'
                ],
                prevention: 'Maintain proper spacing between plants and ensure good drainage.'
            },
            {
                disease: 'Powdery Mildew',
                confidence: 92,
                severity: 'Mild',
                description: 'A fungal disease characterized by white powdery spots on leaves.',
                treatments: [
                    'Spray with neem oil solution',
                    'Apply baking soda spray (1 tsp per quart water)',
                    'Increase air circulation',
                    'Remove infected plant parts'
                ],
                prevention: 'Plant in sunny locations with good air flow and avoid overcrowding.'
            }
        ];
        return diseases[Math.floor(Math.random() * diseases.length)];
    }

    // Voice Assistant System
    setupVoiceAssistant() {
        const languageSelect = document.getElementById('languageSelect');
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        const textInput = document.getElementById('textInput');
        const sendBtn = document.getElementById('sendBtn');
        const chatMessages = document.getElementById('chatMessages');

        languageSelect.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updateVoiceStatus('Language changed to ' + e.target.options[e.target.selectedIndex].text);
        });

        voiceBtn.addEventListener('click', () => {
            this.toggleVoiceRecognition(voiceBtn, voiceStatus);
        });

        sendBtn.addEventListener('click', () => {
            const message = textInput.value.trim();
            if (message) {
                this.processUserMessage(message, chatMessages);
                textInput.value = '';
            }
        });

        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        });
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.getLanguageCode(this.currentLanguage);

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processUserMessage(transcript, document.getElementById('chatMessages'));
            };

            this.recognition.onerror = (event) => {
                this.updateVoiceStatus('Error: ' + event.error);
                this.isListening = false;
                this.updateVoiceButton();
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButton();
                this.updateVoiceStatus('Ready to listen...');
            };
        }
    }

    toggleVoiceRecognition(voiceBtn, voiceStatus) {
        if (!this.recognition) {
            this.updateVoiceStatus('Speech recognition not supported in this browser');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        } else {
            this.recognition.lang = this.getLanguageCode(this.currentLanguage);
            this.recognition.start();
            this.isListening = true;
            this.updateVoiceStatus('Listening...');
        }
        this.updateVoiceButton();
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        if (this.isListening) {
            voiceBtn.classList.add('recording');
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i><span>Stop</span>';
        } else {
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Tap to speak</span>';
        }
    }

    updateVoiceStatus(message) {
        const voiceStatus = document.getElementById('voiceStatus');
        voiceStatus.textContent = message;
    }

    getLanguageCode(lang) {
        const codes = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'mr': 'mr-IN',
            'kn': 'kn-IN',
            'ta': 'ta-IN',
            'te': 'te-IN'
        };
        return codes[lang] || 'en-US';
    }

    async processUserMessage(message, chatContainer) {
        this.addMessageToChat('user', message, chatContainer);
        
        // Show typing indicator
        const typingMsg = this.addMessageToChat('bot', 'Typing...', chatContainer);
        
        try {
            await this.delay(1000);
            const response = await this.getAIResponse(message);
            
            // Remove typing indicator and add actual response
            typingMsg.remove();
            this.addMessageToChat('bot', response, chatContainer);
            
            // Text-to-speech for response
            this.speakResponse(response);
        } catch (error) {
            typingMsg.remove();
            this.addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.', chatContainer);
        }
    }

    addMessageToChat(sender, message, container) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const icon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
        messageDiv.innerHTML = `
            <i class="${icon}"></i>
            <p>${message}</p>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
        
        return messageDiv;
    }

    async getAIResponse(message) {
        // Mock AI responses (replace with actual AI service)
        const responses = {
            'weather': 'Based on current weather data, expect partly cloudy skies with temperatures around 28°C. Good conditions for most crops.',
            'soil': 'For your soil type, I recommend crops like rice, wheat, or vegetables depending on the season. Consider soil testing for specific nutrients.',
            'crop': 'Popular crops for this season include tomatoes, peppers, and leafy greens. Consider market demand in your area.',
            'disease': 'Common plant diseases this season include leaf blight and powdery mildew. Ensure proper spacing and ventilation.',
            'price': 'Current market prices show good rates for vegetables. Check the market section for detailed pricing.',
            'default': 'I understand you want farming advice. Could you be more specific about crops, weather, soil, diseases, or market prices?'
        };

        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        return responses.default;
    }

    speakResponse(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.getLanguageCode(this.currentLanguage);
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    // Weather System
    setupWeatherSystem() {
        const locationInput = document.getElementById('locationInput');
        const getWeatherBtn = document.getElementById('getWeatherBtn');
        const useLocationBtn = document.getElementById('useLocationBtn');
        const weatherContainer = document.getElementById('weatherContainer');

        getWeatherBtn.addEventListener('click', () => {
            const location = locationInput.value.trim();
            if (location) {
                this.getWeatherData(location, weatherContainer);
            }
        });

        useLocationBtn.addEventListener('click', () => {
            this.getCurrentLocation(weatherContainer);
        });

        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                getWeatherBtn.click();
            }
        });
    }

    getCurrentLocation(weatherContainer) {
        if ('geolocation' in navigator) {
            weatherContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Getting your location...</p></div>';
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.getWeatherData(`${latitude},${longitude}`, weatherContainer);
                },
                (error) => {
                    weatherContainer.innerHTML = '<div class="status-error">Unable to get your location. Please enter manually.</div>';
                }
            );
        } else {
            weatherContainer.innerHTML = '<div class="status-error">Geolocation not supported. Please enter location manually.</div>';
        }
    }

    async getWeatherData(location, weatherContainer) {
        weatherContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Fetching weather data...</p></div>';
        
        try {
            await this.delay(1500);
            
            // Mock weather data (replace with actual weather API)
            const weatherData = this.getMockWeatherData();
            this.displayWeatherData(weatherData, weatherContainer);
        } catch (error) {
            weatherContainer.innerHTML = '<div class="status-error">Error fetching weather data. Please try again.</div>';
        }
    }

    getMockWeatherData() {
        return {
            current: {
                temperature: 28,
                humidity: 65,
                rainfall: 0,
                windSpeed: 12,
                condition: 'Partly Cloudy',
                icon: 'fas fa-cloud-sun'
            },
            forecast: [
                { day: 'Today', temp: '28°C', condition: 'Partly Cloudy', icon: 'fas fa-cloud-sun' },
                { day: 'Tomorrow', temp: '30°C', condition: 'Sunny', icon: 'fas fa-sun' },
                { day: 'Day 3', temp: '26°C', condition: 'Light Rain', icon: 'fas fa-cloud-rain' },
                { day: 'Day 4', temp: '29°C', condition: 'Cloudy', icon: 'fas fa-cloud' },
                { day: 'Day 5', temp: '31°C', condition: 'Sunny', icon: 'fas fa-sun' }
            ],
            advisory: {
                irrigation: 'Moderate watering recommended. Soil moisture appears adequate.',
                planting: 'Good conditions for planting tomatoes and peppers.',
                protection: 'Light rain expected day 3. Protect sensitive crops.',
                harvest: 'Excellent weather for harvesting mature crops.'
            }
        };
    }

    displayWeatherData(data, container) {
        const { current, forecast, advisory } = data;
        
        container.innerHTML = `
            <div class="current-weather">
                <h3><i class="${current.icon}"></i> Current Weather</h3>
                <div class="weather-stats">
                    <div class="stat">
                        <span class="stat-value">${current.temperature}°C</span>
                        <span class="stat-label">Temperature</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${current.humidity}%</span>
                        <span class="stat-label">Humidity</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${current.windSpeed} km/h</span>
                        <span class="stat-label">Wind Speed</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${current.rainfall} mm</span>
                        <span class="stat-label">Rainfall</span>
                    </div>
                </div>
            </div>
            
            <div class="weather-forecast">
                <h3><i class="fas fa-calendar-alt"></i> 5-Day Forecast</h3>
                <div class="forecast-grid">
                    ${forecast.map(day => `
                        <div class="forecast-item">
                            <div class="forecast-day">${day.day}</div>
                            <i class="${day.icon}"></i>
                            <div class="forecast-temp">${day.temp}</div>
                            <div class="forecast-condition">${day.condition}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="crop-advisory">
                <h3><i class="fas fa-lightbulb"></i> Crop Advisory</h3>
                <div class="advisory-grid">
                    <div class="advisory-item">
                        <h4><i class="fas fa-tint"></i> Irrigation</h4>
                        <p>${advisory.irrigation}</p>
                    </div>
                    <div class="advisory-item">
                        <h4><i class="fas fa-seedling"></i> Planting</h4>
                        <p>${advisory.planting}</p>
                    </div>
                    <div class="advisory-item">
                        <h4><i class="fas fa-shield-alt"></i> Protection</h4>
                        <p>${advisory.protection}</p>
                    </div>
                    <div class="advisory-item">
                        <h4><i class="fas fa-hand-holding-heart"></i> Harvest</h4>
                        <p>${advisory.harvest}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Market System
    setupMarketSystem() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        const getPricesBtn = document.getElementById('getPricesBtn');
        const sellForm = document.querySelector('.sell-form');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                this.switchTab(tabId, tabBtns, tabContents);
            });
        });

        getPricesBtn.addEventListener('click', () => {
            this.fetchMarketPrices();
        });

        sellForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitCropListing(sellForm);
        });

        // Load initial data
        this.loadMarketData();
    }

    switchTab(activeTabId, tabBtns, tabContents) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === activeTabId);
        });
        
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === activeTabId);
        });
    }

    async fetchMarketPrices() {
        const priceList = document.getElementById('priceList');
        const cropSelect = document.getElementById('cropSelect');
        const mandiSelect = document.getElementById('mandiSelect');
        
        const crop = cropSelect.value;
        const mandi = mandiSelect.value;
        
        if (!crop || !mandi) {
            priceList.innerHTML = '<div class="status-error">Please select both crop and mandi</div>';
            return;
        }
        
        priceList.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Fetching latest prices...</p></div>';
        
        try {
            await this.delay(1000);
            const prices = this.getMockPrices(crop, mandi);
            this.displayPrices(prices, priceList);
        } catch (error) {
            priceList.innerHTML = '<div class="status-error">Error fetching prices. Please try again.</div>';
        }
    }

    getMockPrices(crop, mandi) {
        const basePrices = {
            rice: { min: 20, max: 25 },
            wheat: { min: 18, max: 22 },
            corn: { min: 15, max: 18 },
            tomato: { min: 25, max: 35 },
            potato: { min: 12, max: 18 },
            onion: { min: 20, max: 30 }
        };
        
        const price = basePrices[crop] || { min: 15, max: 25 };
        const currentPrice = Math.floor(Math.random() * (price.max - price.min) + price.min);
        const previousPrice = currentPrice + Math.floor(Math.random() * 6) - 3;
        const change = currentPrice - previousPrice;
        
        return [
            {
                variety: `${crop.charAt(0).toUpperCase() + crop.slice(1)} - Grade A`,
                price: currentPrice,
                change: change,
                unit: 'per kg',
                market: mandi.charAt(0).toUpperCase() + mandi.slice(1) + ' Market'
            },
            {
                variety: `${crop.charAt(0).toUpperCase() + crop.slice(1)} - Grade B`,
                price: currentPrice - 2,
                change: change - 1,
                unit: 'per kg',
                market: mandi.charAt(0).toUpperCase() + mandi.slice(1) + ' Market'
            }
        ];
    }

    displayPrices(prices, container) {
        container.innerHTML = prices.map(price => `
            <div class="price-item">
                <div class="price-info">
                    <h4>${price.variety}</h4>
                    <p>${price.market}</p>
                </div>
                <div class="price-value">
                    <span class="price">₹${price.price} ${price.unit}</span>
                    <span class="price-change ${price.change >= 0 ? 'positive' : 'negative'}">
                        <i class="fas fa-arrow-${price.change >= 0 ? 'up' : 'down'}"></i>
                        ₹${Math.abs(price.change)}
                    </span>
                </div>
            </div>
        `).join('');
    }

    async loadMarketData() {
        // Load buyers
        const buyerList = document.getElementById('buyerList');
        const buyers = this.getMockBuyers();
        
        buyerList.innerHTML = buyers.map(buyer => `
            <div class="buyer-item">
                <div class="buyer-info">
                    <h4>${buyer.name}</h4>
                    <p><i class="fas fa-map-marker-alt"></i> ${buyer.location}</p>
                    <p><i class="fas fa-shopping-cart"></i> Looking for: ${buyer.crops.join(', ')}</p>
                </div>
                <div class="buyer-contact">
                    <button class="contact-btn" onclick="alert('Contact: ${buyer.phone}')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                </div>
            </div>
        `).join('');
    }

    getMockBuyers() {
        return [
            {
                name: 'Rajesh Agricultural Supplies',
                location: 'District Market, 5km',
                crops: ['Rice', 'Wheat', 'Corn'],
                phone: '+91 98765 43210'
            },
            {
                name: 'Green Valley Traders',
                location: 'State Market, 15km',
                crops: ['Vegetables', 'Fruits'],
                phone: '+91 98765 43211'
            },
            {
                name: 'Farm Fresh Co-op',
                location: 'Local Market, 2km',
                crops: ['Tomato', 'Potato', 'Onion'],
                phone: '+91 98765 43212'
            }
        ];
    }

    async submitCropListing(form) {
        const formData = new FormData(form);
        const listing = {
            cropType: formData.get('cropType') || document.getElementById('cropType').value,
            quantity: formData.get('quantity') || document.getElementById('quantity').value,
            price: formData.get('price') || document.getElementById('price').value,
            contact: formData.get('contact') || document.getElementById('contact').value
        };
        
        // Show loading
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        try {
            await this.delay(1500);
            
            // Mock submission
            this.showStatusMessage('success', 'Your crop listing has been submitted successfully!');
            form.reset();
        } catch (error) {
            this.showStatusMessage('error', 'Error submitting listing. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showStatusMessage(type, message) {
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message status-${type}`;
        statusDiv.textContent = message;
        
        document.querySelector('.sell-form').appendChild(statusDiv);
        
        setTimeout(() => {
            statusDiv.remove();
        }, 5000);
    }

    // Utility function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Additional CSS for weather and market components
const additionalStyles = `
.weather-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.stat {
    text-align: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
    color: #2e7d32;
}

.stat-label {
    font-size: 0.9rem;
    color: #666;
}

.forecast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.forecast-item {
    text-align: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.forecast-day {
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.forecast-item i {
    font-size: 2rem;
    color: #4caf50;
    margin: 0.5rem 0;
}

.forecast-temp {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2e7d32;
}

.forecast-condition {
    font-size: 0.9rem;
    color: #666;
}

.advisory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.advisory-item {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.advisory-item h4 {
    color: #2e7d32;
    margin-bottom: 0.5rem;
}

.advisory-item i {
    margin-right: 0.5rem;
}

.price-change.positive {
    color: #28a745;
}

.price-change.negative {
    color: #dc3545;
}

.contact-btn {
    background: #4caf50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.contact-btn:hover {
    background: #2e7d32;
}

@media (max-width: 768px) {
    .weather-stats, .forecast-grid, .advisory-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
    
    .advisory-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Add additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new AgroAI();
});
