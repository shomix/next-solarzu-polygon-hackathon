/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  future: {
    webpack5: true,
},
images: {
    loader: 'akamai3',
    path: '',
  domains: ['res.cloudinary.com','openseauserdata.com','lh3.googleusercontent.com']
},
trailingSlash: false,
webpack: (config, {}) => {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    return config
 },
}


module.exports = nextConfig
