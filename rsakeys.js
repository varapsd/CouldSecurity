var RSAkeys = require('rsa-key');
const { generateKeyPairSync } = require('crypto');
  
// Including publicKey and  privateKey from 
// generateKeyPairSync() method with its 
// parameters
const { publicKey, privateKey } = generateKeyPairSync('ec', {
  namedCurve: 'secp256k1',    // Options
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});
  
// Prints asymmetric key pair
console.log("The public key is: ", publicKey);
console.log();
console.log("The private key is: ", privateKey);

var buffer = '1f00c58adf715a6e29d27b6a8a2d3f976b74803738a2cedeb17a45679b2180f0e5d5d812700dc6f5f30cce6a1dcbb2c7af270570459f434940ab1c9ab4f115469d'
var BufferFile = new Buffer( buffer.toString('hex'), 'hex' );

var key = new RSAkeys(publicKey);

var output = key.exportKey('der');
console.log(output)