const Blowfish = require('egoroof-blowfish');
const fs = require('fs');
const bf = new Blowfish('super key', Blowfish.MODE.ECB, Blowfish.PADDING.NULL); // only key isn't optional
bf.setIv('asdfghjk'); // optional for ECB mode; bytes length should be equal 8
fs.readFile("./uploads/image.jpg",'hex',(err,data)=>{
	//data = data.toString();
	//console.log(data)
	const encoded = bf.encode(data);
	console.log(encoded)
	var encodedStr = '';
	for(var i=0;i<encoded.length;i++){
		encodedStr += encoded[i].toString(16);
	}

	var bfr = new Buffer(encodedStr.toString('hex'),'hex');
	var arr = [];
	arr.push(...bfr)
	console.log(arr)
	const decoded = bf.decode(encoded,Blowfish.TYPE.STRING ); // type is optional
	//console.log(encoded.toString());
	//console.log(decoded);
	var buffer = new Buffer(decoded.toString('hex'),'hex');
	//console.log(buffer)
});

