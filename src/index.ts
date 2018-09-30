import { createServer } from 'http'
import express from 'express'
import { ChatServer } from './ChatServer'

const httpServer = createServer(express())

const chatServer = new ChatServer(httpServer)
chatServer.listen()
