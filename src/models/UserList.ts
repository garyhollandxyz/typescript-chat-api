export class User {
  constructor(
    private nickname: string,
    private colour: string,
    private id: string
  ) {}

  public isUser(user: User) {
    return this.id === user.id
  }

  public hasSameName(user: User) {
    return this.nickname === user.nickname
  }
}

export class UserList {
  private users: User[] = []

  private randomHex () {
    return '#' + (Math.random().toString(16) + '000000').slice(2, 8)
  }

  public filter(filterFunc: (user: User) => boolean): UserList {
    this.users = this.users.filter(filterFunc)
    return this
  }

  public addUser(nickname: string, socketId: string) {
    if (!this.users.some(user => user.hasSameName(user))) {
      this.users.push(new User(nickname, this.randomHex(), socketId))
    } else {
      throw new Error('That nickname is taken!')
    }
    
  }
}
