const dataFetcher = require('../services/dataFetcher');

async function fetchAllData() {
    try {
        console.log('Starting data fetch...');
        
        // Fetch and store corporate announcements
        await dataFetcher.fetchAndStoreCorporateAnnouncements();
        
        console.log('Data fetch completed successfully');
    } catch (error) {
        console.error('Error in data fetch:', error);
    }
}

// Run immediately
fetchAllData();

// Run every 15 minutes
setInterval(fetchAllData, 15 * 60 * 1000); 