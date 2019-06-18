import { Command, CommandStore, KlasaMessage, CommandOptions } from "klasa";
import { Collection } from 'discord.js';
import { SudoClient } from "../../core/SudoClient";

export default class extends Command {
    constructor(client: SudoClient, store: CommandStore, file, dir, options?: CommandOptions) {
        super(client, store, file, dir, {
            name: "purge",
            enabled: true,
            permissionLevel: 1,
            requiredPermissions: ['MANAGE_MESSAGES'],
            aliases: [],
            usage: "[amount:int]"
        });
    }

    async run(msg: KlasaMessage, [amount]: [number]): Promise<KlasaMessage | KlasaMessage[]> {
        if (!amount || amount < 1) throw msg.reply(msg.language.get("AMOUNT_FALSE"));

        let messages = (await msg.channel.messages.fetch({
                limit: Math.min(amount, 100),
                before: msg.id
            }));
        msg.delete();
        await msg.channel.bulkDelete(messages);
        throw msg.reply('👌').then((sentMsg: KlasaMessage) => sentMsg.delete({
            timeout: 3000
        }));
    }
}
