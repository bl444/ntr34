function jsonToArray(obj) {
  let arr = []
  for (let i in obj) {
   arr.push([i, obj[i]]) 
  }
  return arr
}

const config = {
  "apeOwner": "319895945242476546",
  rankData: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 1,
      name: "Member",

      check: () => true
    },
    { level: 3,
      name: "Trial Mod",

        check: (message, client) => {
       if (!message.member) return false
        if (message.member.roles.get('943252380852568134')) {
         return true 
        } else {
         return false 
        }
      }
    },
    { level: 4,
      name: "Moderator",

       check: (message, client) => {
       if (!message.member) return false
        if (message.member.roles.get('863908994338652161')) {
         return true 
        } else {
         return false 
        }
      }
    },
    

    { level: 230809210121,
      name: "Chief",

     check: (message, client, data) => {
        return message.author.id == "319895945242476546"
      }
    }
  ],
};

module.exports = config;
