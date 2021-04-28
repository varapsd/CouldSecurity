const express = require('express');
var session = require('express-session');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
var CryptoJS = require('crypto-js');
const NodeRSA = require('node-rsa');
var fs = require('fs');
const Blowfish = require('egoroof-blowfish');
const app = express();

var User = require('./Models/users').User;

var File = require('./Models/files').File;
var Key = require('./Models/keys').Key;
var url = //mongodb url here 
mongoose.connect(url)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function (callback) {
    console.log('Successfully connected to MongoDB.');
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    //store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 }),
    saveUninitialized: true,
    resave: false
}));
app.use(express.static(__dirname + '/public'));

app.set("Views",path.join(__dirname,"Views"))
app.set("View engine","ejs")



var storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, "./uploads")
	},
	filename: function(req,file,cb){
		cb(null,file.filename+"-"+Date.now()+".jpg")
	}
})

const maxSize = 1 * 1000 * 1000;
/*
var upload = multer({
	storage: storage,
	limits: { fileSize: maxSize },
	fileFilter: function(req,file,cb){
		console.log(file);
		var filetypes = /jped|jpg|png|/;
		var mimetype = filetypes.test(file.mimetype);
		var extname = filetypes.test(path.extname(
			file.originalname).toLowerCase());
		if(mimetype && extname){
			return cb(null,true);
		}

		cb("Error: File upload only supports the following file types - "+filetypes);

	}
}).single("mypic");
*/
var upload = multer().single("mypic");

app.get("/",(req,res)=>{
	res.render("./index.ejs");
})
app.post('/login',(req,res)=>{
	var uname = req.body.u;
	var upass = req.body.p;
	User.findOne({uName:uname,uPass:upass},(err,data)=>{
		if(err) res.send('Failed');
		else{
			if(data){
				req.session.user = data.uName;
				res.send('Success')
				
			}
			else{
				res.send('No User');
			}
		}
	})
	

})

