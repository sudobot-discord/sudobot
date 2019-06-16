import { Command, CommandStore, KlasaMessage, CommandOptions } from "klasa";
import { SudoClient } from "../../core/SudoClient";

export default class extends Command {
    constructor(client: SudoClient, store: CommandStore, file, dir, options?: CommandOptions) {
        super(client, store, file, dir, {
            name: "prune",
            enabled: true,
            aliases: ["clean", "purge"],
            usage: "[amount:int]"
        });
    }

    async run(msg: KlasaMessage, [amount]): Promise<KlasaMessage | KlasaMessage[]> {
        if (!amount) throw msg.language.get("THERE_IS_NO_AMOUNT");
        msg.channel.bulkDelete(amount);
        return;
    }
}