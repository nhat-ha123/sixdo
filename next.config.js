/** @type {import('next').NextConfig} */
const nextConfig = {
    // distDir: 'build',
    // output: 'export',
    experimental: {
    serverActions: true,
    },
    trailingSlash: true,
    swcMinify: true
    //reactStrictMode: true,
}

module.exports = nextConfig
