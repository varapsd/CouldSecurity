var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new mongoose.Schema({
	fileId : {
		type: Number
	},
	fileData: {
		type: String
	},
	fileName: String,
	fileType: String,
	encType: String
});

module.exports = {
	File: mongoose.model('file',fileSchema,'files'),
	fileSchema:fileSchema
}