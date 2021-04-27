var CryptoJS = require('crypto-js');
var fs = require('fs');
/*
var chiphertext = CryptoJS.AES.encrypt("mymessage","secret key 123").toString();
console.log(chiphertext);
*/

/*
fs.readFile('./uploads/image.jpg',(err,data)=>{
	console.log(data.toString());
	var chiphertext = CryptoJS.AES.encrypt(data.toString(),"secret key 123").toString();
	fs.writeFile('./uploads/encryptedFile.txt',chiphertext,(err)=>{
		if(err) console.log(err);
		else console.log('success');
	})
})
*/


//fs.readFile('./uploads/encryptedFile.txt',(err,data)=>{
	//data = parseInt(data,2);
//	console.log(data)
	/*
	//var data1 = '68656c6f2067757973202c2c20686f772061726520796f7520746865726520696e20746869732066696c6520697320746869730a74686973206973206d7920636865636b2066696c652e20'
	var bytes = CryptoJS.AES.decrypt(data,'secret key 123');
	var originalText = bytes.toString(CryptoJS.enc.Utf8);
	console.log(originalText);

	var BufferFile = new Buffer( originalText.toString('hex'), 'hex' );
	console.log(BufferFile)
	*/
	/*
	fs.writeFile('./uploads/checkimage.jpg',BufferFile,(err)=>{
		if(err) throw err;
		console.log('success');
	})
	*/
//})

/*
var bytes = CryptoJS.AES.decrypt(chiphertext,'secret key 123');
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText);
*/
 
// Calling generateKeyPair() method
// with its parameters
//const crypto = require('crypto');
/*
const { generateKeyPair } = require('crypto');
  
// Calling generateKeyPair() method
// with its parameters
generateKeyPair('ec', {
  namedCurve: 'secp256k1',   // Options
  publicKeyEncoding: {
    type: 'spki',
    format: 'der'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'der'
  }
},
 (err, publicKey, privateKey) => { // Callback function
       if(!err)
       {
         // Prints new asymmetric key
         // pair after encoding
         console.log(publicKey)
         console.log("Public Key is: ",
                  publicKey.toString('hex'));
         console.log();
         console.log("Private Key is: ",
                 privateKey.toString('hex'));
       }
       else
       {
         // Prints error
         console.log("Errr is: ", err);
       }
       const data = 'my secret data';

       const encryptedData = crypto.publicEncrypt(
	{
		key: publicKey.toString(),
		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: "sha256",
	},
	// We convert the data string to a buffer using `Buffer.from`
	Buffer.from(data)
)

       console.log("encrypted data: ",ecryptedData.toString("base64"));
         
  });
//console.log(key);*/
const crypto = require("crypto")

// The `generateKeyPairSync` method accepts two arguments:
// 1. The type ok keys we want, which in this case is "rsa"
// 2. An object with the properties of the key
