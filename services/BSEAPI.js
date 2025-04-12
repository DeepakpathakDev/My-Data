const BSEAPI = require('../bse/index');

/**
 * Get stock info and day chart data for a stock
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Array>} - Array of price data points
 */
async function getStockInfoAndDayChartData(symbol) {
  try {
    // Get data from BSE API
    const response = await BSEAPI.getQuoteInfo(symbol);
    
    // If API call fails, generate mock data
    if (!response || !response.data || response.data.length === 0) {
      console.log(`No data from BSE API for ${symbol}, using mock data`);
      return generateMockStockHistory(symbol, '1D');
    }
    
    // Transform data to common format
    return response.data.map(item => ({
      timestamp: item.dateTime,
      price: parseFloat(item.stockValue),
      volume: parseInt(item.volume || 0),
      source: 'BSE'
    }));
  } catch (error) {
    console.error(`Error fetching BSE data for ${symbol}:`, error);
    // Return mock data on error
    return generateMockStockHistory(symbol, '1D');
  }
}

/**
 * Generate mock stock history data
 * @param {string} symbol - Stock symbol
 * @param {string} period - Time period
 * @returns {Array} - Array of mock price data points
 */
function generateMockStockHistory(symbol, period) {
  const now = new Date();
  const data = [];
  
  // Set base price based on symbol
  let basePrice;
  switch (symbol) {
    case 'SENSEX':
      basePrice = 62500;
      break;
    case 'BANKEX':
      basePrice = 48500;
      break;
    case 'RELIANCE':
      basePrice = 2750;
      break;
    case 'TCS':
      basePrice = 3850;
      break;
    case 'HDFCBANK':
      basePrice = 1650;
      break;
    case 'INFY':
      basePrice = 1450;
      break;
    case 'ICICIBANK':
      basePrice = 950;
      break;
    case 'HINDUNILVR':
      basePrice = 2450;
      break;
    case 'ITC':
      basePrice = 425;
      break;
    case 'SBIN':
      basePrice = 650;
      break;
    case 'BHARTIARTL':
      basePrice = 1150;
      break;
    case 'KOTAKBANK':
      basePrice = 1750;
      break;
    default:
      basePrice = 1000 + Math.random() * 9000;
  }
  
  // Generate data points based on period
  let intervals;
  let timeIncrement;
  
  switch (period) {
    case '1D':
      intervals = 24; // 24 hours
      timeIncrement = 60 * 60 * 1000; // 1 hour in milliseconds
      break;
    case '5D':
      intervals = 5; // 5 days
      timeIncrement = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      break;
    case '1M':
      intervals = 30; // 30 days
      timeIncrement = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      break;
    case 'YTD':
      intervals = Math.floor((now - new Date(now.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000)); // Days since Jan 1
      timeIncrement = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      break;
    case '1Y':
      intervals = 12; // 12 months
      timeIncrement = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      break;
    case '5Y':
      intervals = 5; // 5 years
      timeIncrement = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
      break;
    default:
      intervals = 24; // Default to 24 hours
      timeIncrement = 60 * 60 * 1000; // 1 hour in milliseconds
  }
  
  // Generate data points
  for (let i = 0; i < intervals; i++) {
    const timestamp = new Date(now.getTime() - (intervals - i) * timeIncrement);
    
    // Add some randomness to price
    const randomFactor = 1 + (Math.random() - 0.5) * 0.1; // ±5% change
    const price = basePrice * randomFactor;
    
    // Add some randomness to volume
    const volume = Math.floor(100000 + Math.random() * 900000);
    
    data.push({
      timestamp: timestamp.toISOString(),
      price: parseFloat(price.toFixed(2)),
      volume: volume,
      source: 'BSE (Mock)'
    });
  }
  
  return data;
}

module.exports = {
  getStockInfoAndDayChartData
}; 