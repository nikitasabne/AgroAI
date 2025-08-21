// Plant Disease Detection Model Handler using TensorFlow.js
class PlantDiseaseModel {
    constructor() {
        this.model = null;
        this.isLoaded = false;
        this.modelUrl = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';
        
        // Plant disease classes based on PlantVillage dataset
        this.diseaseClasses = [
            'Apple___Apple_scab',
            'Apple___Black_rot',
            'Apple___Cedar_apple_rust',
            'Apple___healthy',
            'Blueberry___healthy',
            'Cherry_(including_sour)___Powdery_mildew',
            'Cherry_(including_sour)___healthy',
            'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
            'Corn_(maize)___Common_rust_',
            'Corn_(maize)___Northern_Leaf_Blight',
            'Corn_(maize)___healthy',
            'Grape___Black_rot',
            'Grape___Esca_(Black_Measles)',
            'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
            'Grape___healthy',
            'Orange___Haunglongbing_(Citrus_greening)',
            'Peach___Bacterial_spot',
            'Peach___healthy',
            'Pepper,_bell___Bacterial_spot',
            'Pepper,_bell___healthy',
            'Potato___Early_blight',
            'Potato___Late_blight',
            'Potato___healthy',
            'Raspberry___healthy',
            'Soybean___healthy',
            'Squash___Powdery_mildew',
            'Strawberry___Leaf_scorch',
            'Strawberry___healthy',
            'Tomato___Bacterial_spot',
            'Tomato___Early_blight',
            'Tomato___Late_blight',
            'Tomato___Leaf_Mold',
            'Tomato___Septoria_leaf_spot',
            'Tomato___Spider_mites Two-spotted_spider_mite',
            'Tomato___Target_Spot',
            'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
            'Tomato___Tomato_mosaic_virus',
            'Tomato___healthy'
        ];

        // Disease information database
        this.diseaseInfo = {
            'Apple___Apple_scab': {
                name: 'Apple Scab',
                description: 'A fungal disease that affects apple trees, causing dark spots on leaves and fruit.',
                severity: 'Moderate',
                treatments: [
                    'Apply fungicide spray containing captan or sulfur',
                    'Remove fallen leaves and infected fruit',
                    'Prune to improve air circulation',
                    'Apply preventive fungicide in early spring'
                ],
                prevention: 'Choose resistant varieties and maintain good sanitation'
            },
            'Apple___Black_rot': {
                name: 'Apple Black Rot',
                description: 'A fungal disease causing black, circular spots on leaves and fruit rot.',
                severity: 'High',
                treatments: [
                    'Remove infected fruit and leaves immediately',
                    'Apply copper-based fungicide',
                    'Prune infected branches',
                    'Improve orchard sanitation'
                ],
                prevention: 'Regular pruning and good air circulation'
            },
            'Tomato___Early_blight': {
                name: 'Tomato Early Blight',
                description: 'A common fungal disease causing brown spots with concentric rings on leaves.',
                severity: 'Moderate',
                treatments: [
                    'Apply fungicide containing chlorothalonil or copper',
                    'Remove affected leaves from bottom up',
                    'Improve air circulation around plants',
                    'Water at soil level to avoid wetting leaves'
                ],
                prevention: 'Crop rotation and mulching to prevent soil splash'
            },
            'Tomato___Late_blight': {
                name: 'Tomato Late Blight',
                description: 'A devastating disease that can destroy entire tomato crops rapidly.',
                severity: 'Critical',
                treatments: [
                    'Apply copper fungicide immediately',
                    'Remove and destroy infected plants',
                    'Improve ventilation',
                    'Avoid overhead watering'
                ],
                prevention: 'Use resistant varieties and ensure good drainage'
            },
            'Potato___Early_blight': {
                name: 'Potato Early Blight',
                description: 'Fungal disease causing dark spots with target-like patterns on potato leaves.',
                severity: 'Moderate',
                treatments: [
                    'Apply fungicide containing mancozeb',
                    'Remove infected foliage',
                    'Hill soil around plants',
                    'Maintain proper spacing'
                ],
                prevention: 'Use certified seed potatoes and practice crop rotation'
            },
            'Potato___Late_blight': {
                name: 'Potato Late Blight',
                description: 'The same pathogen that caused the Irish Potato Famine.',
                severity: 'Critical',
                treatments: [
                    'Apply copper-based fungicide',
                    'Remove infected plants immediately',
                    'Harvest tubers before disease spreads',
                    'Destroy infected plant material'
                ],
                prevention: 'Use resistant varieties and avoid wet conditions'
            },
            'Corn_(maize)___Common_rust_': {
                name: 'Corn Common Rust',
                description: 'Fungal disease causing orange-brown pustules on corn leaves.',
                severity: 'Moderate',
                treatments: [
                    'Apply fungicide if severe',
                    'Plant resistant hybrids',
                    'Remove infected leaves',
                    'Ensure good field drainage'
                ],
                prevention: 'Choose resistant varieties and avoid dense planting'
            },
            'Pepper,_bell___Bacterial_spot': {
                name: 'Pepper Bacterial Spot',
                description: 'Bacterial disease causing small, dark spots on pepper leaves and fruit.',
                severity: 'Moderate',
                treatments: [
                    'Apply copper-based bactericide',
                    'Remove infected plant parts',
                    'Avoid overhead irrigation',
                    'Use drip irrigation system'
                ],
                prevention: 'Use certified disease-free seeds and practice crop rotation'
            }
        };
    }

