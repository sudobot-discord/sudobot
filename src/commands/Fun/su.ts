import { Command, CommandStore, KlasaMessage, CommandOptions } from 'klasa';
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
      name: 'su',
      enabled: true,
      description: language => language.get('COMMAND_SU_DESCRIPTION')
    });
  }

  async run(msg: KlasaMessage): Promise<KlasaMessage | KlasaMessage[]> {
    if ((msg.client as SudoClient).sudoOpts.ownerIDs.includes(msg.author.id))
      throw msg.channel.send(
        '[sudo] password for `' + msg.author.username + '`:\nAccess granted'
      );
    else
      throw msg.channel.send(
        '[sudo] password for `' + msg.author.username + '`:\nAccess denied'
      );
  }
}
