import { Server } from 'http'
import socketIo from 'socket.io'

import { Message, UserList } from './models'

export class ChatServer {
  public static readonly PORT: number = 8080
  private server: Server
  private io: socketIo.Server
  private port: string | number
  private userList: UserList

  constructor(httpServer: Server, userList: UserList) {
    this.server = httpServer
    this.port = process.env.PORT || ChatServer.PORT
    this.io = socketIo(this.server)
    this.userList = userList
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Running server on port ${this.port}`)
    })

    this.io.on('connect', (socket: SocketIO.Socket) => {
      console.log(`Connected client on port ${this.port}.`)

      socket.on('newUser', (nickname: string) => {
        try {
          this.userList.addUser(nickname, socket.id)
          socket.emit('nickname', nickname)
          socket.broadcast.emit('userJoined', nickname)
        } catch (err) {
          console.log(`Error: ${err.message} (id: ${socket.id})`)
          socket.emit('validationError', { errorMessage: err.message })
        }
      })

      socket.on('message', (message: Message) => {
        console.log(`[server](message): ${JSON.stringify(message)}`)
        this.io.emit('message', message)
      })

      socket.on('startTyping', (nickname: string) => {
        socket.broadcast.emit('userStartTyping', nickname)
      })

      socket.on('stopTyping', (nickname: string) => {
        socket.broadcast.emit('userStopTyping', nickname)
      })

      socket.on('disconnect', () => {
        this.userList = this.userList.filter(user => !user.isUser(user))
      })
    })
  }
}
