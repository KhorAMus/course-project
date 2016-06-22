var SocketConnection = function (adress){
  //this.socket = new WebSocket("ws://172.23.142.17:8080/websocket");
  //this.socket = new WebSocket("ws://127.0.0.1:8080/websocket");
  //this.socket = new WebSocket("ws://192.168.0.103:8080/websocket");
  this.socket = new WebSocket(adress);
  this.socket.time = Date.now();
  this.socket.ping = 0;

  this.socket.Ping = function(){
    var nowTime = Date.now();
    var ping = nowTime - this.time;
    this.time = nowTime;
    this.ping = ping;
  };

this.socket.onopen = function() {
  console.log("Соединение установлено.");
};

this.socket.onclose = function(event) {
  if (event.wasClean) {
    console.log('Соединение закрыто чисто');
  } else {
    console.log('Обрыв соединения, "убит" процесс сервера'); // например, "убит" процесс сервера
  }
  console.log('Код: ' + event.code + ' причина: ' + event.reason);
};

this.socket.onmessage = function(event) {
  //console.log("Получены данные с сервера: " + event.data + "    ");
    commands = JSON.parse(event.data);
    this.Ping();
    console.log("soclog");
};


this.socket.onerror = function(error) {
  console.log("Ошибка " + error.message);
};

}





  
SocketConnection.prototype.send = function(data) {
  this.socket.send(data);
};
