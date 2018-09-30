import { createServer } from 'http'
import express from 'express'
import { ChatServer } from './ChatServer'
import { UserList } from './models/UserList';

const httpServer = createServer(express())

const chatServer = new ChatServer(httpServer, new UserList())
chatServer.listen()
