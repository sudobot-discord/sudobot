import { SudoClient } from "./core/SudoClient";
import permissionLevels from "./core/lib/permissionLevels";

require("dotenv").config();

const client = new SudoClient({
    commandEditing: true,
    prefix: "sudo ",
    shards: [0],
    production: false,
    permissionLevels
}, {
    version: "0.0.2",
    ownerIDs: ["363699988628373504","479738812633841694","403225819222245377","281517829776343050","349536885749579777"] 
}).login(process.env.DISCORD_TOKEN);
