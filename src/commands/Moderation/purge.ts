import { Command, CommandStore, KlasaMessage, CommandOptions } from "klasa";
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
        let messages: Collection<string, Message>;
        messages = (await msg.channel.messages.fetch({
            limit: Math.min(quantity, 100),
            before: msg.id
        }));
        msg.delete();
        await message.channel.bulkDelete(messages);
        msg.channel.bulkDelete(amount);
        throw msg.reply('👌').then((sentMsg: KlasaMessage) => sentMsg.delete({
            timeout: 3000
        }));
    }
}
