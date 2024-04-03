import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DISCORD_APP_PUBLIC_KEY: z.string(),
        DISCORD_APP_ID: z.string(),
        DISCORD_BOT_TOKEN: z.string(),
    },
    client: {},
    runtimeEnv: {
        DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
        DISCORD_APP_ID: process.env.DISCORD_APP_ID,
        DISCORD_APP_PUBLIC_KEY: process.env.DISCORD_APP_PUBLIC_KEY,
    },
});
