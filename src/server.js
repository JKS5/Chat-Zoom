import express from "express";
import SocketIO from "socket.io";
// import { Server } from "socket.io";
// 이미 http는 Node에 내장되어 있다
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http:localhost:3000`);

//websocket과 http를 합치기 위해 express의 app으로 부터 http서버를 만든다.
//이제 express에서 server를 만들었다. (http.createServer(app))
//이제 const server를 통해 서버에 접근이 가능해진다.
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  console.log(socket);
});
// const wss = new WebScoket.Server({ server });
// wss는 web socket server의 약자로 만약 wss만 만든다면 new WebSocket.Server()이렇게만 쓰면 된다.
// 여기서는 WebScoket.Server({ server });에 {server}을 넣었는데
// 그 이유는 위 HTTP 서버와 WEBSOCKET 서버을 합쳐서 사용하기 위해 http server를 전달한 것이다.
//이렇게 하면 http서버를 돌리면 websocket서버도 같이 돌아간다.
//http만 원한다, 혹은 websocketserver만 원한다면 아래와 같이 사용 안해도 된다.
// 이렇게 하면 3000포트 같은 포트에서 http,ws http:localhost:3000 가 ws:localhost:3000도 작동시킬 수 있게 하기 위해 만든 거다..
// 이렇게 안해도 된다. 필수가 아니다. 꼭 2개 다 둘리려고 필요할떄만 이렇게 한다.
//같은 3000포트위에 같이 쓰고 싶기 때문에 http서버 위에 websocket서버를 만든거다.

// function onSocketClose() {
//   console.log("disconnected from the Browser");
// }

// const sockets = [];

// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connected to Browesr!!");
//   socket.on("close", onSocketClose);
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload}`)
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = message.payload;
//     }
//   });
// });

// app.listen(3000, handleListen);
//같은 3000포트 공유
httpServer.listen(3000, handleListen);