import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import subscriber from "./database/redis/subscriber";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log(`use is connected with ${socket.id}`);
});

server.listen(3001, () => {
    subscriber.on("message", (channel, data) => {
        io.emit("bid", JSON.parse(data));
    });
    console.log("Server is running at 3001");
});
