import blowfish from "@sighmir/blowfish";
 
const bf = blowfish("my_key");
const buffer = Buffer.from("blowfish");
 
bf.encipher(buffer);
console.log(buffer); // c8a2de2a895325f5
 
bf.decipher(buffer);
console.log(buffer); // 626c6f7766697368