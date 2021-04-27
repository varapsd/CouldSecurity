var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var keySchema = new mongoose.Schema({
	keyId : Number,
	keyData : String
});

module.exports = {
	Key: mongoose.model('key',keySchema,'keys'),
	keySchema:keySchema
}