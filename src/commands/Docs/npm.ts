import { Command, CommandStore, KlasaMessage, CommandOptions } from "klasa";
import { SudoClient } from "../../core/SudoClient";
import { MessageEmbed } from "discord.js";
import * as fetch from "node-fetch";
import * as moment from 'moment';
import 'moment-duration-format';

export default class extends Command {
    constructor(client: SudoClient, store: CommandStore, file, dir, options?: CommandOptions) {
        super(client, store, file, dir, {
            name: "npm",
            enabled: true,
            requiredPermissions: ['EMBED_LINKS'],
            aliases: ["npm-package", "node-package-manager"],
            description: language => language.get("COMMAND_NPM_DESCRIPTION"),
            usage: "<pkg:string>",
            usageDelim: " "
        });
    }

    async run(msg: KlasaMessage, [pkg]): Promise<any> {
        const body = await fetch(`https://registry.npmjs.com/${encodeURIComponent(pkg.replace(/ /g, '-'))}`).then(response => response.json());
        if (body.time.unpublished) {
            return msg.reply(msg.language.get('COMMAND_NPM_UNPUBLISHED'));
        }
        if (body.status && body.status === 404) {
            return msg.reply(msg.language.get("404"));
        }
        const version = body.versions[body['dist-tags'].latest];
        const maintainers = trimArray(body.maintainers.map((user: {
            name: string
        }): string => user.name));
        const dependencies = version.dependencies ? trimArray(Object.keys(version.dependencies)) : null;
        const embed = new MessageEmbed()
            .setColor(0xC22127)
            .setAuthor('NPM', 'https://raw.githubusercontent.com/npm/logos/master/npm%20square/n-large.png', 'https://www.npmjs.com/')
            .setTitle(body.name)
            .setURL(`https://www.npmjs.com/package/${pkg}`)
            .setDescription(body.description || 'No description.')
            .addField('❯ Version', body['dist-tags'].latest, true)
            .addField('❯ License', body.license || 'None', true)
            .addField('❯ Author', body.author ? body.author.name : '???', true)
            .addField('❯ Creation Date', moment.utc(body.time.created).format('YYYY/MM/DD hh:mm:ss'), true)
            .addField('❯ Modification Date', moment.utc(body.time.modified).format('YYYY/MM/DD hh:mm:ss'), true)
            .addField('❯ Main File', version.main || 'index.js', true)
            .addField('❯ Dependencies', dependencies && dependencies.length ? dependencies.join(', ') : 'None')
            .addField('❯ Maintainers', maintainers.join(', '));
        return msg.channel.send(embed);
        
        function trimArray(arr: string[]): string[] {
            if (arr.length > 10) {
                const len = arr.length - 10;
                arr = arr.slice(0, 10);
                arr.push(`${len} more...`);
            }
            return arr;
        }
    }
}