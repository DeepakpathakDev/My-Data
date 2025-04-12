const { getJson } = require("serpapi");
const axios = require('axios');
const yahooFinance = require('yahoo-finance2').default;

class SerpAPI {
    constructor() {
        this.apiKey = "665e857152cd9767cb7d1a5054ef936cc32d8e76144a7bb6d53e5ef7fa5e0b1b";
        this.nseHeaders = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
        };
    }

    async getStockData(symbol) {
        try {
            // Try NSE API first
            try {
                const nseResponse = await axios.get(`https://www.nseindia.com/api/quote-equity?symbol=${symbol}`, {
                    headers: this.nseHeaders
                });
                const nseData = nseResponse.data;
                
                if (nseData && nseData.priceInfo) {
                    const priceInfo = nseData.priceInfo;
                    return {
                        symbol: symbol,
                        name: nseData.info.companyName,
                        price: parseFloat(priceInfo.lastPrice),
                        change: parseFloat(priceInfo.change),
                        changePercent: parseFloat(priceInfo.pChange),
                        marketCap: parseFloat(priceInfo.marketCap),
                        volume: parseInt(priceInfo.totalTradedVolume),
                        high: parseFloat(priceInfo.intraDayHighLow.max),
                        low: parseFloat(priceInfo.intraDayHighLow.min),
                        open: parseFloat(priceInfo.open),
                        previousClose: parseFloat(priceInfo.previousClose),
                        timestamp: new Date().toISOString(),
                        source: 'NSE'
                    };
                }
            } catch (error) {
                console.log('NSE API failed, trying Yahoo Finance...');
            }

            // Try Yahoo Finance as fallback
            try {
                const yahooData = await yahooFinance.quote(`${symbol}.NS`);
                if (yahooData && yahooData.regularMarketPrice) {
                    return {
                        symbol: symbol,
                        name: yahooData.longName || symbol,
                        price: yahooData.regularMarketPrice,
                        change: yahooData.regularMarketChange,
                        changePercent: yahooData.regularMarketChangePercent,
                        marketCap: yahooData.marketCap,
                        volume: yahooData.regularMarketVolume,
                        high: yahooData.regularMarketDayHigh,
                        low: yahooData.regularMarketDayLow,
                        open: yahooData.regularMarketOpen,
                        previousClose: yahooData.regularMarketPreviousClose,
                        timestamp: new Date().toISOString(),
                        source: 'Yahoo Finance'
                    };
                }
            } catch (error) {
                console.log('Yahoo Finance failed, trying Google Finance...');
            }

            // Fallback to Google Finance via SerpAPI
            const response = await getJson({
                engine: "google_finance",
                q: `${symbol}:NSE`,
                api_key: this.apiKey
            });

            if (response && response.quotes && response.quotes.length > 0) {
                const stockData = response.quotes[0];
                return {
                    symbol: stockData.symbol,
                    name: stockData.name,
                    price: parseFloat(stockData.price),
                    change: parseFloat(stockData.change),
                    changePercent: parseFloat(stockData.change_percent),
                    marketCap: parseFloat(stockData.market_cap),
                    volume: parseInt(stockData.volume),
                    high: parseFloat(stockData.high),
                    low: parseFloat(stockData.low),
                    open: parseFloat(stockData.open),
                    previousClose: parseFloat(stockData.previous_close),
                    timestamp: new Date().toISOString(),
                    source: 'Google Finance'
                };
            }

            throw new Error('No stock data found from any source');
        } catch (error) {
            console.error('Error fetching stock data:', error);
            return this.generateMockStockData(symbol);
        }
    }

    async searchStocks(query) {
        try {
            // Try Yahoo Finance first
            try {
                const yahooResults = await yahooFinance.search(query);
                if (yahooResults && yahooResults.quotes) {
                    return yahooResults.quotes
                        .filter(quote => quote.exchange === 'NSI')
                        .map(quote => ({
                            symbol: quote.symbol.replace('.NS', ''),
                            name: quote.longname || quote.shortname,
                            price: quote.regularMarketPrice,
                            change: quote.regularMarketChange,
                            changePercent: quote.regularMarketChangePercent,
                            marketCap: quote.marketCap,
                            volume: quote.regularMarketVolume,
                            timestamp: new Date().toISOString(),
                            source: 'Yahoo Finance'
                        }));
                }
            } catch (error) {
                console.log('Yahoo Finance search failed, trying Google Finance...');
            }

            // Fallback to Google Finance via SerpAPI
            const response = await getJson({
                engine: "google_finance",
                q: query,
                api_key: this.apiKey
            });

            if (response && response.quotes) {
                return response.quotes
                    .filter(quote => quote.exchange === 'NSE')
                    .map(quote => ({
                        symbol: quote.symbol,
                        name: quote.name,
                        price: parseFloat(quote.price),
                        change: parseFloat(quote.change),
                        changePercent: parseFloat(quote.change_percent),
                        marketCap: parseFloat(quote.market_cap),
                        volume: parseInt(quote.volume),
                        timestamp: new Date().toISOString(),
                        source: 'Google Finance'
                    }));
            }

            return [];
        } catch (error) {
            console.error('Error searching stocks:', error);
            return [];
        }
    }

    async getMarketTrends() {
        try {
            // Try NSE API first
            try {
                const nseResponse = await axios.get('https://www.nseindia.com/api/marketStatus', {
                    headers: this.nseHeaders
                });
                const nseData = nseResponse.data;

                if (nseData && nseData.marketState) {
                    return nseData.marketState
                        .filter(state => state.market === 'Capital Market' && state.index)
                        .map(state => ({
                            symbol: state.index.replace(/\s+/g, ''),
                            name: state.index,
                            price: parseFloat(state.last),
                            change: parseFloat(state.variation),
                            changePercent: parseFloat(state.percentChange),
                            marketStatus: state.marketStatus,
                            tradeDate: state.tradeDate,
                            message: state.marketStatusMessage,
                            region: 'India',
                            timestamp: new Date().toISOString(),
                            source: 'NSE'
                        }));
                }
            } catch (error) {
                console.log('NSE API failed, trying Google Finance...');
            }

            // Fallback to Google Finance via SerpAPI
            const response = await getJson({
                engine: "google_finance_markets",
                trend: "indexes",
                api_key: this.apiKey
            });

            if (response && response.market_trends) {
                return response.market_trends.map(trend => ({
                    symbol: trend.symbol,
                    name: trend.name,
                    price: parseFloat(trend.price),
                    change: parseFloat(trend.change),
                    changePercent: parseFloat(trend.change_percent),
                    region: trend.region,
                    timestamp: new Date().toISOString(),
                    source: 'Google Finance'
                }));
            }

            return this.generateMockMarketTrends();
        } catch (error) {
            console.error('Error fetching market trends:', error);
            return this.generateMockMarketTrends();
        }
    }

    generateMockStockData(symbol) {
        const basePrice = 1000 + Math.random() * 9000;
        const change = (Math.random() - 0.5) * 100;
        const changePercent = (change / basePrice) * 100;
        const volume = Math.floor(100000 + Math.random() * 900000);
        const marketCap = basePrice * volume;
        const high = basePrice * (1 + Math.random() * 0.05);
        const low = basePrice * (1 - Math.random() * 0.05);
        const open = basePrice * (1 + (Math.random() - 0.5) * 0.02);
        const previousClose = basePrice - change;

        return {
            symbol: symbol,
            name: `${symbol} Company`,
            price: parseFloat(basePrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            marketCap: parseFloat(marketCap.toFixed(2)),
            volume: volume,
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            open: parseFloat(open.toFixed(2)),
            previousClose: parseFloat(previousClose.toFixed(2)),
            timestamp: new Date().toISOString(),
            source: 'Mock Data'
        };
    }

    generateMockMarketTrends() {
        const indices = ['NIFTY 50', 'NIFTY BANK', 'SENSEX', 'NIFTY IT'];
        return indices.map(index => {
            const basePrice = 10000 + Math.random() * 50000;
            const change = (Math.random() - 0.5) * 500;
            const changePercent = (change / basePrice) * 100;

            return {
                symbol: index.replace(/\s+/g, ''),
                name: index,
                price: parseFloat(basePrice.toFixed(2)),
                change: parseFloat(change.toFixed(2)),
                changePercent: parseFloat(changePercent.toFixed(2)),
                marketStatus: 'Closed',
                tradeDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                message: 'Market is Closed',
                region: 'India',
                timestamp: new Date().toISOString(),
                source: 'Mock Data'
            };
        });
    }
}

module.exports = SerpAPI; 