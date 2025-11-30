// API Configuration
const API_BASE_URL = 'https://tvi3w-production.up.railway.app';

// API Client
const api = {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Analysis endpoints
    async analyzeContent(content, platform) {
        return this.request('/api/analysis/content', {
            method: 'POST',
            body: JSON.stringify({ content, platform })
        });
    },

    async getSentiment(content) {
        return this.request('/api/analysis/sentiment', {
            method: 'POST',
            body: JSON.stringify({ content })
        });
    },

    async getInsights(content, platform) {
        return this.request('/api/analysis/insights', {
            method: 'POST',
            body: JSON.stringify({ content, platform })
        });
    },

    // Meeting endpoints
    async generateQuestions(context, type = 'all') {
        return this.request('/api/meeting/questions', {
            method: 'POST',
            body: JSON.stringify({ context, type })
        });
    },

    async extractKeyPoints(transcript) {
        return this.request('/api/meeting/keypoints', {
            method: 'POST',
            body: JSON.stringify({ transcript })
        });
    },

    async researchTopic(topic) {
        return this.request('/api/meeting/research', {
            method: 'POST',
            body: JSON.stringify({ topic })
        });
    },

    async summarizeMeeting(transcript) {
        return this.request('/api/meeting/summarize', {
            method: 'POST',
            body: JSON.stringify({ transcript })
        });
    },

    // Business endpoints
    async analyzePitch(pitch) {
        return this.request('/api/business/pitch', {
            method: 'POST',
            body: JSON.stringify({ pitch })
        });
    },

    async summarizeContract(contractText) {
        return this.request('/api/business/contract-summary', {
            method: 'POST',
            body: JSON.stringify({ contractText })
        });
    },

    async getContactInsights(contactInfo) {
        return this.request('/api/business/contact-insights', {
            method: 'POST',
            body: JSON.stringify({ contactInfo })
        });
    },

    async getVenueSuggestions(requirements) {
        return this.request('/api/business/venue-suggestions', {
            method: 'POST',
            body: JSON.stringify({ requirements })
        });
    },

    // Health check
    async healthCheck() {
        return this.request('/api/health');
    }
};

// Export for use in app.js
window.api = api;
