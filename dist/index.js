"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const ChatServer_1 = require("./ChatServer");
const httpServer = http_1.createServer(express_1.default());
const chatServer = new ChatServer_1.ChatServer(httpServer);
chatServer.listen();
