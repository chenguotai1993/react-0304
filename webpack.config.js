const path=require('path')
const webpack=require('webpack');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const ExtractTextPlugin=require('extract-text-webpack-plugin');
let WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV); 

module.exports={
    entry:'./src/page/app.jsx', 
    output:{
        path:path.resolve(__dirname,'dist'),
        publicPath: WEBPACK_ENV === 'dev' 
            ? '/dist/' : '//s.jianliwu.com/admin-v2-fe/dist/',
        filename:'js/app.js'
    },
    resolve:{
        alias:{
            page:path.resolve(__dirname,'src/page'),
            component:path.resolve(__dirname,'src/component'),
            util        : path.resolve(__dirname, 'src/util'),
            service     : path.resolve(__dirname, 'src/service')
        }
    },
    module:{
        rules:[
            //react语法处理
            {
                test:/\.jsx$/,
                exclude:/(node_modules|bower_components)/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['env','react']
                    }
                }
            },
            //css语法处理
            {
                test:/\.css$/,
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:['css-loader']
                })
            },
            //scss语法处理
            {
                test:/\.scss$/,
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:['css-loader','sass-loader']
                })
            },
            // 图片的配置
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            },// 字体图标的配置
            {
                test: /\.(eot|svg|woff|woff2|otf|ttf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            },
        ]
    },
    plugins:[
        //处理html文件
        new HtmlWebpackPlugin({
            template:'./src/page/index.html'
        }),
        //独立css文件
        new ExtractTextPlugin('css/[name].css'),
        //提出公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name:'common',
            filename:'js/base.js'
        })
    ],
    devServer:{
       port:8085,
       historyApiFallback:{
           index:'/dist/index.html'
       },
       proxy:{
           '/manage':{
               target:"http://admintest.happymmall.com",
               changeOrigin:true
           },
           '/user/logout.do':{
                target: 'http://admintest.happymmall.com',
                changeOrigin : true
           }
       }
    }
}