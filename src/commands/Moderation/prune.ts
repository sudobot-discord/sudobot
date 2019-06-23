import { Command, CommandStore, KlasaMessage, CommandOptions, KlasaUser } from "klasa";
import { SudoClient } from "../../core/SudoClient";

export default class extends Command {
    constructor(client: SudoClient, store: CommandStore, file, dir, options?: CommandOptions) {
        super(client, store, file, dir, {
            name: "prune",
            enabled: true,
            permissionLevel: 1,
            requiredPermissions: ['MANAGE_MESSAGES'],
            aliases: ["purge", "clear", "clean"],
            description: language => language.get("COMMAND_PRUNE_DESCRIPTION"),
            runIn: ['text'],
            usage: "<amount:int> [user:user]",
            usageDelim: " "
        });
    }

    async run(msg: KlasaMessage, [amount, user]: [number, KlasaUser]): Promise<any> {
        if (user) {
            let messages = (await msg.channel.messages.fetch({
                limit: 100,
                before: msg.id
            }))
            .filter((a: KlasaMessage) => a.author.id === user.id)
            .array();
            messages.length = Math.min(amount, messages.length);
            if (user.id === msg.author.id) msg.delete();
            if (messages.length === 0) throw msg.reply(msg.language.get("NO_MESSAGE_FROM_THAT_USER"));
            if (messages.length === 1) await messages[0].delete();
            else await msg.channel.bulkDelete(messages).then(() => {
                throw msg.reply("👌").then((sentMsg: KlasaMessage) => sentMsg.delete({
                    timeout: 3000
                }));
            });;
        } else {
            let messages = (await msg.channel.messages.fetch({
                limit: Math.min(amount, 100),
                before: msg.id
            })); 
            msg.delete();
            await msg.channel.bulkDelete(messages).then(() => {
                throw msg.reply("👌").then((sentMsg: KlasaMessage) => sentMsg.delete({
                    timeout: 3000
                }));
            });
        };
    }
}