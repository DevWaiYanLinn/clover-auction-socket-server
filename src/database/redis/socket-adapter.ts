import Redis from "ioredis";
const adapterSingleton = () => {
    const pub = new Redis({
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
        password: process.env.REDIS_PASSWORD!,
    });
    const sub = pub.duplicate();
    sub.subscribe("bid", (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message);
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`,
            );
        }
    });
    sub.subscribe("buyout", (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message);
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`,
            );
        }
    });
    return { pub, sub };
};

declare const globalThis: {
    adapterGlobal: ReturnType<typeof adapterSingleton>;
} & typeof global;

const adapter = globalThis.adapterGlobal ?? adapterSingleton();

export default adapter;

if (process.env.NODE_ENV !== "production") {
    globalThis.adapterGlobal = adapter;
}
