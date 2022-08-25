if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");
// eslint-disable-line no-unused-vars
// Discord
const Discord = require("discord.js");
// Anti-ddos
// const DDOS = require("anti-ddos")
// var ddos = new DDOS({burst:5, limit:10})
// Client
const client = new Discord.Client()
// Datastoring
// Other
const {promisify} = require("util");
const util = require("util")
const fs = require("fs")
const readdir = promisify(require("fs").readdir);
const readfile = promisify(require("fs").readFile)
const writefile = promisify(require("fs").writeFile)
const Enmap = require("enmap");
const bodyParser = require('body-parser')
const express = require("express");
const http = require('request')
const moment = require("moment");
const roblox = require("noblox.js")
// Datastoring
const redis = require('redis')
const asyncredis = require('async-redis')
require("moment-duration-format");
//const dblapi = require("dblapi.js")
//const dbl = new dblapi(process.env.DBL_TOKEN, client)
const config = require('./config.js')

var app = express();
client.logger = require("./util/Logger");
client.config = config
let last3 = {}
client.commands = new Enmap()
client.aliases = new Enmap()
var prefix = "$"
var messageQueue = []
var blacklisted = {
  '858422385': true 
}
var jjstudiosdisc = '727663868272181248'
var msgCount = {}
var locked = {}
var channelData = {}
var maxMessages = 70
var noBotCommands = {
  '501860458626547723': true
}
require("./modules/functions.js")(client)
console.log("PROCESS:\n" + process + "\nENV: " + process.env)

var rediscli = redis.createClient({url: process.env.REDIS_URL, password: process.env.REDIS_PASS})
client.redisClient = rediscli
asyncredis.decorate(client.redisClient)

function randRange(min, max) {
  let range = (max - min) + 1
  return Math.floor((Math.random() * range) + min)
}

