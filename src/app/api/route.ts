import nacl from "tweetnacl";
import {
    APIInteraction,
    APIPingInteraction,
    APIChatInputApplicationCommandInteraction,
    InteractionType,
    APIInteractionResponse,
} from "discord-api-types/v10";

import { env } from "../env.mjs";
import { InteractionResponseType } from "discord-api-types/v9";

export const runtime = "edge";

const validateSignature = async (
    request: Request
): Promise<null | APIInteraction> => {
    const signature = request.headers.get("X-Signature-Ed25519");
    if (!signature) {
        return null;
    }
    const timestamp = request.headers.get("X-Signature-Timestamp");
    if (!timestamp) {
        return null;
    }
    const rawBody = await request.text();

    const isValid = nacl.sign.detached.verify(
        Buffer.from(timestamp + rawBody),
        Buffer.from(signature, "hex"),
        Buffer.from(env.DISCORD_APP_PUBLIC_KEY, "hex")
    );
    if (!isValid) {
        return null;
    }
    return JSON.parse(rawBody) as
        | APIPingInteraction
        | APIChatInputApplicationCommandInteraction;
};

// if (!isVerified) {
//   return res.status(401).end('invalid request signature');
// }

export async function POST(request: Request): Promise<Response> {
    const interaction = await validateSignature(request);

    if (!interaction) {
        return new Response("Invalid Signature", { status: 401 });
    }

    if (interaction.type === InteractionType.Ping) {
        return Response.json({
            type: InteractionResponseType.Pong,
        } satisfies APIInteractionResponse);
    } else if (interaction.type === InteractionType.ApplicationCommand) {
        const commandName = interaction.data.name;
        return Response.json({
            type: InteractionResponseType.Pong,
        } satisfies APIInteractionResponse);
    }

    return new Response("Unexpected interaction type", { status: 400 });
}
