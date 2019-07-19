import { KlasaClient, KlasaClientOptions } from 'klasa';

export class SudoClient extends KlasaClient {
  constructor(options: KlasaClientOptions, public sudoOpts: SudoClientOptions) {
    super(options);
  }
}

export type SudoClientOptions = {
  version: string;
  disabledModules?: string | any[];
  ownerIDs: string[];
};
