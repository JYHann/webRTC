

/////////////////화상 채팅 화면

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

var socketList = [];

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', function(socket) {
  socketList.push(socket);


  socket.on('SEND',function(msg){
    console.log(msg);
    socketList.forEach(function(item, i){
      console.log(item.id);
      if(item != socket){
        item.emit('SEND', msg);
      }
    });
  });

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

///////////


server.listen(3003)