app.get('/register',(req,res)=>{
	res.render('./register.ejs');

});
app.post('/register',(req,res)=>{
	var uname = req.body.u;
	var upass = req.body.p;
	var newUser = new User({
		uName : uname,
		uPass : upass,
		filesList : []
	});
	newUser.save(err=>{
		if(err) res.send('Failed');
		else{
			res.send('Success')
		}
	})

})
app.get("/user",(req,res)=>{
	User.findOne({uName:req.session.user},(err,validUser)=>{
		File.find({fileId: {$in : validUser.filesList}},{fileData:0},(err,validFiles)=>{
			res.render('./home.ejs',{user : req.session.user,files : validFiles});
		})
	})
	
})
/*
app.post("/uploadProfilePicture",(req,res, next)=>{
	upload(req,res,(err)=>{
		fileBuffer = req.file.buffer.toString();
		var chiphertext = CryptoJS.AES.encrypt(fileBuffer,"secret key 123").toString();
		
		var newFile = new File({
			fileId : "3",
			fileData : chiphertext,
			fileName : req.file.originalname.split('.')[0],
			fileType : req.file.originalname.split('.')[1],
			encType : 'aes'
		});
		newFile.save(err=>{
			if(err) throw err;
			console.log('success added')
		})

		console.log(chiphertext)
		if(err){
			res.send(err)
		}
		else {
			res.send("Success, Image uploaded!")
		}
	})
})
*/
app.post("/uploadProfilePicture",(req,res,next)=>{
	
		if(true){

			upload(req,res,async (err)=>{
				fileBuffer = req.file.buffer.toString('hex');
				var result;
				var key = Math.random().toString(36).substring(2,10);
				console.log(key)
				var bf = new Blowfish('super key', Blowfish.MODE.ECB, Blowfish.PADDING.NULL); // only key isn't optional
				bf.setIv(key);
				var encoded = bf.encode(fileBuffer);
				var encodedStr = '';
				for(var i=0;i<encoded.length;i++){
					encodedStr += encoded[i].toString(16).padStart(2,'0');
				}
				//aes algorithm
				var chiphertext = CryptoJS.AES.encrypt(encodedStr,key).toString();
				var keyId = await File.find({}).countDocuments();
				var newFile = new File({
					fileId : keyId+1,
					fileData : chiphertext,
					fileName : req.file.originalname.split('.')[0],
					fileType : req.file.originalname.split('.')[1],
					encType : 'aes-blowfish'
				});
			
				newFile.save(err=>{
					if(err) throw err;
					User.findOne({uName:req.session.user},(err,validUser)=>{
						if(err) throw err;
						validUser.filesList.push(keyId+1);
						validUser.save(err=>{
							if(err) throw err;
							console.log('success added');
						})
					})
				})
				var newKey = new Key({
					keyId : keyId+1,
					keyData : key
				});
				newKey.save(err=>{
					if(err) throw err;
					console.log('key added')
				})

			})
		}
		else{
			//aes-rsa aglrithm
			upload(req,res,async (err)=>{
				//console.log(req.file.buffer);
				fileBuffer = req.file.buffer.toString('hex');
				var key = new NodeRSA({b:512});
				var privatekey = key.exportKey('private');
				var privateArr = privatekey.split('\n');
				var privateStr = ''
				for(var i=0;i<privateArr.length;i++){
				  if(i!=0 && i!=privateArr.length-1){
				    privateStr += privateArr[i];
				  }
				}
				//console.log(fileBuffer)
				console.log('\n\n')
				var keyId = await File.find({}).countDocuments();
				var encryptData = CryptoJS.AES.encrypt(fileBuffer,privateStr).toString();
				var chiphertext = key.encrypt(encryptData,'base64');
				var newFile = new File({
					fileId : keyId+1,
					fileData : chiphertext,
					fileName : req.file.originalname.split('.')[0],
					fileType : req.file.originalname.split('.')[1],
					encType : 'aes-rsa'
				});
			
				newFile.save(err=>{
					if(err) throw err;
					User.findOne({user:req.session.user},(err,userData)=>{
						userData.filesList.push(keyId+1);
						userData.save(err=>{
							if(err) throw err;
							console.log('success added')
						})
					})
				}) 
				var newKey = new Key({
					keyId : keyId+1,
					keyData : privateStr
				});
				newKey.save(err=>{
					if(err) throw err;
					console.log('key saved');
				})

				//console.log(chiphertext);
				/*
				var privateStr1 = '-----BEGIN RSA PRIVATE KEY-----\n';
				  for(var i=0;i<privateStr.length;i=i+64){
				    privateStr1 += privateStr.substring(i,i+64)+'\n';
				  }
				  privateStr1 += '-----END RSA PRIVATE KEY-----\n'

				var pvkey = new NodeRSA(privateStr1);
				var decoded = pvkey.decrypt(chiphertext,'utf8');
				var bytes = CryptoJS.AES.decrypt(decoded,privateStr);
				var aesDecrpt = bytes.toString(CryptoJS.enc.Utf8);
				var buffer = new Buffer (aesDecrpt.toString('hex'),'hex');
				console.log(buffer)
				if(req.file.buffer == buffer){
					console.log('yes')
				}
				else{
					'n00'
				}
				fs.writeFile('./uploads/checkaesImage.png',buffer,(err)=>{
					if(err) throw err;
					console.log('saved')
				})
				*/
			})
		}
})
app.get('/download/:fileId',(req,res)=>{
	File.findOne({fileId:req.params.fileId},(err,validFile)=>{
		if(validFile.fileType=='aes-blowfish'){
			encryptedData = validFile.fileData;
			Key.findOne({keyId:req.params.fileId},(err,validKey)=>{
				var bytes = CryptoJS.AES.decrypt(encryptedData,validKey.keyData);
				var aesDecrpt = bytes.toString(CryptoJS.enc.Utf8);
				var bfr = new Buffer(aesDecrpt.toString('hex'),'hex');
				var arr = [];
				arr.push(...bfr)
				arr = new Uint8Array(arr);
				//console.log(arr);
				const bf = new Blowfish('super key', Blowfish.MODE.ECB, Blowfish.PADDING.NULL); // only key isn't optional
				bf.setIv(validKey.keyData);
				const decoded = bf.decode(arr,Blowfish.TYPE.STRING ); // type is optional
				var decodedBuffer =  new Buffer(decoded.toString('hex'),'hex');
				fs.writeFile('./downloads/'+validFile.fileName+'.'+validFile.fileType,decodedBuffer,(err)=>{
					if(err) throw err;
					console.log('success')
					res.redirect('/user')
				})

			})
		}
		else{
					Key.findOne({keyId:req.params.fileId},(err,decKey)=>{
						if(err) res.send('error occured');
						else{
							var privateStr1 = '-----BEGIN RSA PRIVATE KEY-----\n';
							for(var i=0;i<decKey.keyData.length;i=i+64){
								privateStr1 += decKey.keyData.substring(i,i+64)+'\n';
							}
							privateStr1 += '-----END RSA PRIVATE KEY-----'
							var pvkey = new NodeRSA(privateStr1);
							var decoded = pvkey.decrypt(validFile.fileData,'utf8');
							var bytes = CryptoJS.AES.decrypt(decoded,decKey.keyData);
							var aesDecrpt = bytes.toString(CryptoJS.enc.Utf8);
							var buffer = new Buffer (aesDecrpt.toString('hex'),'hex');
							fs.writeFile('./downloads/'+validFile.fileName+'.'+validFile.fileType,buffer,(err)=>{
								if(err) throw err;
								console.log('saved')
								res.redirect('/user');
							})
						}
					})
		}
	})
});
	/*
	if(1){
		//aes-blowfish
		File.findOne({fileId:req.params.fileId},(err,validFile)=>{
			encryptedData = validFile.fileData;
			Key.findOne({keyId:req.params.fileId},(err,validKey)=>{
				var bytes = CryptoJS.AES.decrypt(encryptedData,validKey.keyData);
				var aesDecrpt = bytes.toString(CryptoJS.enc.Utf8);
				var bfr = new Buffer(aesDecrpt.toString('hex'),'hex');
				var arr = [];
				arr.push(...bfr)
				arr = new Uint8Array(arr);
				//console.log(arr);
				const bf = new Blowfish('super key', Blowfish.MODE.ECB, Blowfish.PADDING.NULL); // only key isn't optional
				bf.setIv(validKey.keyData);
				const decoded = bf.decode(arr,Blowfish.TYPE.STRING ); // type is optional
				var decodedBuffer =  new Buffer(decoded.toString('hex'),'hex');
				fs.writeFile('./uploads/'+validFile.fileName+'.'+validFile.fileType,decodedBuffer,(err)=>{
					if(err) throw err;
					console.log('success')
				})

			})
			//console.log(bfr)
			
			//console.log(decoded);
			
		})
	}
	else{
			File.findOne({fileId:req.params.fileId},(err,encFile)=>{
				if(err) res.send('error occured');
				else{
					Key.findOne({keyId:req.params.fileId},(err,decKey)=>{
						if(err) res.send('error occured');
						else{
							var privateStr1 = '-----BEGIN RSA PRIVATE KEY-----\n';
							for(var i=0;i<decKey.keyData.length;i=i+64){
								privateStr1 += decKey.keyData.substring(i,i+64)+'\n';
							}
							privateStr1 += '-----END RSA PRIVATE KEY-----'
							var pvkey = new NodeRSA(privateStr1);
							var decoded = pvkey.decrypt(encFile.fileData,'utf8');
							var bytes = CryptoJS.AES.decrypt(decoded,decKey.keyData);
							var aesDecrpt = bytes.toString(CryptoJS.enc.Utf8);
							var buffer = new Buffer (aesDecrpt.toString('hex'),'hex');
							fs.writeFile('./uploads/'+encFile.fileName+'.'+encFile.fileType,buffer,(err)=>{
								if(err) throw err;
								console.log('saved')
							})
						}
					})
				}
			})
			*/
			/*
			var privateStr1 = '-----BEGIN RSA PRIVATE KEY-----\n';
			  for(var i=0;i<privateStr.length;i=i+64){
			    privateStr1 += privateStr.substring(i,i+64)+'\n';
			  }
			  privateStr1 += '-----END RSA PRIVATE KEY-----'

			var pvkey = new NodeRSA(privateStr1);
			var decoded = pvkey.decrypt(chiphertext,'utf8');
			var bytes = CryptoJS.AES.decrypt(decoded,privateStr);
			var aesDecrpt = bytes.toString(CryptoJS.enc.Utf8);
			var buffer = new Buffer (aesDecrpt.toString('hex'),'hex');
			console.log(buffer)
			if(req.file.buffer == buffer){
				console.log('yes')
			}
			else{
				'n00'
			}
			fs.writeFile('./uploads/checkaesImage.png',buffer,(err)=>{
				if(err) throw err;
				console.log('saved')
			})
			*/
	


app.listen(8080,(err)=>{
	if(err) throw err;
	console.log("Server created Successfully on PORT 8080");
})
