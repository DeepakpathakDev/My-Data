const axios = require('axios');

class StockEdgeService {
    constructor() {
        this.baseUrl = 'https://api.stockedge.com/Api';
        this.headers = {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Origin': 'https://stockedge.com',
            'Referer': 'https://stockedge.com/'
        };
    }

    async getCorporateAnnouncements(page = 1, pageSize = 19, lang = 'en') {
        try {
            console.log('Fetching corporate announcements...');
            const url = `${this.baseUrl}/DailyDashboardApi/GetCorporateAnnouncementDailyInfo/2`;
            console.log('API URL:', url);
            
            const response = await axios.get(url, {
                params: {
                    page,
                    pageSize,
                    lang
                },
                headers: this.headers
            });

            console.log('API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching corporate announcements:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = new StockEdgeService(); 