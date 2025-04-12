const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');
const stockedgeService = require('../services/stockedgeService');
const dataFetcher = require('../services/dataFetcher');

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Check if we're in production (deployed) environment
const isProduction = process.env.NODE_ENV === 'production';

// Get StockEdge index quotes
router.get('/stockedge/indices', async (req, res) => {
    try {
        const cacheKey = 'stockedge-indices';
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get('https://api.stockedge.com/Api/DailyDashboardApi/GetLatestIndexQuotes?page=1&pageSize=19&exchange=NSE&priceChangePeriodType=1&lang=en', {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.data || !Array.isArray(response.data)) {
            const mockData = [
                {
                    indexName: 'NIFTY 50',
                    current: 18500.25,
                    change: 100.50,
                    changePercent: 0.55,
                    high: 18600.75,
                    low: 18400.25
                },
                {
                    indexName: 'NIFTY BANK',
                    current: 43500.50,
                    change: 200.75,
                    changePercent: 0.46,
                    high: 43600.25,
                    low: 43400.50
                }
            ];
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        cache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching StockEdge indices:', error);
        res.status(500).json({ error: 'Failed to fetch StockEdge indices' });
    }
});

// Get StockEdge top price movers
router.get('/stockedge/price-movers', async (req, res) => {
    try {
        const cacheKey = 'stockedge-price-movers';
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get('https://api.stockedge.com/Api/MarketHomeDashboardApi/GetTopPriceMovers?gainerLosersTypeEnum=2&lang=en', {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.data || !Array.isArray(response.data)) {
            const mockData = [
                {
                    symbol: 'RELIANCE',
                    name: 'Reliance Industries Ltd',
                    sector: 'Energy',
                    price: 2750.25,
                    change: 50.75,
                    changePercent: 1.88
                },
                {
                    symbol: 'TCS',
                    name: 'Tata Consultancy Services Ltd',
                    sector: 'IT',
                    price: 3850.50,
                    change: -25.25,
                    changePercent: -0.65
                }
            ];
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        cache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching StockEdge price movers:', error);
        res.status(500).json({ error: 'Failed to fetch StockEdge price movers' });
    }
});

// Get StockEdge index gainers
router.get('/stockedge/index-gainers', async (req, res) => {
    try {
        const cacheKey = 'stockedge-index-gainers';
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get('https://api.stockedge.com/Api/DailyDashboardApi/GetLatestIndexQuotesForGainers?page=1&pageSize=19&exchange=NSE&priceChangePeriodType=1&lang=en', {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.data || !Array.isArray(response.data)) {
            const mockData = [
                {
                    indexName: 'NIFTY AUTO',
                    current: 18500.25,
                    change: 200.50,
                    changePercent: 1.10,
                    high: 18600.75,
                    low: 18400.25
                },
                {
                    indexName: 'NIFTY IT',
                    current: 32500.50,
                    change: 150.75,
                    changePercent: 0.47,
                    high: 32600.25,
                    low: 32400.50
                }
            ];
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        cache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching StockEdge index gainers:', error);
        res.status(500).json({ error: 'Failed to fetch StockEdge index gainers' });
    }
});

// Get StockEdge stock data
router.get('/stockedge/stock/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const cacheKey = `stockedge-stock-${symbol}`;
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get(`https://api.stockedge.com/Api/DailyDashboardApi/GetLatestStockQuotes?symbol=${symbol}&exchange=NSE&priceChangePeriodType=1&lang=en`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
            const mockData = {
                symbol: symbol,
                name: `${symbol} Ltd`,
                price: 1000.00,
                change: 10.00,
                changePercent: 1.00,
                high: 1010.00,
                low: 990.00,
                open: 995.00,
                volume: 1000000
            };
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        const stockData = response.data[0];
        const formattedData = {
            symbol: stockData.SecurityName,
            name: stockData.CompanyName,
            price: parseFloat(stockData.Close),
            change: parseFloat(stockData.Change),
            changePercent: parseFloat(stockData.ChangePercentage),
            high: parseFloat(stockData.High),
            low: parseFloat(stockData.Low),
            open: parseFloat(stockData.Open),
            volume: parseInt(stockData.Volume)
        };

        cache.set(cacheKey, formattedData);
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching StockEdge stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Get StockEdge stock history
router.get('/stockedge/stock/:symbol/history', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { timeframe = '1D' } = req.query;
        const cacheKey = `stockedge-stock-history-${symbol}-${timeframe}`;
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get(`https://api.stockedge.com/Api/ChartApi/GetHistoricalData?symbol=${symbol}&exchange=NSE&timeframe=${timeframe}&lang=en`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.data || !Array.isArray(response.data)) {
            const mockData = generateMockStockHistory(symbol, timeframe);
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        const historicalData = response.data.map(item => ({
            timestamp: item.Date,
            open: parseFloat(item.Open),
            high: parseFloat(item.High),
            low: parseFloat(item.Low),
            close: parseFloat(item.Close),
            volume: parseInt(item.Volume)
        }));

        cache.set(cacheKey, historicalData);
        res.json(historicalData);
    } catch (error) {
        console.error('Error fetching StockEdge historical data:', error);
        res.status(500).json({ error: 'Failed to fetch historical data' });
    }
});

// Helper function to generate mock stock history
function generateMockStockHistory(symbol, timeframe) {
    const now = new Date();
    const data = [];
    let basePrice = 1000;
    let intervals = 24;

    switch (timeframe) {
        case '1D':
            intervals = 24;
            break;
        case '5D':
            intervals = 5;
            break;
        case '1M':
            intervals = 30;
            break;
        case '1Y':
            intervals = 12;
            break;
    }

            for (let i = 0; i < intervals; i++) {
                const timestamp = new Date(now);
        timestamp.setDate(now.getDate() - (intervals - i));
        
        const price = basePrice + (Math.random() - 0.5) * 100;
        data.push({
            timestamp: timestamp.toISOString(),
            open: price - (Math.random() * 10),
            high: price + (Math.random() * 10),
            low: price - (Math.random() * 10),
            close: price,
            volume: Math.floor(Math.random() * 1000000)
        });
    }

    return data;
}

// Get StockEdge insider trading deals
router.get('/stockedge/insider-deals', async (req, res) => {
    try {
        const { exchange = 'BSE', page = 1, pageSize = 10, transactionType, dealMode } = req.query;
        const cacheKey = `stockedge-insider-deals-${exchange}-${page}-${pageSize}-${transactionType || ''}-${dealMode || ''}`;
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const exchangeCode = exchange.toUpperCase() === 'NSE' ? 1 : 2;
        const response = await axios.get(`https://api.stockedge.com/Api/DealsDashboardApi/GetLatestInsidertradingDeals?exchange=${exchangeCode}&page=${page}&pageSize=${pageSize}&insiderDealTransactionTypes=${transactionType || ''}&dealModeTypes=${dealMode || ''}&lang=en`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.data || !Array.isArray(response.data)) {
            const mockData = {
                totalRecords: 0,
                deals: []
            };
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        const formattedData = {
            totalRecords: response.data.length,
            deals: response.data.map(deal => ({
                name: deal.ClientName,
                category: deal.PersonCategory,
                transactionType: deal.DealTransactionType,
                stockName: deal.SecurityName,
                exchange: deal.ExchangeName,
                quantity: deal.DealQuantity,
                value: deal.TotalDealValue,
                pricePerShare: deal.ValuePerShare,
                holdingPostDeal: deal.HoldingPostDeal,
                holdingPercentage: deal.HoldingPostDealG,
                dealDate: deal.TransactionFromDate,
                dealMode: deal.DealMode
            }))
        };

        cache.set(cacheKey, formattedData);
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching StockEdge insider deals:', error);
        res.status(500).json({ 
            error: 'Failed to fetch insider deals',
            totalRecords: 0,
            deals: []
        });
    }
});

// Get StockEdge search results
router.get('/stockedge/search', async (req, res) => {
    try {
        const { q: query } = req.query;
        const cacheKey = `stockedge-search-${query}`;
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get(`https://api.stockedge.com/Api/SearchApi/GetSearchResults?searchText=${encodeURIComponent(query)}&page=1&pageSize=10&lang=en`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.data || !Array.isArray(response.data)) {
            const mockData = [
                {
                    ID: 1,
                    Security: 'RELIANCE',
                    Industry: 'Energy',
                    Sector: 'Oil & Gas',
                    MCAP: 1500000000000
                },
                {
                    ID: 2,
                    Security: 'TCS',
                    Industry: 'IT',
                    Sector: 'Technology',
                    MCAP: 1200000000000
                }
            ];
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        const formattedData = response.data.map(item => ({
            ID: item.ID,
            Security: item.SecurityName,
            Industry: item.IndustryName,
            Sector: item.SectorName,
            MCAP: item.MCAP
        }));

        cache.set(cacheKey, formattedData);
        res.json(formattedData);
    } catch (error) {
        console.error('Error searching stocks:', error);
        res.status(500).json({ error: 'Failed to search stocks' });
    }
});

// Get NSE stock details
router.get('/nse/stock/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const cacheKey = `nse-stock-${symbol}`;
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get(`https://www.nseindia.com/api/quote-equity?symbol=${symbol}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        });

        if (!response.data) {
            const mockData = {
                info: {
                    symbol: symbol,
                    companyName: `${symbol} Ltd`,
                    industry: 'Unknown',
                    sector: 'Unknown'
                },
                priceInfo: {
                    lastPrice: 1000.00,
                    change: 10.00,
                    pChange: 1.00,
                    dayHigh: 1010.00,
                    dayLow: 990.00,
                    open: 995.00,
                    previousClose: 990.00
                },
                marketCap: {
                    value: 1000000000000,
                    label: '1,00,000 Cr'
                },
                volume: {
                    totalTradedVolume: 1000000,
                    totalTradedValue: 1000000000
                },
                fundamentals: {
                    pe: 20.00,
                    bookValue: 500.00,
                    dividendYield: 2.00
                }
            };
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        const data = response.data;
        const formattedData = {
            info: {
                symbol: data.info.symbol,
                companyName: data.info.companyName,
                industry: data.info.industry,
                sector: data.info.sector
            },
            priceInfo: {
                lastPrice: data.priceInfo.lastPrice,
                change: data.priceInfo.change,
                pChange: data.priceInfo.pChange,
                dayHigh: data.priceInfo.dayHigh,
                dayLow: data.priceInfo.dayLow,
                open: data.priceInfo.open,
                previousClose: data.priceInfo.previousClose
            },
            marketCap: {
                value: data.marketCapInfo.marketCap,
                label: data.marketCapInfo.label
            },
            volume: {
                totalTradedVolume: data.priceInfo.totalTradedVolume,
                totalTradedValue: data.priceInfo.totalTradedValue
            },
            fundamentals: {
                pe: data.fundamentalInfo.pe,
                bookValue: data.fundamentalInfo.bookValue,
                dividendYield: data.fundamentalInfo.dividendYield
            }
        };

        cache.set(cacheKey, formattedData);
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching NSE stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Get trending stocks (all-time highs)
router.get('/stockedge/trending-stocks', async (req, res) => {
    try {
        const cacheKey = 'stockedge-trending-stocks';
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get('https://api.stockedge.com/Api/TrendingStocksApi/GetCurrentAllTimeHighLow?highLowTypeEnum=1&page=1&pageSize=19&lang=en', {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.data || !Array.isArray(response.data)) {
            const mockData = [
                {
                    Name: 'RELIANCE',
                    Symbol: 'RELIANCE',
                    Exchange: 'NSE',
                    Sector: 'Energy',
                    C: 2500.00,
                    CZG: 2.50
                },
                {
                    Name: 'TCS',
                    Symbol: 'TCS',
                    Exchange: 'NSE',
                    Sector: 'IT',
                    C: 3500.00,
                    CZG: 1.80
                }
            ];
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        const formattedData = response.data.map(stock => ({
            name: stock.Name,
            symbol: stock.Symbol,
            exchange: stock.Exchange,
            sector: stock.Sector,
            currentPrice: stock.C,
            changePercent: stock.CZG
        }));

        cache.set(cacheKey, formattedData);
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching trending stocks:', error);
        res.status(500).json({ error: 'Failed to fetch trending stocks' });
    }
});

// Get most visited stocks
router.get('/stockedge/most-visited', async (req, res) => {
    try {
        const cacheKey = 'stockedge-most-visited';
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        // If in production, return mock data
        if (isProduction) {
            const mockData = [
                {
                    id: 1,
                    name: "RELIANCE",
                    sector: "Energy",
                    price: 2500.00,
                    exchange: "NSE",
                    change: 25.00,
                    changePercent: 1.00
                },
                {
                    id: 2,
                    name: "TCS",
                    sector: "IT",
                    price: 3500.00,
                    exchange: "NSE",
                    change: -15.00,
                    changePercent: -0.43
                }
            ];
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        const response = await axios.get('https://api.stockedge.com/Api/TrendingStocksApi/GetMostVisitedStocks?lang=en', {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.data || !Array.isArray(response.data)) {
            const mockData = [
                {
                    id: 1,
                    name: "RELIANCE",
                    sector: "Energy",
                    price: 2500.00,
                    exchange: "NSE",
                    change: 25.00,
                    changePercent: 1.00
                },
                {
                    id: 2,
                    name: "TCS",
                    sector: "IT",
                    price: 3500.00,
                    exchange: "NSE",
                    change: -15.00,
                    changePercent: -0.43
                }
            ];
            cache.set(cacheKey, mockData);
            return res.json(mockData);
        }

        const formattedData = response.data.map(stock => ({
            id: stock.SecurityID,
            name: stock.SecurityName,
            sector: stock.SectorName,
            price: stock.LTP,
            exchange: stock.Exchange,
            change: stock.CZ,
            changePercent: stock.CZG
        }));

        cache.set(cacheKey, formattedData);
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching most visited stocks:', error);
        res.status(500).json({ error: 'Failed to fetch most visited stocks' });
    }
});

// Corporate Announcements Route
router.get('/stockedge/corporate-announcements', async (req, res) => {
    try {
        const { page = 1, pageSize = 19 } = req.query;
        console.log('Request received for corporate announcements:', { page, pageSize });
        
        // Get stored data
        const storedData = dataFetcher.getCorporateAnnouncements();
        
        if (!storedData) {
            // If no stored data, fetch fresh data
            console.log('No stored data found, fetching fresh data...');
            const freshData = await dataFetcher.fetchAndStoreCorporateAnnouncements();
            
            if (!freshData || !Array.isArray(freshData)) {
                throw new Error('Invalid data format received from API');
            }

            // Calculate pagination
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedData = freshData.slice(startIndex, endIndex);

            return res.json({
                data: paginatedData,
                total: freshData.length,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages: Math.ceil(freshData.length / pageSize)
            });
        }

        // Calculate pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = storedData.slice(startIndex, endIndex);

        res.json({
            data: paginatedData,
            total: storedData.length,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(storedData.length / pageSize)
        });
    } catch (error) {
        console.error('Error in corporate announcements route:', error);
        res.status(500).json({ 
            error: 'Failed to fetch corporate announcements',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router; 