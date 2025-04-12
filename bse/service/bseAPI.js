const axios = require('axios');
const constants = require('../constant');

class BSEAPI {
    static async getIndices() {
        try {
            return await axios.get(constants.INDICES_URL);
        } catch (error) {
            console.error('Error fetching indices:', error);
            throw error;
        }
    }

    static async getIndexInfo() {
        try {
            return await axios.get(constants.INDEX_INFO_URL);
        } catch (error) {
            console.error('Error fetching index info:', error);
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

    static async getTurnover() {
        try {
            return await axios.get(constants.TURNOVER_URL);
        } catch (error) {
            console.error('Error fetching turnover:', error);
            throw error;
        }
    }

    static async getStockInfo(symbol) {
        try {
            return await axios.get(`${constants.COMPANY_HEADER_URL}${symbol}`);
        } catch (error) {
            console.error('Error fetching stock info:', error);
            throw error;
        }
    }

    static async getDailyStocks() {
        try {
            return await axios.get(constants.DAILY_STOCKS_URL);
        } catch (error) {
            console.error('Error fetching daily stocks:', error);
            throw error;
        }
    }

    static async getStockHistory(symbol) {
        try {
            return await axios.get(`${constants.HISTORY_STOCKS_URL}${symbol}`);
        } catch (error) {
            console.error('Error fetching stock history:', error);
            throw error;
        }
    }
}

module.exports = BSEAPI; 