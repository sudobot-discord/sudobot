import { SudoClient } from "./core/SudoClient";

require("dotenv").config();

new SudoClient({
    commandEditing: true,
    prefix: "sudo",
    production: false
}, {
    version: "0.0.1"
}).login(process.env.DISCORD_TOKEN);