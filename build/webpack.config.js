const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const gitManager = require('./git_manage.js').gitManager;
// const fs = require('fs');
const isProd = process.env.npm_lifecycle_event.indexOf('build') > -1;
const Tag = isProd ? gitManager.getCurrentCommitTagSync() : '';

function resolve (dir) {
    return path.join(__dirname, '..', dir);
}


const cssLoaderConfig = {
    loader: 'css-loader',
    options: {
        modules: false,
        // sourceMap: !isProd,
        sourceMap: false,
    },
};

const cssConfig = isProd ? [
    MiniCssExtractPlugin.loader,
    cssLoaderConfig,
    {
        loader: 'postcss-loader',
        options: {
            // sourceMap: !isProd,
            sourceMap: false,
        },
    },
    {
        loader: 'less-loader', // compiles Less to CSS
    },
] : [
    'vue-style-loader',
    'style-loader',
    cssLoaderConfig,
    {
        loader: 'less-loader', // compiles Less to CSS
    },
];

const config = {
    // entry: entries.entry,
    entry: resolve('src/page/index/app.js'),
    // 出口文件
    output: {
        path: resolve(`dist${Tag ? `/${Tag}` : ''}`),
        // 文件名，将打包好的导出为bundle.js
        filename: isProd ? 'js/[name].js' : '[name].js',
        publicPath: isProd ? `/${Tag}/` : '/',
    },
    // 开发模式
    mode: 'development',
    devtool: isProd ? undefined : 'inline-source-map', // 使用 sourcemap，编辑后会很慢
    // devtool: 'eval', // 禁用 sourcemap，二次打包很快
    // webpack-dev-server
    devServer: {
        // historyApiFallback: true,
        compress: false, // 开启Gzip压缩
        contentBase: resolve('public'), // 将 public 目录下的文件，作为可访问文件。
        hot: true,
        port: '8080',
        open: true, // 自动打开浏览器
        // overlay: { // 当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
        //     errors: true
        // },
        historyApiFallback: true,
        progress: false,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:15001/',
                // target: 'http://10.0.23.170:15001/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader',
                options: {
                    css: [ 'css-loader' ],
                    postcss: isProd ? [
                        require('autoprefixer'),
                    ] : [],
                    less: [ 'less-loader' ],
                },
            },
            {
                test: /\.css$/,
                use: cssConfig,
            },
            {
                test: /\.less$/,
                use: cssConfig,
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: !isProd,
                            presets: [
                                '@babel/preset-env',
                            ],
                            plugins: [
                                '@babel/plugin-transform-runtime',
                                '@babel/plugin-proposal-class-properties',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|woff)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            // 这个是对publicPath使用的
                            name (resourcePath, resourceQuery) {
                                // if (!isProd) {
                                //     return '[name].[ext]';
                                // }
                                return '[name].[ext]';
                            },
                            // name: '[name].[contenthash:10].[ext]',   // 文件名
                            publicPath: Tag
                                ? `/${Tag}/static/`
                                : '/static/',
                            // publicPath: `../static/`,

                            // 输出目录，表现效果相当于 outputPath + name 这样，可以直接写在name里如
                            // myImage/[name].[ext] 效果一样
                            outputPath: function (fileName) {
                                return '/static/' + fileName; // 后面要拼上这个
                                // fileName 才行
                            },
                            useRelativePath: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            // 这个是对publicPath使用的
                            name (resourcePath, resourceQuery) {
                                // if (!isProd) {
                                //     return '[name].[ext]';
                                // }
                                return '[name].[ext]';
                            },
                            // name: '[name].[contenthash:10].[ext]',   // 文件名
                            publicPath: Tag ? `/${Tag}/static/` : '/static/',
                            // publicPath: `../static/`,

                            // 输出目录，表现效果相当于 outputPath + name 这样，可以直接写在name里如
                            // myImage/[name].[ext] 效果一样
                            outputPath: function (fileName) {
                                return 'static/' + fileName; // 后面要拼上这个
                                // fileName 才行
                            },
                            useRelativePath: true,
                        },
                    },
                ],
            },
            {
                // 解决用img标签引入图片的问题（负责引入img，从而被url-loader处理）
                test: /\.html$/,
                loader: 'html-loader',
            },
        ],
    },
    resolve: { // 配置路径别名
        extensions: [ '.js', '.vue' ], // import引入文件的时候不用加后缀
        alias: {
            '@': resolve('src'),
            'components': resolve('src/components'),
            'common': resolve('src/common'),
            'api': resolve('src/api'),
            'page': resolve('src/page'),
            'assets': resolve('src/assets'),
            'store': resolve('src/store'),
            'plugin': resolve('src/plugin'),
            // 'vue': 'vue/dist/vue.js',
            'img': resolve('src/img'),
            vue: 'vue/dist/vue.esm.js',
        },
    },
    plugins: [
        new ESLintPlugin({
            // fix: true,
            extensions: [ 'js', 'vue' ],
        }),
        new VueLoaderPlugin(), // vue加载器
        new HtmlWebpackPlugin({
            filename: resolve('dist/index.html'),
            template: resolve(
                `index_${isProd ? 'prd' : 'dev'}.html`),
            title: '西部信托',
            minify: { // 对index.html压缩
                collapseWhitespace: isProd, // 去掉index.html的空格
                removeAttributeQuotes: isProd, // 去掉引号
            },
            hash: true, // 去掉上次浏览器的缓存（使浏览器每次获取到的是最新的html）
            // chunks: [ 'index' /*'vendor'*/ ], // 实现多入口的核心，决定自己加载哪个js文件，
            xhtml: true, // 自闭标签
        })
    ],
};

