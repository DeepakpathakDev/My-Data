const axios = require('axios');
const fs = require('fs');
const path = require('path');

class DataFetcher {
    constructor() {
        this.dataDir = path.join(__dirname, '..', 'data');
        this.ensureDataDirectory();
    }

    ensureDataDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    async fetchAndStoreCorporateAnnouncements() {
        try {
            console.log('Fetching corporate announcements...');
            const url = 'https://api.stockedge.com/Api/DailyDashboardApi/GetCorporateAnnouncementDailyInfo/2';
            
            const response = await axios.get(url, {
                params: {
                    page: 1,
                    pageSize: 19,
                    lang: 'en'
                },
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Origin': 'https://stockedge.com',
                    'Referer': 'https://stockedge.com/'
                }
            });

            console.log('API Response:', response.data);

            if (!response.data) {
                throw new Error('No data received from API');
            }

            // Ensure the data is in the expected format
            const formattedData = Array.isArray(response.data) ? response.data : [response.data];
            
            const filePath = path.join(this.dataDir, 'corporate_announcements.json');
            
            // Store the data
            fs.writeFileSync(filePath, JSON.stringify(formattedData, null, 2));
            console.log('Corporate announcements data stored successfully');

            return formattedData;
        } catch (error) {
            console.error('Error fetching and storing corporate announcements:', error);
            if (error.response) {
                console.error('API Response Status:', error.response.status);
                console.error('API Response Data:', error.response.data);
            }
            throw error;
        }
    }

    getCorporateAnnouncements() {
        try {
            const filePath = path.join(this.dataDir, 'corporate_announcements.json');
            if (!fs.existsSync(filePath)) {
                console.log('No stored data found at:', filePath);
                return null;
            }
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log('Retrieved stored data:', data.length, 'records');
            return data;
        } catch (error) {
            console.error('Error reading corporate announcements:', error);
            return null;
        }
    }
}

module.exports = new DataFetcher(); 