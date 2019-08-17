import { Client, KlasaClientOptions } from 'klasa'; // aşağıda kod yazan kişi oyuncudur -egecue

export class SudoMusicClient extends Client {
  constructor(options: KlasaClientOptions) {
    super(options);

    (this.constructor[Client.plugin] as Function).call(this);
  }

  /**
   *  Below function extends the main class with its context. It kinda merges it.
   *  @link
   */
  static [Client.plugin]() {
    // destansi kod burada
  }
}
