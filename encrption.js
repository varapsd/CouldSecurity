var CryptoJS = require('crypto-js');
var fs = require('fs');
const Blowfish = require('egoroof-blowfish');

fs.readFile('./uploads/image.jpg',(err,data)=>{
	fileBuffer = data.toString('hex');
	console.log(data)
	var key = 'abcdefgh';
	var bf = new Blowfish('super key', Blowfish.MODE.ECB, Blowfish.PADDING.NULL); // only key isn't optional
	bf.setIv(key);
	var encoded = bf.encode(fileBuffer);
	console.log(encoded)
	var encodedStr = '';
	for(var i=0;i<encoded.length;i++){
		encodedStr += encoded[i].toString(16).padStart(2,'0');
	}
	var buffer = new Buffer(encodedStr.toString('hex'),'hex');
	//console.log(buffer);
	var arr = [];
	arr.push(...buffer);
	arr = new Uint8Array(arr);
	console.log(arr);
	const decoded = bf.decode(arr,Blowfish.TYPE.STRING ); // type is optional
	console.log(decoded)
})


/*

var encodedStr = '';
for(var i=0;i<encoded.length;i++){
	encodedStr += encoded[i].toString(16);
}
//aes algorithm
var chiphertext = CryptoJS.AES.encrypt(encodedStr,key).toString();
		
		*/