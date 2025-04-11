module.exports = {
    apps : [{
      name: 'remedial-backend',
      script: 'app.js',
      cwd: '/opt/remedial/backend',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        MONGODB_URI: 'mongodb+srv://samuel:akira123@cluster0.u69l4vh.mongodb.net/videoApp?retryWrites=true&w=majority&appName=Cluster0',
        CLOUDFLARE_STREAM_TOKEN: '8iNcf_c7BnnehcRc5VfRXdyKZAkZSLnEk58h-giw',
        CLOUDFLARE_ACCOUNT_ID: '8a6783115d4ee6b7ac337c5b7abc1b63',
        CLOUDFLARE_CUSTOMER_SUBDOMAIN: 'customer-7ifm1m1zqw3oxnjj.cloudflarestream.com',
        MAX_VIDEO_SIZE: 52428800,
        MAX_VIDEO_DURATION: 60,
        DOMAIN: 'lavacalola.club'
      }
    }]
  };