    async loadModel() {
        try {
            console.log('Loading plant disease detection model...');
            
            // For demo purposes, we'll use MobileNet and simulate plant disease detection
            // In production, you would use a actual plant disease model
            this.model = await tf.loadLayersModel(this.modelUrl);
            
            console.log('Model loaded successfully');
            this.isLoaded = true;
            return true;
        } catch (error) {
            console.error('Error loading model:', error);
            
            // Fallback: Create a simple mock model for demonstration
            this.createMockModel();
            return false;
        }
    }

    createMockModel() {
        console.log('Creating mock model for demonstration...');
        this.isLoaded = true;
        this.mockMode = true;
    }

    async preprocessImage(imageElement) {
        // Resize image to 224x224 (standard input size for many models)
        const tensor = tf.browser.fromPixels(imageElement)
            .resizeNearestNeighbor([224, 224])
            .expandDims(0)
            .div(255.0);
        
        return tensor;
    }

    async predict(imageElement) {
        if (!this.isLoaded) {
            throw new Error('Model not loaded yet');
        }

        try {
            const preprocessedImage = await this.preprocessImage(imageElement);
            
            let predictions;
            
            if (this.mockMode) {
                // Mock prediction for demonstration
                predictions = this.generateMockPrediction();
            } else {
                // Real model prediction
                const modelOutput = await this.model.predict(preprocessedImage).data();
                predictions = this.processModelOutput(modelOutput);
            }

            // Clean up tensor
            preprocessedImage.dispose();

            return predictions;
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        }
    }

    generateMockPrediction() {
        // Simulate realistic disease detection
        const commonDiseases = [
            'Tomato___Early_blight',
            'Tomato___Late_blight',
            'Potato___Early_blight',
            'Apple___Apple_scab',
            'Corn_(maize)___Common_rust_',
            'Pepper,_bell___Bacterial_spot'
        ];

        const randomDisease = commonDiseases[Math.floor(Math.random() * commonDiseases.length)];
        const confidence = (Math.random() * 0.3 + 0.7) * 100; // 70-100% confidence

        return {
            predictedClass: randomDisease,
            confidence: Math.round(confidence),
            allPredictions: [
                { class: randomDisease, confidence: confidence },
                { class: 'healthy', confidence: 100 - confidence }
            ]
        };
    }

    processModelOutput(modelOutput) {
        // Convert model output to disease predictions
        const predictions = Array.from(modelOutput);
        
        // Find top predictions
        const indexedPredictions = predictions.map((prob, index) => ({
            class: this.diseaseClasses[index] || `Disease_${index}`,
            confidence: prob * 100
        }));

        // Sort by confidence
        indexedPredictions.sort((a, b) => b.confidence - a.confidence);

        return {
            predictedClass: indexedPredictions[0].class,
            confidence: Math.round(indexedPredictions[0].confidence),
            allPredictions: indexedPredictions.slice(0, 5) // Top 5 predictions
        };
    }

    getDiseaseInfo(predictedClass) {
        const diseaseKey = predictedClass;
        const info = this.diseaseInfo[diseaseKey];

        if (info) {
            return info;
        }

        // Parse disease name for better display
        const parts = predictedClass.split('___');
        const crop = parts[0] ? parts[0].replace(/_/g, ' ') : 'Unknown';
        const disease = parts[1] ? parts[1].replace(/_/g, ' ') : 'Unknown Disease';

        // Return generic info for unknown diseases
        return {
            name: disease,
            description: `Disease detected in ${crop}. Requires expert consultation for proper identification.`,
            severity: 'Unknown',
            treatments: [
                'Consult with local agricultural extension office',
                'Remove affected plant parts',
                'Improve plant spacing and ventilation',
                'Monitor closely for disease progression'
            ],
            prevention: 'Practice good sanitation and use disease-resistant varieties'
        };
    }

    formatAnalysisResult(predictions, imageElement) {
        const diseaseInfo = this.getDiseaseInfo(predictions.predictedClass);
        
        return {
            disease: diseaseInfo.name,
            confidence: predictions.confidence,
            severity: diseaseInfo.severity,
            description: diseaseInfo.description,
            treatments: diseaseInfo.treatments,
            prevention: diseaseInfo.prevention,
            cropType: this.extractCropType(predictions.predictedClass),
            isHealthy: predictions.predictedClass.includes('healthy'),
            allPredictions: predictions.allPredictions
        };
    }

    extractCropType(predictedClass) {
        const parts = predictedClass.split('___');
        return parts[0] ? parts[0].replace(/_/g, ' ') : 'Unknown';
    }

    // Utility method to check if model is ready
    isModelReady() {
        return this.isLoaded;
    }

    // Get model info
    getModelInfo() {
        return {
            isLoaded: this.isLoaded,
            isMockMode: this.mockMode || false,
            supportedClasses: this.diseaseClasses.length,
            version: '1.0.0'
        };
    }
}

// Export for use in main application
window.PlantDiseaseModel = PlantDiseaseModel;
