import { Command, CommandStore, KlasaMessage, CommandOptions, KlasaUser } from "klasa";
import { SudoClient } from "../../core/SudoClient";
import * as fetch from "node-fetch";
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
                    const data = await fetch('https://graphql.anilist.co', {
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
                    }).then(response => response.json())
                      .then(response => response.data.Media);
                    console.log(data);
                    console.log(data.title);
                    const scoreString = data.averageScore != null ? `Score: ${data.averageScore}%` : "";
                    const statusString = data.status != null ? `Status: ${(data.status).split("_").map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(" ")}` : "";
                    let footer = "";
                    if (data.averageScore) footer += scoreString + "  ";
                    if (data.status) footer += statusString;
                    msg.channel.send({embed: {
                        author: {
                            name: data.title.romaji,
                            url: data.siteUrl,
                            icon_url: anilistLogo
                        },
                        thumbnail: {
                            url: data.coverImage.large
                        },
                        description: pipe(removeSpoilers, shorten)(data.description),
                        footer: {
                            text: footer
                        },
                        color: 3447003
                    }});
                }
                break;
            case "manga":
                {
                    const data = await fetch('https://graphql.anilist.co', {
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
                    }).then(response => response.json())
                      .then(response => response.data.Character);
                      const scoreString = data.averageScore != null ? `Score: ${data.averageScore}%` : "";
                      const statusString = data.status != null ? `Status: ${(data.status).split("_").map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(" ")}` : "";
                      let footer = "";
                      if (data.averageScore) footer += scoreString + "  ";
                      if (data.status) footer += statusString;
                      msg.channel.send({embed: {
                          author: {
                              name: data.title.romaji,
                              url: data.siteUrl,
                              icon_url: anilistLogo
                          },
                          thumbnail: {
                              url: data.coverImage.large
                          },
                          description: pipe(removeSpoilers, shorten)(data.description),
                          footer: {
                              text: footer
                          },
                          color: 3447003
                      }});
                }
                break;
            case "character":
                {
                    const data = await fetch('https://graphql.anilist.co', {
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
                    }).then(response => response.json())
                      .then(response => response.data.Media);
                    let displayName = data.name.first;
                    if (data.name.last != null) {
                        displayName += ` ${data.name.last}`;
                    }
                    msg.channel.send({embed: {
                        author: {
                            name: displayName,
                            url: data.siteUrl,
                            icon_url: anilistLogo
                        },
                        thumbnail: {
                            url: data.image.large
                        },
                        description: pipe(removeSpoilers, shorten)(data.description),
                        color: 3447003
                    }});
                }
                break;
            case "person":
                {
                    const data = await fetch("https://graphql.anilist.co", {
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
                    }).then(response => response.json())
                      .then(response => response.data.Staff);
                    let displayName = data.name.first;
                    if (data.name.last != null) {
                        displayName += ` ${data.name.last}`;
                    }
                    msg.channel.send({embed: {
                        author: {
                            name: displayName,
                            url: data.siteUrl,
                            icon_url: anilistLogo
                        },
                        thumbnail: {
                            url: data.image.large
                        },
                        description: pipe(removeSpoilers, shorten)(data.description),
                        color: 3447003
                    }});
                }                
                break;
            case "studio":
                {
                    const data = await fetch('https://graphql.anilist.co', {
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
                    }).then(response => response.json())
                      .then(response => response.data.Studio);
                    let anime = "";
                    data.media.nodes.map(media => {
                        anime += `
                        <a href='${media.siteUrl}'>${media.title.romaji}</a> <br>
                        `;
                    });
                    msg.channel.send({embed: {
                        title: "Popular Anime",
                        author: {
                            name: data.name,
                            url: data.siteUrl,
                            icon_url: anilistLogo
                        },
                        description: pipe(removeSpoilers, shorten)(anime),
                        color: 3447003
                    }});
                }
                break;
            default:
                return;
            }
    }
}