"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
class ChatServer {
    constructor(httpServer, userList) {
        this.server = httpServer;
        this.port = process.env.PORT || ChatServer.PORT;
        this.io = socket_io_1.default(this.server);
        this.userList = userList;
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Running server on port ${this.port}`);
        });
        this.io.on('connect', (socket) => {
            console.log(`Connected client on port ${this.port}.`);
            socket.on('newUser', (nickname) => {
                try {
                    this.userList.addUser(nickname, socket.id);
                    socket.emit('nickname', nickname);
                    socket.broadcast.emit('userJoined', nickname);
                }
                catch (err) {
                    console.log(`Error: ${err.message} (id: ${socket.id})`);
                    socket.emit('validationError', { errorMessage: err.message });
                }
            });
            socket.on('message', (message) => {
                console.log(`[server](message): ${JSON.stringify(message)}`);
                this.io.emit('message', message);
            });
            socket.on('startTyping', (nickname) => {
                socket.broadcast.emit('userStartTyping', nickname);
            });
            socket.on('stopTyping', (nickname) => {
                socket.broadcast.emit('userStopTyping', nickname);
            });
            socket.on('disconnect', () => {
                this.userList = this.userList.filter(user => !user.isUser(user));
            });
        });
    }
}
ChatServer.PORT = 8080;
exports.ChatServer = ChatServer;
