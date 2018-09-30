"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const models_1 = require("./models");
class ChatServer {
    constructor(httpServer) {
        this.users = [];
        this.server = httpServer;
        this.port = process.env.PORT || ChatServer.PORT;
        this.io = socket_io_1.default(this.server);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Running server on port ${this.port}`);
        });
        this.io.on('connect', (socket) => {
            console.log(`Connected client on port ${this.port}.`);
            socket.on('newUser', (nickname) => {
                try {
                    this.users.push(new models_1.User(nickname, socket.id, this.randomHex()));
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
            socket.on('disconnect', (id) => {
                this.users = this.users.filter((user) => user.id !== id);
            });
        });
    }
    randomHex() {
        return '#' + (Math.random().toString(16) + '000000').slice(2, 8);
    }
}
ChatServer.PORT = 8080;
exports.ChatServer = ChatServer;
