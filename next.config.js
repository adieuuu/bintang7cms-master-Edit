require('dotenv').config()
const path = require('path')
const Dotenv = require('dotenv-webpack')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const withSass = require('@zeit/next-sass')
const withOffline = require('next-offline')
const isProd = process.env.NODE_ENV === 'production'

module.exports = withSass(withOffline({
    vendor: ['xlsx', 'file-saver', "wysihtml5"],
    node: {fs: 'empty'},
    externals: [
        {'./cptable': 'var cptable'},
        {'./jszip': 'jszip'}
    ],
    workboxOpts: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['.next/static/*', '.next/static/**/*'],
        modifyURLPrefix: {
          '.next': '/_next',
        },
        runtimeCaching: [
            {
                urlPattern: /[.](jpe?g|png|svg|gif|eot|ttf|woff|woff2)/,
                handler: 'CacheFirst'
            }, {
                urlPattern: /^https.*(js|css)/,
                handler: 'CacheFirst'
            }, {
                urlPattern: /api/,
                handler: 'NetworkFirst',
                options: {
                    cacheableResponse: {
                        statuses: [0, 200],
                        headers: { 'x-test': 'true'}
                    }
                }
            }
        ]
    },
    assetPrefix: isProd ? process.env.PROD_URL : 'http://127.0.0.1:3000',
    webpack: (config, { dev, webpack }) => {           
        config.plugins = config.plugins || []
        config.plugins = [
            ...config.plugins,
            // Read the .env file
            new Dotenv({
                path: path.join(__dirname, '.env'),
                systemvars: true
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jquery: "jQuery",
                "window.jQuery": "jquery"
            }),
            // new webpack.optimize.CommonsChunkPlugin(chunkName = "vendor", filename = "vendor.bundle.js"),
            new WebpackPwaManifest({
                filename: 'static/manifest.json',
                name: 'NRPPS',
                short_name: 'NextJS With REDUX And PWA',
                description: 'NextJS Project Starter',
                orientation: 'portrait',
                start_url: '/index',
                display: 'standalone',
                theme_color: '#000000',
                background_color: '#000000',
                inject: true,
                fingerprints: false,
                publicPath: '..',
                includeDirectory: true,
                icons: [
                  {
                    src: path.resolve('static/icon.png'),
                    sizes: [36, 48, 57, 60, 72, 76, 96, 114, 120, 144, 152, 180, 192],
                    type: 'image\/png',
                    destination: path.join('static/icons', '')
                  }
                ]
            })
        ]

        return config
    }
}))
