import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import adapter from "./database/redis/socket-adapter";
import "dotenv/config";
import { createAdapter } from "@socket.io/redis-adapter";

const app = express();
const { pub, sub } = adapter;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
    adapter: createAdapter(pub, sub),
});

io.on("connection", (socket) => {
    console.log(`use is connected with ${socket.id}`);
});

sub.on("message", (channel, data) => {
    io.emit(channel, JSON.parse(data));
});

const port = process.env.SERVER_PORT;

server.listen(port, () => {
    console.log(`Server is running at ${port} ⚡︎`);
});
