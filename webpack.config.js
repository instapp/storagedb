const webpack = require('webpack')

module.exports = {
	entry: './src',

	output: {
		path: __dirname + '/lib',
		filename: 'storagedb.js'
	},

	module: {
		rules: [{
			test: /\.js?$/,
			use: {
				loader: 'babel-loader'
			}
		}]
	},

	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			comments: false,
			mangle: {
				except: ['StorageDB', 'Collection']
			}
		}),
		new webpack.BannerPlugin('Created by Acathur.\n(c) 2017 Instapp.\n\nhttps://github.com/instapp/storagedb\nReleased under the MIT License.')
	],

	devtool: false
}
