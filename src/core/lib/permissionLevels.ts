import { PermissionLevels, KlasaMessage } from "klasa";
import { SudoClient } from "../SudoClient";

export default new PermissionLevels(11)
    .add(10, (message: KlasaMessage ) => {
        const client = message.client as SudoClient;
        if (client.sudoOpts.ownerIDs.some(i=> i===message.author.id)) return true;
        return false;
    })
