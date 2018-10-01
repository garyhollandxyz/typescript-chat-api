import { Server } from "http";
import socketIo from "socket.io";

import { Message, User } from "./models";

export class ChatServer {
  public static readonly PORT: number = 8080;
  private server: Server;
  private io: socketIo.Server;
  private port: string | number;
  private users: User[] = [];

  constructor(httpServer: Server) {
    this.server = httpServer;
    this.port = process.env.PORT || ChatServer.PORT;
    this.io = socketIo(this.server);
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Running server on port ${this.port}`);
    });

    this.io.on("connect", (socket: SocketIO.Socket) => {
      console.log(`Connected client on port ${this.port}.`);

      socket.on("newUser", (nickname: string) => {
        try {
          this.validateNickname(nickname);
          this.users.push(new User(nickname, socket.id, this.randomHex()));
          socket.emit("nickname", nickname);
          socket.broadcast.emit("userJoined", nickname);
        } catch (err) {
          console.log(`Error: ${err.message} (id: ${socket.id})`);
          socket.emit("validationError", { errorMessage: err.message });
        }
      });

      socket.on("message", (message: Message) => {
        console.log(`[server](message): ${JSON.stringify(message)}`);
        this.io.emit("message", message);
      });

      socket.on("startTyping", (nickname: string) => {
        socket.broadcast.emit("userStartTyping", nickname);
      });

      socket.on("stopTyping", (nickname: string) => {
        socket.broadcast.emit("userStopTyping", nickname);
      });

      socket.on("disconnect", (id: string) => {
        this.users = this.users.filter((user: User) => user.id !== id);
      });
    });
  }

  private randomHex() {
    return "#" + (Math.random().toString(16) + "000000").slice(2, 8);
  }

  private validateNickname(nickname: string) {
    if (this.users.some(user => user.nickname === nickname)) throw new Error('That nickname is taken!')
  }
}
