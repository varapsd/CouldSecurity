var CryptoJS = require('crypto-js');
const NodeRSA = require('node-rsa');
var fs = require('fs');

fs.readFile('./uploads/aesrsaPrivate.txt',(err,data)=>{
	data = data.toString();
	console.log(data);
	var privateStr = '-----BEGIN RSA PRIVATE KEY-----\n';
	for(var i=0;i<data.length;i=i+64){
		privateStr += data.substring(i,i+64)+'\n';
	}
	privateStr += '-----END RSA PRIVATE KEY-----\n'
	console.log(privateStr);
	var privateKey = new NodeRSA(privateStr);
	fs.readFile('./uploads/aesrsaenc.txt',(err,data1)=>{
		data1 = data1.toString('hex');
		var dataBuffer = new Buffer(data1.toString('hex'),'hex');
		console.log(dataBuffer)
		var decrypted = privateKey.decrypt(dataBuffer,'utf8');
		var bytes = CryptoJS.AES.decrypt(decrypted,data);
		var originalText = bytes.toString(CryptoJS.enc.Utf8);
		//console.log(originalText)
		var buffer = new Buffer(originalText.toString('hex','hex'));
		console.log(buffer)
		fs.writeFile('./uploads/aesrsacheck.jpg',buffer,(err)=>{
			if(err) throw err;
			console.log('done')
		})

	})
})
