const socket = io('/');

var chatView = document.getElementById('chatView');
var chatForm = document.getElementById('chatForm');

const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer();
const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user-connected', (userId) => {
      connectToNewUser(userId, stream);
    });
  });

socket.on('user-disconnected', (userId) => {
  if (peers[userId]) peers[userId].close();
});

myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

//////////////////채팅주고 받기
chatForm.addEventListener('submit', function() {
    var msg = $('#msg');

    if (msg.val() == '') {
        return;

    } else {
        socket.emit('SEND', msg.val());

        var msgLine = $('<div class="msgLine">');
        var msgBox = $('<div class="msgBox">');

        msgBox.append(msg.val());
        msgBox.css('display', 'inline-block');

        msgLine.css('text-align', 'right');
        msgLine.append(msgBox);

        $('#chatView').append(msgLine);

        msg.val('');
        chatView.scrollTop = chatView.scrollHeight;
    }
});

socket.on('SEND', function(msg) {
    var msgLine = $('<div class="msgLine">');
    var msgBox = $('<div class="msgBox">');

    msgBox.append(msg);
    msgBox.css('display', 'inline-block');

    msgLine.append(msgBox);
    $('#chatView').append(msgLine);

    chatView.scrollTop = chatView.scrollHeight;
});




/////////////////////
