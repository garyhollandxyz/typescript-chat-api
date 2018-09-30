"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(nickname, colour, id) {
        this.nickname = nickname;
        this.colour = colour;
        this.id = id;
    }
    isUser(user) {
        return this.id === user.id;
    }
    hasSameName(user) {
        return this.nickname === user.nickname;
    }
}
exports.User = User;
class UserList {
    constructor() {
        this.users = [];
    }
    randomHex() {
        return '#' + (Math.random().toString(16) + '000000').slice(2, 8);
    }
    filter(filterFunc) {
        this.users = this.users.filter(filterFunc);
        return this;
    }
    addUser(nickname, socketId) {
        if (!this.users.some(user => user.hasSameName(user))) {
            this.users.push(new User(nickname, this.randomHex(), socketId));
        }
        else {
            throw new Error('That nickname is taken!');
        }
    }
}
exports.UserList = UserList;
