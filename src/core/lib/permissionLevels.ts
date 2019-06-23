import { PermissionLevels, KlasaMessage } from "klasa";
import { SudoClient } from "../SudoClient";
import { GuildMember, Message } from "discord.js";

export default new PermissionLevels()
    .add(0, () => true)
    .add(1, (message: KlasaMessage) => message.guild && message.member.hasPermission("MANAGE_MESSAGES"))
    .add(10, (message: KlasaMessage) => {
        if ((message.client as SudoClient).sudoOpts.ownerIDs.some(i => i === message.author.id)) return true;
        return false;
    });
