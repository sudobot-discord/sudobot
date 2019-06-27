import { Command, CommandStore, KlasaMessage, CommandOptions, KlasaUser } from "klasa";
import { SudoClient } from "../../core/SudoClient";
import * as request from "request";
import * as Turndown from "turndown";

export default class extends Command {
    constructor(client: SudoClient, store: CommandStore, file, dir, options?: CommandOptions) {
        super(client, store, file, dir, {
            name: "anilist",
            enabled: true,
            requiredPermissions: ['EMBED_LINKS'],
            description: language => language.get("COMMAND_ANILIST_DESCRIPTION"),
            usage: "<anime|manga|character|person|studio> <query:...string>",
            usageDelim: " "
        });
    }

    async run(msg: KlasaMessage, [option, input]): Promise<KlasaMessage | KlasaMessage[]> {
        const turndown = new Turndown();
        const anilistLogo = "https://anilist.co/img/logo_al.png";
        const pipe = (op1, op2) => arg => op2(op1(arg));
        const removeSpoilers = str => str.replace(/<span[^>]*>.*<\/span>/g, "");
        const shorten = str => {
            const markdown = turndown.turndown(str);
            if (markdown.length > 1990) {
                return markdown.substring(0, 1991);
            } else {
                return markdown;
            }
        };
        
        switch (option) {
            case "anime":
                {
                    request({
                        url: 'https://graphql.anilist.co',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `
query ($search: String) {
    Media(search: $search, type: ANIME) {
        id
        siteUrl
        title {
            romaji
            english
            native
        }
        coverImage {
            large
        }
        status
        description(asHtml: true)
        averageScore
    }
}
`,
                            variables: {
                                search: input
                            }
                        })
                    }, function(error, response, body) {
                        const {
                            title,
                            description,
                            siteUrl,
                            coverImage,
                            averageScore: score,
                            status
                        } = JSON.parse(body).data.Media;
                        const scoreString = score != null ? `Score: ${score}%` : "";
                        const statusString = status != null ? `Status: ${(status).split("_").map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(" ")}` : "";
                        let footer = "";
                        if (score) footer += scoreString + "  ";
                        if (status) footer += statusString;
                        return msg.channel.send({embed: {
                            author: {
                                name: title.romaji,
                                url: siteUrl,
                                icon_url: anilistLogo
                            },
                            thumbnail: {
                                url: coverImage.large
                            },
                            description: pipe(removeSpoilers, shorten)(description),
                            footer: {
                                text: footer
                            },
                            color: 3447003
                        }});
                    });
                }
                break;
            case "manga":
                {
                    request({
                        url: 'https://graphql.anilist.co',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `
query ($search: String) {
    Media(search: $search, type: MANGA) {
        id
        siteUrl
        title {
            romaji
            english
            native
        }
        coverImage {
            large
        }
        status
        description(asHtml: true)
        averageScore
    }
}
`,
                            variables: {
                                search: input
                            }
                        })
                    }, function(error, response, body) {
                        const {
                            title,
                            description,
                            siteUrl,
                            coverImage,
                            averageScore: score,
                            status
                        } = JSON.parse(body).data.Media;
                        const scoreString = score != null ? `Score: ${score}%` : "";
                        const statusString = status != null ? `Status: ${(status).split("_").map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(" ")}` : "";
                        let footer = "";
                        if (score) footer += scoreString + "  ";
                        if (status) footer += statusString;
                        return msg.channel.send({embed: {
                            author: {
                                name: title.romaji,
                                url: siteUrl,
                                icon_url: anilistLogo
                            },
                            thumbnail: {
                                url: coverImage.large
                            },
                            description: pipe(removeSpoilers, shorten)(description),
                            footer: {
                                text: footer
                            },
                            color: 3447003
                        }});
                    });
                }
                break;
            case "character":
                {
                    request({
                        url: 'https://graphql.anilist.co',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `
query ($search: String) {
    Character(search: $search) {
        id
        siteUrl
        name {
            first
            last
        }
        image {
            large
        }
        description(asHtml: true)
    }
}
`,
                            variables: {
                                search: input
                            }
                        })
                    }, function(error, response, body) {
                        const {
                            name,
                            description,
                            siteUrl,
                            image
                        } = JSON.parse(body).data.Character;
                        let displayName = name.first;
                        if (name.last != null) {
                            displayName += ` ${name.last}`;
                        }
                        return msg.channel.send({embed: {
                            author: {
                                name: displayName,
                                url: siteUrl,
                                icon_url: anilistLogo
                            },
                            thumbnail: {
                                url: image.large
                            },
                            description: pipe(removeSpoilers, shorten)(description),
                            color: 3447003
                        }});
                    }); 
                }
                break;
            case "person":
                {
                    request({
                        url: 'https://graphql.anilist.co',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `
query ($search: String) {
    Staff(search: $search) {
        id
        siteUrl
        name {
            first
            last
        }
        image {
            large
        }
        description(asHtml: true)
    }
}
`,
                            variables: {
                                search: input
                            }
                        })
                    }, function(error, response, body) {
                        const {
                            name,
                            siteUrl,
                            image,
                            description
                        } = JSON.parse(body).data.Staff;
                        let displayName = name.first;
                        if (name.last != null) {
                            displayName += ` ${name.last}`;
                        }
                        return msg.channel.send({embed: {
                            author: {
                                name: displayName,
                                url: siteUrl,
                                icon_url: anilistLogo
                            },
                            thumbnail: {
                                url: image.large
                            },
                            description: pipe(removeSpoilers, shorten)(description),
                            color: 3447003
                        }});
                    });
                }                
                break;
            case "studio":
                {
                    request({
                        url: 'https://graphql.anilist.co',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `
query ($search: String) {
    Studio(search: $search) {
        id
        name
        siteUrl
        media (isMain: true, sort: POPULARITY_DESC, perPage: 5) {
            nodes {
                siteUrl
                title {
                    romaji
                }
            }
        }
    }
}
`,
                            variables: {
                                search: input
                            }
                        })
                    }, function(error, response, body) {
                        const {
                            name,
                            siteUrl,
                            media
                        } = JSON.parse(body).data.Studio;
                        let anime = "";
                        media.nodes.map(media => {
                            anime += `
                            <a href='${media.siteUrl}'>${media.title.romaji}</a> <br>
                            `;
                        });
                        return msg.channel.send({embed: {
                            title: "Popular Anime",
                            author: {
                                name: name,
                                url: siteUrl,
                                icon_url: anilistLogo
                            },
                            description: pipe(removeSpoilers, shorten)(anime),
                            color: 3447003
                        }});
                    });
                }
                break;
            default:
                return;
            }
    }
}