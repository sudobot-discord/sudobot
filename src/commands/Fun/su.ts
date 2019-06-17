import { Command, CommandStore, KlasaMessage, CommandOptions } from "klasa";
import { SudoClient } from "../../core/SudoClient";

export default class extends Command {
    constructor(client: SudoClient, store: CommandStore, file, dir, options?: CommandOptions) {
        super(client, store, file, dir, {
            name: "su",
            enabled: true
        });
    }

    async run(msg: KlasaMessage): Promise<KlasaMessage | KlasaMessage[]> {
        const client = msg.client as SudoClient;
        if (client.sudoOpts.ownerIDs.includes(msg.author.id)) throw msg.channel.send("[sudo] password for `" + msg.author.username + "`:\nAccess granted");
        else throw msg.channel.send("[sudo] password for `" + msg.author.username + "`:\nAccess denied");
    }
}