var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	uName : String,
	uPass : String,
	filesList : [ Number ]
});

module.exports = {
	User: mongoose.model('user',userSchema,'users'),
	userSchema:userSchema
}