if (isProd) {
    console.log('isProd', isProd);
    config.mode = 'production';
    config.plugins = [
        ...config.plugins,
        new MiniCssExtractPlugin({ // 分离css
            filename: 'css/[name].css',
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [ resolve('dist/*') ],
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"',
                'date': `"${new Date().toLocaleString()}"`,
            },
        }),
    ];
    config.optimization = { // 抽离第三方插件
        // https://webpack.docschina.org/configuration/optimization/#root
        splitChunks: {
            chunks: 'all', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            minChunks: 3, // 共享最少的chunk数，使用次数超过这个值才会被提取
            maxAsyncRequests: 5, // 最多的异步chunk数
            maxInitialRequests: 5, // 最多的同步chunks数
            cacheGroups: { // 这里开始设置缓存的 chunks
                vendor: { // key 为entry中定义的 入口名称，new webpack.ProvidePlugin中的库
                    test: /node_modules/, // 正则规则验证，如果符合就提取
                    // chunk，(指定是node_modules下的第三方包)
                    // test:
                    // /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/, //
                    // 正则规则验证，如果符合就提取 chunk (指定是node_modules下的第三方包)
                    name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
                    enforce: true,
                },
                // main: {
                //     test: /src/,
                //     name: 'main',
                //     enforce: true,
                // },
            },
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /(\.m?js(\?.*)?$|\.vue$)/i,
                parallel: true, // 可省略，默认开启并行
                terserOptions: {
                    mangle: true, // 设置丑化相关的选项，可以直接设置为true；
                    toplevel: true, // 最高级别，删除无用代码
                    ie8: true,
                    safari10: true,
                    // format: {
                    //     comments: false,
                    // },
                    output: {
                        comments: false,
                    },
                    compress: {
                        // drop_console: true, // 去除console.log
                    },
                },
                extractComments: false,
            }),
        ],
        runtimeChunk: {name: 'runtime'}, // 为每个入口提取出webpack runtime模块
    };
    // config.externals = [
    //     {
    //         'vue': 'Vue',
    //         'vue-router': 'VueRouter',
    //         'vuex': 'Vuex',
    //         'element-ui': 'ELEMENT',
    //         'echarts': 'echarts',
    //     },
    //     'element-ui/lib/theme-chalk/index.css'
    // ];
    config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'element-ui': 'ELEMENT',
        'echarts': 'echarts',
    };
} else {
    config.plugins = [
        new webpack.HotModuleReplacementPlugin(),
        ...config.plugins,
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"',
                'date': `"${new Date().toLocaleString()}"`,
            },
        }),
    ];
    config.optimization = { // 抽离第三方插件
        // https://webpack.docschina.org/configuration/optimization/#root
        minimize: false,
        splitChunks: {
            chunks: 'all', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            minChunks: 3, // 共享最少的chunk数，使用次数超过这个值才会被提取
            maxAsyncRequests: 5, // 最多的异步chunk数
            maxInitialRequests: 5, // 最多的同步chunks数
            cacheGroups: { // 这里开始设置缓存的 chunks
                vendor: { // key 为entry中定义的 入口名称，new webpack.ProvidePlugin中的库
                    test: /node_modules/, // 正则规则验证，如果符合就提取
                    // chunk，(指定是node_modules下的第三方包)
                    // test:
                    // /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/, //
                    // 正则规则验证，如果符合就提取 chunk (指定是node_modules下的第三方包)
                    name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
                    enforce: true,
                },
                main: {
                    test: /src/,
                    name: 'main',
                    enforce: true,
                },
            },
        },
        runtimeChunk: {name: 'runtime'}, // 为每个入口提取出webpack runtime模块
    };
}

module.exports = config;
