const Handlebars = require('handlebars');
const path = require('path');

const webpack = require('webpack');

module.exports = (env, argv) => {
    return {
        entry: './src/main.ts',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.html$/i,
                    loader: 'html-loader',
                    options: {
                        preprocessor: (content, loaderContext) => {
                            try {
                                return Handlebars.compile(content)({
                                    __BUILD_VERSION: `${
                                        process.env.__BUILD_VERSION ||
                                        'unversioned'
                                    }-${
                                        argv.mode === 'production'
                                            ? 'prod'
                                            : 'devel'
                                    } (${new Date().toUTCString()})`
                                });
                            } catch (error) {
                                loaderContext.emitError(error);

                                return content;
                            }
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        output: {
            filename: 'server.js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [
            new webpack.DefinePlugin({
                __BUILD_VERSION: JSON.stringify(
                    `${process.env.__BUILD_VERSION || 'unversioned'}-${
                        argv.mode === 'production' ? 'prod' : 'devel'
                    }`
                )
            })
        ],
        target: 'node'
    };
};
