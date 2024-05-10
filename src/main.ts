import express, { Express } from "express";
import { createServer, Server as HTTPServer } from "http";
import  { Server as IOServer, Socket } from "socket.io";
import { EventOption, EventEmitOption } from "./types";

const app: Express = express();

const server: HTTPServer = createServer(app);

type iRoomIdList = {
  [key: string]: Socket;
};
let roomIdlist: iRoomIdList = {};

const io = new IOServer(server, {
  cors: {
    origin: "*", // Allow your frontend origin
    methods: ["GET", "POST"], // Allow only GET and POST requests
  },
});

const roomEventCallBack = (data: any) => {
  let room_id;
  if (data && data.data) {
    room_id = data.data.room_id;
  }
  let socketFound = roomIdlist[room_id];
  if (socketFound) {
    io.in(room_id).emit(EventEmitOption.TO_CLIENT, data);
  }
};
const endStreamCallBack = (data: any) => {
  let room_id;
  if (data && data.data) {
    room_id = data.data.room_id;
  }
  let socketFound = roomIdlist[room_id];
  if (socketFound) {
    io.in(room_id).emit(EventEmitOption.END_STREAM, data);
  }
};
const handleFromServerEvent = (socket: Socket) => {
  socket.on(EventOption.FROM_SERVER, (data: any) => roomEventCallBack(data));
};
const handleEndStreamFromBot = (socket: Socket) => {
  socket.on(EventOption.END_STREAM_FROM_BOT, (data: any) =>
    endStreamCallBack(data)
  );
};
const handleStopGereratingResponse = (socket: Socket) => {
  socket.on(EventOption.STOP_GENERATING_RESPONSE, (data: any) => {
    io.emit(EventEmitOption.END_STREAM, data);
  });
};
const handleLoginEvent = (socket: Socket) => {
  socket.on(EventOption.LOGIN, (data: any): void => {
    const roomId = data.roomId;
    roomIdlist[roomId] = socket;
    socket.join(roomId)
    console.log(`New connection from user ${roomId}`);
  });
};
const handleDisconnectEvent = (socket: Socket) => {
  socket.on(EventOption.DISCONNECT, () => {
    console.log("Client disconnected");
  });
};

const handleSocketIoEvents = (socket: Socket) => {
  handleLoginEvent(socket);
  handleFromServerEvent(socket);
  handleEndStreamFromBot(socket);
  handleStopGereratingResponse(socket);
  handleDisconnectEvent(socket);
};

io.on(EventOption.CONNECTION, (socket: Socket) =>
  handleSocketIoEvents(socket)
);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
