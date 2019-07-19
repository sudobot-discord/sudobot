import { Command, CommandStore, KlasaMessage, CommandOptions } from 'klasa';
import { SudoClient } from '../../core/SudoClient';
import { MessageEmbed } from 'discord.js';
import { stringify } from 'query-string';
import * as fetch from 'node-fetch';
import * as Turndown from 'turndown';

export default class extends Command {
  constructor(
    client: SudoClient,
    store: CommandStore,
    file,
    dir,
    options?: CommandOptions
  ) {
    super(client, store, file, dir, {
      name: 'mdn',
      enabled: true,
      requiredPermissions: ['EMBED_LINKS'],
      aliases: ['mozilla-developer-network'],
      description: language => language.get('COMMAND_MDN_DESCRIPTION'),
      usage: '<query:string>',
      usageDelim: ' '
    });
  }

  async run(msg: KlasaMessage, [query]): Promise<any> {
    const turndown = new Turndown();
    const body = await fetch(
      `https://mdn.pleb.xyz/search?${stringify({ q: query })}`
    ).then(response => response.json());
    if (!body.URL || !body.Title || !body.Summary) {
      throw msg.reply(msg.language.get('404'));
    }
    turndown.addRule('hyperlink', {
      filter: 'a',
      replacement: (text, node) =>
        `[${text}](https://developer.mozilla.org${node.href})`
    });
    const embed = new MessageEmbed()
      .setColor(0x066fad)
      .setAuthor(
        'MDN',
        'https://wiki.mozilla.org/images/1/1b/Mdn_logo_color.png',
        'https://developer.mozilla.org/'
      )
      .setURL(`https://developer.mozilla.org${body.URL}`)
      .setTitle(body.Title)
      .setDescription(
        turndown.turndown(
          body.Summary.replace(
            /<code><strong>(.+)<\/strong><\/code>/g,
            '<strong><code>$1</code></strong>'
          )
        )
      );
    return msg.channel.send(embed);
  }
}
