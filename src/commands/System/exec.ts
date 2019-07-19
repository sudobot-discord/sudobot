import {
  Command,
  CommandStore,
  KlasaMessage,
  CommandOptions,
  util
} from 'klasa';
import { SudoClient } from '../../core/SudoClient';

export default class extends Command {
  constructor(
    client: SudoClient,
    store: CommandStore,
    file,
    dir,
    options?: CommandOptions
  ) {
    super(client, store, file, dir, {
      name: 'exec',
      permissionLevel: 10,
      guarded: true,
      aliases: ['execute'],
      description: language => language.get('COMMAND_EXEC_DESCRIPTION'),
      extendedHelp: language => language.get('COMMAND_EXEC_EXTENDEDHELP'),
      usage: '<expression:string>'
    });
  }

  async run(msg: KlasaMessage, [input]): Promise<any> {
    await msg.sendMessage('Executing your command...');

    const result = await util
      .exec(input, {
        timeout: 'timeout' in msg.flags ? Number(msg.flags.timeout) : 60000
      })
      .catch(error => ({ stdout: null, stderr: error }));
    const output = result.stdout
      ? `**\`OUTPUT\`**${util.codeBlock('prolog', result.stdout)}`
      : '';
    const outerr = result.stderr
      ? `**\`ERROR\`**${util.codeBlock('prolog', result.stderr)}`
      : '';

    return msg.sendMessage(
      [output, outerr].join('\n') ||
        'Done. There was no output to stdout or stderr.'
    );
  }
}
