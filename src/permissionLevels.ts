import { PermissionLevels } from "klasa";

module.exports = new PermissionLevels()
    .add(10, ({ author, client }) => {
        if (!author || !client) return false;
        
    } )
