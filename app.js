// 加载模块
var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var fs = require("fs");

// 创建服务器对象
var app = express();


app.use(express.static("www"));

// 把前端发送过来的数据转化为字符串
app.use(bodyParser.text());

// 设置上传的存储信息   storage存储
var storage = multer.diskStorage({
	// 设置图片/文件的存放位置'/
	// destination: 'www/uploads'
	destination: function(req,file,cb){
		cb(null,'www/uploads');

	},
	// 设置图片/文件的存放名字
	// filename: 'a.png'
	filename: function(req,file,cb){
		var str ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		console.log(str.length);
		var name = new Date().getTime() + str.charAt(Math.floor(Math.random()*52));
		cb(null,name + ".jpg");
	}
});
// 上传对象upload  
var upload = multer({storage: storage});  //multer({storage});可以缩写

// post请求处理多张图片上传(表单上传formdata)
// upload.array('photo',6)  上传图片的键,和上传图片的个数
app.post("/photo",upload.array('photo',6),function(req,res){
	res.status(200).json({
		code: 1,
		msg: "上传图片成功"
	});
});

// post 请求处理一张或多张图片上传 (非表单上传)
app.post("/upload",function(req,res){
	// 设置存储的名字
	var name = new Date().getTime() + Math.random();
	// 创建缓存区buffer(事宜base64的编码格式上传数据)
	// param1: 以base64编码的二进制数据流的字符串    param2:编码格式
	var buffer = new Buffer(req.body,"base64");
	// 写入文件
	fs.writeFile("www/uploads/" + name + ".jpg",buffer,function(err){
		if(!err) {
			res.status(200).json({ 
		    code: 1,
		    msg: "上传图片成功"
	        });
		}else{
			res.status(200).json({ 
		    code: 0,
		    msg: "上传图片失败"
	        });
		}
	});
});
app.listen(3000,function(){
	console.log("服务器正在运行 ……");
});
