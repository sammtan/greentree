/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                net: false,
                tls: false,
                fs: false,
                child_process: false,
                kerberos: false,
                '@mongodb-js/zstd': false,
                '@aws-sdk/credential-providers': false,
                'gcp-metadata': false,
                snappy: false,
                socks: false,
            };
        }
        return config;
    },
};

module.exports = nextConfig;