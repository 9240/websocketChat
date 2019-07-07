var ws = require("nodejs-websocket");
console.log("开始建立连接");
var count = 0;//后期显示用户人数
var server = ws.createServer(function(connect){
	console.log("有用户连接")
	count++;
    connect.on("text",(context)=>{
		//0:正常会话  1:enter  2:leavel
		var contextJson = JSON.parse(context)
		console.log("收到的消息是："+contextJson.msg)
		if(contextJson.type == 1){
			connect.userName = contextJson.msg;
			roadcast(server,context)
		}else if(contextJson.type == 0){
			var obj = {
				msg:contextJson.msg,
				userName:connect.userName,
				type:contextJson.type
			}
			roadcast(server,JSON.stringify(obj))
		}
		
	})
	connect.on("close",()=>{
		count--;
		console.log("连接断开了")
	})
	connect.on("error",()=>{
		console.log("异常")
	})
}).listen(4000);

function roadcast(server,context){
   server.connections.forEach(item => {
	   item.send(context)
   });
}
