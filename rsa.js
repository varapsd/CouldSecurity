const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});
 
const text = 'asdfjlakfjlakjf wefoaijfq ij 9qwh rt9wefwefe9849458498r9w8eyr098yr9e lklkj';
/*
const encrypted = key.encrypt(text, 'base64');
console.log('encrypted: ', encrypted);
const decrypted = key.decrypt(encrypted, 'utf8');
console.log('decrypted: ', decrypted);

var publickey = key.exportKey('public');
console.log(publickey);

var privatekey = key.exportKey('private');
console.log(privatekey);

var arrFile = privatekey.split('\n');

var key1 = ''
for(var i=0;i<arrFile.length;i++){
  console.log(arrFile[i], ' :len: ', arrFile[i].length)
  if(i!=0 && i!= arrFile.length-1)
    key1 += arrFile[i];
}

console.log(key1)
var mainkey = ''
for(var i=0;i<key1.length;i=i+64){
  j=64;
  if(i+j>=key1.length) j = key1.length;
  var ss = key1.substring(i,i+j);
  mainkey += ss+'\n'
}
console.log(mainkey)
*/
var publickey = key.exportKey('public');
var privatekey = key.exportKey('private');

var pubkey = new NodeRSA(publickey);
var encoded = pubkey.encrypt(text,'base64');
console.log(encoded);

var privateArr = privatekey.split('\n');
var privateStr = ''
for(var i=0;i<privateArr.length;i++){
  if(i!=0 && i!=privateArr.length-1){
    privateStr += privateArr[i];
  }
}
var privateStr1 = '-----BEGIN RSA PRIVATE KEY-----\n';
  for(var i=0;i<privateStr.length;i=i+64){
    privateStr1 += privateStr.substring(i,i+64)+'\n';
  }
  privateStr1 += '-----END RSA PRIVATE KEY-----\n'

var pvkey = new NodeRSA(privateStr1);
var decoded = pvkey.decrypt(encoded,'utf8')
console.log(decoded)