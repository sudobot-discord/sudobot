import { Command, CommandStore, KlasaMessage, CommandOptions } from "klasa";
import { SudoClient } from "../../core/SudoClient";
import { TextChannel  } from "discord.js";
import { get } from "request";
import { stringify } from "query-string";

export default class extends Command {
    constructor(client: SudoClient, store: CommandStore, file, dir, options?: CommandOptions) {
        super(client, store, file, dir, {
            name: "discordjs",
            enabled: true,
            requiredPermissions: ['EMBED_LINKS'],
            aliases: ["djs", "djsdocs"],
            description: language => language.get("COMMAND_DJS_DESCRIPTION"),
            usage: "<query:string>"
        });
    }    
    async run(msg: KlasaMessage, [query]): Promise<any> {
        const q = query.split(' ');
        let source = ['stable', 'master', 'rpc', 'commando', 'akairo', 'akairo-master', '11.5-dev'].includes(q.slice(-1)[0]) ? q.pop() : "stable"; 
        if (source === '11.5-dev') {
			source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${source}.json`;
		}
        await get(`https://djsdocs.sorta.moe/v2/embed?${stringify({ src: source, q: q.join(' ') })}`, async function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const embed = JSON.parse(body);
                if (!embed) {
                    throw msg.reply(msg.language.get("404"));
                }
                if (!(msg.channel as TextChannel).permissionsFor((msg.client as SudoClient).user).has(['ADD_REACTIONS', 'MANAGE_MESSAGES'], false) || msg.channel.type === "dm") {
                    return msg.channel.send({ embed });
                }
                const message = await msg.channel.send({ embed }) as KlasaMessage;
                message.react('🗑');
                let react;
                try {
                    react = await message.awaitReactions(
                        (reaction, user): boolean => reaction.emoji.name === '🗑' && user.id === msg.author.id,
                        { max: 1, time: 5000, errors: ['time'] }
                    );
                } catch (error) {
                    message.reactions.removeAll();
                    return message;
                }
                react.first().message.delete();
                return message;
            }
        });
    }
}