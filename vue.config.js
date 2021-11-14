const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
module.exports = {
    lintOnSave: false,
    // publicPath :'./',
    productionSourceMap: false, // 线上去除sourceMap
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "~@/assets/css/global.scss";`
            }
        }
    },
    devServer: {
        overlay: {
            warning: false,
            errors: false
        },
        proxy: {
            '/api': {
                target: ' http://47.242.206.110:8883',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    chainWebpack:  config => {
        config
        .entry('index')
        .add('babel-polyfill')
    },
    configureWebpack: () => {
        if (process.env.NODE_ENV !== 'production') return { devtool: 'source-map' };
        return {
            plugins: [
                new PrerenderSPAPlugin({
                    // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
                    staticDir: path.join(__dirname, 'dist'),
                    routes: ['/'],
                    // 这个很重要，如果没有配置这段，也不会进行预编译
                    renderer: new Renderer({
                        inject: {
                            foo: 'bar'
                        },
                        // headless: false,
                        renderAfterDocumentEvent: 'render-event'
                    })
                }),
                // new BundleAnalyzerPlugin()
            ],
        };
    }
}