// Ready event to load sources
client.on("ready", async () => {
  // await client.wait(2500)
  console.log("The client is ready and has loaded.")
  client.user.setActivity("Worshipping emblazes", {type: "PLAYING"})
})
// Add member roles for my server
let altLogs = {}
client.on('guildMemberAdd', member => {
  let role = '520418075355381761'
  let altLogChannel = '572881168404578312'
  let guild = member.guild
  if (guild) {
   // if (guild.roles.get(role)) {
   //   role = guild.roles.get(role)
      //member.addRole(role)
  //  }
    let accountLimit = 3600 * 1000 * 72 // 3 days
    if (guild.id == jjstudiosdisc) {
      member.user.send("Welcome to JJ Studios! Hope you have fun here and be sure to follow the rules, if you see any moderator abusing then report them to emblazes.").catch(e => console.log("huhh error?")) 
      let now = Date.now()
      let created = member.user.createdTimestamp
      let elapsedTime = now - created
      if (elapsedTime < accountLimit) {
        if (!altLogs[member.id]) {
          altLogs[member.id] = 1
        } else {
          altLogs[member.id] = altLogs[member.id] + 1
        }
        let channel = client.channels.get(altLogChannel)
        if (channel) {
          if (altLogs[member.id] < 3) {
            let format = moment.duration(elapsedTime).format("D [days], H [hours], m [minutes], s [seconds]")
            let embed = new Discord.RichEmbed()
            embed.setTitle("Retarded new account found!!")
            embed.setDescription(member.user.tag + " was muted by me due to being a new account!")
            embed.addField("Account lifespan", format)
            embed.addField("AccountID", member.id)
            embed.setColor("ORANGE")
            embed.setTimestamp()
            channel.send({embed})
          } else {
            let format = moment.duration(elapsedTime).format("D [days], H [hours], m [minutes], s [seconds]")
            let embed = new Discord.RichEmbed()
            embed.setTitle("Alternate account banned!")
            embed.setDescription(member.user.tag + " was banned for being a new account.")
            embed.addField("Account lifespan", format)
            embed.addField("AccountID", member.id)
            embed.setColor("RED")
            embed.setFooter("Who this ape??")
            embed.setTimestamp()
            channel.send({embed})
            //delete altLogs[member.id]
                          var embed3 = new Discord.RichEmbed()
              embed3.setTitle("You have been banned!")
              embed3.setDescription(`You were banned from ${message.guild.name} for: ALT\nContact a HR to sort this out.`)
              embed3.setFooter("emblazes#2221")
              embed3.setColor("ORANGE")
              embed3.setTimestamp()
            member.user.send({embed3}).catch(e => console.log("huhh error 2?")) 
            member.ban(7)
          }
        }
        member.addRole(member.guild.roles.find(r => r.name.toLowerCase() == 'muted')) 
      }
    }
  }
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// app.use(ddos.express)
app.set('env', 'production')
app.post("/endjackpot", (req, res) => {
 // return res.status(200)
  let body = req.body
  if (!body) {
    return res.status(400).send("Malformed request")
  }
  if (body.key !== process.env.authKey) {
    console.log(body.key)
    console.log(process.env.authKey);
    return res.status(403).send("oi who is this?! huh enter the correct key")
  }
  let winnerName = body.winner
  let total = body.jptotal
  let capper = body.cap
  let id = body.winnerid
  let percent = body.percent
  let jphost = body.jackpotype
  let channel = client.channels.get("727663880620212225")
  let embed = new Discord.RichEmbed()
  embed.setTitle("$ " + capper + " Cap Jackpot Winner!") 
embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
  embed.setDescription(winnerName + " won a jackpot with a total of **💷 " + total + "**!\n Probability: **" + percent + "** -\n Jackpot Host: **" + jphost + "** -")
  embed.setColor('GREEN')
  embed.setFooter("emblazes#2221")
  embed.setTimestamp()
  channel.send({embed})
  res.status(200).send("Posted")
})

app.post("/gamelog", (req, res) => {
  //return res.status(200)
  let body = req.body
  if (!body) {
    return res.status(400).send("Malformed request")
  }
  if (body.key !== process.env.GC_ACCESS) {
    return res.status(403).send("FORBIDDEN")
  }
  if (body.logType == "Trade") {
    let user1 = body.sender
    let user2 = body.partner
    let item = body.item
    let channel = client.channels.get("543253369763135489")
    let embed = new Discord.RichEmbed()
    embed.setTitle("Rare Item Traded")
    embed.setDescription(user1 + " has traded a " + item + " to " + user2 + ".")
    embed.setThumbnail('https://static.thenounproject.com/png/153146-200.png')
    embed.setColor('ORANGE')
    embed.setFooter("Powered by " + client.user.tag || "(null)")
    embed.setTimestamp()
    channel.send({embed})
    res.status(200).send("Posted")
  }
  if (body.logType == "Sold") {
    let user1 = body.sender
    let item = body.item
    let channel = client.channels.get("543253369763135489")
    let embed = new Discord.RichEmbed()
    embed.setTitle("Rare Item Sold...")
    embed.setDescription(user1 + " just sold a " + item + ".\n\nI hope you're happy with your actions.")
    embed.setThumbnail('https://cdn.shopify.com/s/files/1/1061/1924/products/Sad_Face_Emoji_large.png?v=1480481055')
    embed.setColor('ORANGE')
    embed.setFooter("Powered by " + client.user.tag)
    embed.setTimestamp()
    // channel.send({embed})
    res.status(200).send("Posted")
  }
})
app.post("/gamelogfull", (req, res) => {
  return res.status(200)
  let body = req.body
  if (!body) {
    return res.status(400).send("Malformed request")
  }
  if (body.key !== process.env.GC_ACCESS) {
    return res.status(403).send("FORBIDDEN")
  }
  if (body.logType == "Trade") {
    let data = body
    let channel = client.channels.get("556897745605230603")
    let embed = new Discord.RichEmbed()
    embed.setTitle("Trade")
    delete data.key
    delete data.logType
    data.PlayerItems = data.PlayerItems.join(", ")
    data.PartnerItems = data.PartnerItems.join(", ")
    data.PlayerPets = data.PlayerPets.join(", ")
    data.PartnerPets = data.PartnerPets.join(", ")
    embed.setDescription("Trade between `" + data.Player.split(' ')[0] + "` and `" + data.Partner.split(' ')[0] + "`\n\n" + data.Player + "\n" + data.Partner + "\n\n" + JSON.stringify(data, null, "\t"))
    embed.setThumbnail('https://static.thenounproject.com/png/153146-200.png')
    embed.setColor('ORANGE')
    // embed.setFooter("Powered by " + client.user.tag)
    embed.setTimestamp()
    channel.send({embed})
    res.status(200).send("Posted")
  }
})
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.get(`/get-request`, async (request, response) => {
    response.status(200).send(client.request);
});
app.post("/pingtest", (request, response) => {
  console.log("ping! POST")
  response.status(200)
})
app.get("/pingtestget", (req, res) => {
  console.log("ping! GET") 
  res.status(200)
})
let listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is currently listening on port: ${listener.address().port}`);
});

// Initialize the client
const init = async () => {
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });
  client.on("message", async message => {
    let guild = message.guild
    let key = message.author.id
    // Automod
    if (message.author.bot) return;
    if (message.guild == jjstudiosdisc) {
      client.getData(message.author.id + "-LOGS").then(data => {
        if (!JSON.parse(data)) {
          client.setData(message.author.id + "-LOGS", JSON.stringify({
            mutes : [],
            kicks: [],
            warns: []
          }))
        } else {
          data = JSON.parse(data)
          if (data.mutes === 0) {
            client.setData(message.author.id + "-LOGS", JSON.stringify({
              mutes : [],
              kicks: [],
              warns: []
            }))
          } 
        }
      })
    }
    if (message.content.indexOf(prefix) !== 0) return;
    // bot commands, verify, bm making
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    // Get the user or member's permission level from the elevation
    const level = client.permlevel(message);
    const cmd = client.commands.get(command.toLowerCase()) || client.commands.get(client.aliases.get(command.toLowerCase()));
    if (!cmd) return
        if (!cmd && message.channel.id != '554145132832620547') return 
    if (cmd) {
      if (level < client.levelCache[cmd.conf.permLevel]) {
        return message.channel.send(`You are unable to run this command. ${cmd.conf.permLevel}+ only.`)
      }
    }
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    try {
      cmd.run(client, message, args, level);
    } catch (e) {
      message.channel.send("Bot Error: DM <@319895945242476546>.")
      console.log(cmd.help.name + " command had an error. " + e)
    }
  })
  client.levelCache = {};
  for (let i = 0; i < config.rankData.length; i++) {
    const thisLevel = config.rankData[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }
  client.login(process.env.token).then(() => {
    console.log("Logged into Discord!")
    // client.channels.get('501860458626547723').send("MY WIFI JUST CUT OUT???")
  })
 // await roblox.cookieLogin(process.env.R_COOKIE)
 // let user = await roblox.getCurrentUser()
  
};
init();
let current = 0
setInterval(() => {
  let myGuild = client.guilds.get(jjstudiosdisc)
  for (x in msgCount) {
    msgCount[x] = 0 
  }
  last3 = {}
  client.getData("Mutes").then(rep => {
    let data = JSON.parse(rep)
    for (mutedUser in data) {
      let muteData = data[mutedUser]
      let now = Date.now()
      if (now - muteData[1] >= muteData[0]) {
        delete data[mutedUser]
        client.setData("Mutes", JSON.stringify(data))
        let guildMember =  myGuild.members.get(mutedUser)
        if (guildMember) {
          let mutedRole = myGuild.roles.find(r => r.name.toLowerCase() == 'muted')
          if (mutedRole) {
            guildMember.removeRole(mutedRole, "Automatic unmute due to time pass").then(member => {
              if (member.user) {
                var embed = new Discord.RichEmbed()
                embed.setTitle("You have been unmuted!")
                embed.setDescription(`You were unmuted in ${myGuild.name}!`)
                embed.setFooter("Get out")
                embed.setColor("GREEN")
                embed.setTimestamp()
                member.user.send({embed}) 
              }
            })
          }
        }
      }
    }
  })
}, 30000)