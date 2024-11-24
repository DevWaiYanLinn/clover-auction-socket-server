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

app.get("/", (req, res) => {
    res.json("hello world").status(200);
});

io.use((socket, next) => {
    next();
});

io.on("connection", (socket) => {
    console.log(`user is connected with ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`disconnected ${socket.id}`);
    });
});

sub.on("message", (channel, data) => {
    const bid = JSON.parse(data);
    const event = `${channel}-${bid.auction.id}`;
    io.emit(event, bid);
});

const port = Number(process.env.SERVER_PORT);
const host = process.env.SERVER_HOST;

server.listen(port, host, 522, () => {
    console.log(`Server is running at ${port} ⚡︎`);
});
