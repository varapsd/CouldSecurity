var CryptoJS = require('crypto-js');
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});


var publickey = key.exportKey('public');
var privatekey = key.exportKey('private');
var privateArr = privatekey.split('\n');
var privateStr = ''
for(var i=0;i<privateArr.length;i++){
	if(i!=0 && i!=privateArr.length-1){
		privateStr += privateArr[i];
	}
}
console.log(privatekey);
//console.log(privateStr)
var fs = require('fs');

fs.readFile('./uploads/image.jpg','hex',(err,data)=>{
	//console.log(data);
	var chiphertext = CryptoJS.AES.encrypt(data,privateStr).toString();
	//console.log(chiphertext);
	var encrpted = key.encrypt(chiphertext);
	console.log(encrpted)
	var encrpted1 = encrpted.toString('hex')
	//console.log(encrpted);
	var pkey = key.decrypt(encrpted);
	console.log('\n\n')
	console.log(pkey);
	fs.writeFile('./uploads/aesrsaenc.txt',encrpted1,(err)=>{
		if(err) throw err;
		console.log('done')
	});
	fs.writeFile('./uploads/aesrsaPrivate.txt',privateStr,(err)=>{
		if(err) throw err;
		console.log('done2')
	})
	var privateStr1 = '-----BEGIN RSA PRIVATE KEY-----\n';
	for(var i=0;i<privateStr.length;i=i+64){
		privateStr1 += privateStr.substring(i,i+64)+'\n';
	}
	privateStr1 += '-----END RSA PRIVATE KEY-----';
	if(privateStr1 == publickey){
		console.log('turee')
	}
	else{
		console.log(privatekey);
		console.log(privateStr1)
	}
	for(var i = 0;i<privateStr1.length;i++){
		if(privateStr1[i]!=privatekey[i]){
			console.log(privatekey[i],':',privateStr1[i],':',i)
		}
		else {
			console.log('ok')
		}
	}
	/*
	var pky = new NodeRSA(privateStr1);
	var encdata = pky.decrypt(encrpted);
	console.log(encdata);
	*/
})

