import Redis from "ioredis";
const subscriberSingleton = () => {
    const redis = new Redis();
    redis.subscribe("bid", (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message);
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`,
            );
        }
    });
    redis.subscribe("buyout", (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message);
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`,
            );
        }
    });
    return redis;
};

declare const globalThis: {
    subscriberGlobal: ReturnType<typeof subscriberSingleton>;
} & typeof global;

const subscriber = globalThis.subscriberGlobal ?? subscriberSingleton();

export default subscriber;

if (process.env.NODE_ENV !== "production") {
    globalThis.subscriberGlobal = subscriber;
}
