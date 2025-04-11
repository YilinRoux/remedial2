require('dotenv').config();

module.exports = {
  token: process.env.CLOUDFLARE_STREAM_TOKEN,
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  customerSubdomain: process.env.CLOUDFLARE_CUSTOMER_SUBDOMAIN,
  apiBaseUrl: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`,
  videoLimits: {
    maxSize: parseInt(process.env.MAX_VIDEO_SIZE, 10),     // 50MB en bytes
    maxDuration: parseInt(process.env.MAX_VIDEO_DURATION, 10)  // 1 minuto en segundos
  }
};