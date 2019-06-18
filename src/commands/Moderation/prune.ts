import { Command, CommandStore, KlasaMessage, CommandOptions } from "klasa";
import { GuildMember } from 'discord.js';
import { SudoClient } from "../../core/SudoClient";

export default class extends Command {
    constructor(client: SudoClient, store: CommandStore, file, dir, options?: CommandOptions) {
        super(client, store, file, dir, {
            name: "prune",
            enabled: true,
            permissionLevel: 1,
            requiredPermissions: ['MANAGE_MESSAGES'],
            aliases: [],
            usage: "[amount:int]"
        });
    }

    async run(msg: KlasaMessage, [amount, member]: [number, GuildMember]): Promise<KlasaMessage | KlasaMessage[]> {
        if (!amount || amount < 1) throw msg.reply(msg.language.get("AMOUNT_FALSE"));
        if (!member) throw msg.reply(msg.language.get("MENTION_MEMBER"));
        
        const messages: Message[] = (await msg.channel.messages.fetch({
                limit: 100,
                before: msg.id
            }))
            .filter((a: Message) => a.author.id === member.id)
            .array();
        messages.length = Math.min(quantity, messages.length);
        
        if (messages.length === 0) return msg.reply(msg.language.get("NO_MESSAGES_FROM_THAT_USER");
        if (messages.length === 1) await messages[0].delete();
        else await msg.channel.bulkDelete(messages);
        if (member.id === msg.author.id) msg.delete();

        throw msg.reply('👌').then((sentMsg: KlasaMessage) => sentMsg.delete({
            timeout: 3000
        }));
    }
}
