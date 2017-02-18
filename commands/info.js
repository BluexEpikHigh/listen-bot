const needle = require("needle");

module.exports = (message, client, helper) => {
    needle.get("https://api.github.com/repos/bippum/listen-bot/commits", (err, response) => {
        let user_me = client.users.get(client.config.owner);
        let me = message.channel.guild.members.has(client.config.owner) ? `<@${client.config.owner}>` : `${user_me.username}#${user_me.discriminator}`;

        let desc = `A Dota 2 related bot. Features include current talents and patch notes for 6.79+ heroes. Contact ${me} for support and questions!`;
        let links = [":page_facing_up: [GitHub](https://github.com/bippum/listen-bot)",
            `:link: [Invite Link](${client.config.url_invite})`,
            `:information_source: [Help Server](${client.config.discord_invite})`
        ];

        let gitlinks = err ? ["rip github"] : response.body.slice(0, 3).map(commit => `[\`${commit.sha.slice(0, 6)}\`](${commit.html_url}) - ${commit.commit.message.slice(0, 35)}${commit.commit.message.length > 35 ? "..." : ""}`);

        message.channel.createMessage({
            "embed": {
                "timestamp": new Date().toJSON(),
                "description": desc,
                "fields": [{
                    "name": "Github Log",
                    "value": gitlinks.join("\n"),
                    "inline": true
                }, {
                    "name": "Links",
                    "value": links.join("\n"),
                    "inline": true
                }]
            }
        }).then(() => {
            helper.log(message, "sent info message");
        }).catch(err => helper.handle(message, err)); 
    });
};
