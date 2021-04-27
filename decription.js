const mongoose = require('mongoose');
var CryptoJS = require('crypto-js');
var fs = require('fs');

const Blowfish = require('egoroof-blowfish');
var File = require('./Models/files').File;

mongoose.connect('mongodb+srv://vara:vara@mycluster.zucif.gcp.mongodb.net/cloudSecurity?retryWrites=true&w=majority')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function (callback) {
    console.log('Successfully connected to MongoDB.');
});



File.findOne({fileId:"4"},(err,data)=>{
	encryptedData = data.fileData;
	key = 'ul9yds7v';
	var bytes = CryptoJS.AES.decrypt(encryptedData,key);
	var aesDecrpt = bytes.toString(CryptoJS.enc.Utf8);
	var bfr = new Buffer(aesDecrpt.toString('hex'),'hex');
	console.log(bfr)
	var arr = [];
	arr.push(...bfr)
	arr = new Uint8Array(arr);
	console.log(arr);
	const bf = new Blowfish('super key', Blowfish.MODE.ECB, Blowfish.PADDING.NULL); // only key isn't optional
	bf.setIv(key);
	const decoded = bf.decode(arr,Blowfish.TYPE.STRING ); // type is optional
	var decodedBuffer =  new Buffer(decoded.toString('hex'),'hex');
	//console.log(decoded);
	fs.writeFile('./finalimg.jpg',decodedBuffer,(err)=>{
		if(err) throw err;
		console.log('success')
	})
})
