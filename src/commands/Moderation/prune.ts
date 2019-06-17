import { Command, CommandStore, KlasaMessage, CommandOptions } from "klasa";
import { SudoClient } from "../../core/SudoClient";

export default class extends Command {
    constructor(client: SudoClient, store: CommandStore, file, dir, options?: CommandOptions) {
        super(client, store, file, dir, {
            name: "prune",
            enabled: true,
            permissionLevel: 1,
            requiredPermissions: ['MANAGE_MESSAGES'],
            aliases: ["clean", "purge"],
            usage: "[amount:int]"
        });
    }

    async run(msg: KlasaMessage, [amount]: [number]): Promise<KlasaMessage | KlasaMessage[]> {
        if (!amount) throw msg.reply(msg.language.get("THERE_IS_NO_AMOUNT_TO_PRUNE"));
        if (typeof amount !== "number") throw msg.reply(msg.language.get("AMOUNT_MUST_BE_NUMBER"));
        if (amount < 2 || amount > 100) throw msg.reply(msg.language.get("AMOUNT_FALSE"));
        msg.channel.bulkDelete(amount);
        throw msg.reply('👌').then((sentMsg: KlasaMessage) => sentMsg.delete({timeout: 3000}));
    }
}