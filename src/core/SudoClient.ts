import { KlasaClient, KlasaClientOptions} from "klasa";

export class SudoClient extends KlasaClient {
    constructor(options: KlasaClientOptions, sudoOpts: SudoClientOptions) {
        super(options)
    }
}

export type SudoClientOptions = {
    version: string
    disabledModules?: string|any[] 
}