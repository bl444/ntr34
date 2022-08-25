let badLinks = [
  "porn",
  "hentai",
  "deathaddict",
  "gay",
  "bangbros", // ayyyyyy
  "xvide",
  "grabify",
  "redtu",
  "liveleak",
  "brazz",
  "bangbr",
  "wetting",
  "nude",
  "naked",
  "sex",
  "behead",
  "killing",
  "nigger",
  "negro",
  "r34",
  "rule34",
  "e621",
  "gore",
  "milf",
  "vagina",
  "pussy",
  "slut",
  "penis",
  "dick",
  "ass",
  "gore",
  "gay p",
  "prn",
  "d1ck",
  "p0rn",
  "pen15",
  "blue waf",
  "cock",
  "cancer",
  "p3nis",
  "pen1s",
  "pvss",
  "boob",
  "b00b",
  "b0ob",
  "bo0b",
  "breast",
  "br3ast",
  "br34s",
  "t1t",
  "ti1t3",
  "tit",
  "sperm",
  "sp3rm",
  "pnis",
  "fap",
  "masturb",
  "f4p",
  "hot anime girls",
  "h3nt",
]
const Discord = require("discord.js");
const google = require("google-searcher")
exports.run = (client, message, args, level) => {
  var google = require('google')
  var canPost = true
  var nsfw = message.channel.nsfw
  let links = []
  let search = args.join(" ")
  if (search === undefined) {
    message.channel.send("Need something to search.")
    return;
  }
  search = client.removeAccents(search)
  google(search, async (err, response) => {
    let res = response
    let linkObj = res.links[0]
    console.log(res)
    if (err) {
      return message.reply("Search failed. " + err)
    }
    if (!linkObj) {
      
      return message.reply("failed to obtain first relevant result. Here is the link object: " + JSON.stringify(res.links))
    }
    let link = linkObj.href
    let title = linkObj.title
    let desc = linkObj.description
    if (!link) {
      message.channel.send("No results found.")
      return
    } else {
      for (x in badLinks) {
        if (link.toLowerCase().match(badLinks[x])) {
          canPost = false
          break;
        }
        if (title.toLowerCase().match(badLinks[x])) {
          canPost = false
          break;
        }
        if (desc.toLowerCase().match(badLinks[x])) {
          canPost = false
          break;
        }
      }
      if (canPost) {
        message.channel.send(`${title}\n${link}\n\n${desc}`)
      } else {
        if (nsfw) {
          message.channel.send(`${title}\n${link}\n\n${desc}`)
        } else {
          message.channel.send("Sorry! The content on that page would be deemed inappropiate. Please try this in an NSFW channel.")
        }
      }
    }
  })
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["search", "google", "lookup"],
  permLevel: "Chief",
  gcOnly: true
};
exports.help = {
  name: "search",
  category: "Emblazes Only",
  description: "Searches things from the web",
  usage: "search [keyword(s)]"
};
