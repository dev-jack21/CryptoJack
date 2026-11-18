const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
    app.use(
        createProxyMiddleware('/api/coingecko', {
            target: 'https://api.coingecko.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api/coingecko': '/api/v3',
            },
        })
    );
};
