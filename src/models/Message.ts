import { User } from './UserList'

export class Message {
  constructor(private from: User, private content: string) {}
}
