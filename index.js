const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const TYPE_ENTER = 0;
const TYPE_LEAVE = 1;
const TYPE_MSG = 2;
var usersList = []
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  // 登录
  socket.on('login',data=>{
    var res = usersList.some(item=>{
      return item.username === data.username
    })
    if(!res){
      usersList.push(data)
      socket.username = data.username
      io.emit('loginSuccess',{
        data,
        usersList
      })
    }else{
      socket.emit('loginFail',{
        msg:'用户名被占用'
      })
    }
  })

  // 发消息
  socket.on('getMsg',data=>{
    io.emit('sendMsg',data)
  })

  // 断开
  socket.on('disconnect',()=>{
    console.log(socket.username)
    usersList.forEach((item,index) => {
      if(item.username === socket.username){
        usersList.splice(index,1)
      }
    });
    io.emit('userLeave',{
      usersList,
      data:{
        username:socket.username,
        type:TYPE_LEAVE,
        time:Number(new Date().toLocaleTimeString().split(':')[0])>11?'下午'+new Date().toLocaleTimeString():'上午'+new Date().toLocaleTimeString()
      }
    });
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
