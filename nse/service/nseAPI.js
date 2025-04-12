const axios = require('axios');
const constants = require('../constant');

class NSEAPI {
    static async getMarketStatus() {
        try {
            return await axios.get(constants.MARKET_STATUS_URL);
        } catch (error) {
            console.error('Error fetching market status:', error);
            throw error;
        }
    }

    static async getIndices() {
        try {
            return await axios.get(constants.INDICES_WATCH_URL);
        } catch (error) {
            console.error('Error fetching indices:', error);
            throw error;
        }
    }

    static async getQuotes() {
        try {
            return await axios.get(constants.GET_QUOTE_URL);
        } catch (error) {
            console.error('Error fetching quotes:', error);
            throw error;
        }
    }

    static async getQuoteInfo(symbol) {
        try {
            return await axios.get(`${constants.QUOTE_INFO_URL}${symbol}`);
        } catch (error) {
            console.error('Error fetching quote info:', error);
            throw error;
        }
    }

    static async getMultipleQuoteInfo(symbols) {
        try {
            const promises = symbols.map(symbol => this.getQuoteInfo(symbol));
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error fetching multiple quote info:', error);
            throw error;
        }
    }

    static async getGainers() {
        try {
            return await axios.get(constants.GAINERS_URL);
        } catch (error) {
            console.error('Error fetching gainers:', error);
            throw error;
        }
    }

    static async getLosers() {
        try {
            return await axios.get(constants.LOSERS_URL);
        } catch (error) {
            console.error('Error fetching losers:', error);
            throw error;
        }
    }

    static async getInclineDecline() {
        try {
            return await axios.get(constants.ADVANCES_DECLINES_URL);
        } catch (error) {
            console.error('Error fetching incline/decline:', error);
            throw error;
        }
    }

    static async getIndexStocks(index) {
        try {
            return await axios.get(`${constants.INDEX_STOCKS_URL}${index}`);
        } catch (error) {
            console.error('Error fetching index stocks:', error);
            throw error;
        }
    }
}

module.exports = NSEAPI; 