const {MongoClient} = require('mongodb')
const mongoConfig = require('./mongo-auth')

const uri = `mongodb+srv://admin:${mongoConfig.mongoPassword}@cluster0-pnw5h.mongodb.net/test?retryWrites=true&w=majority`;
var mongoClient = null
MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
  mongoClient = res
})

function punish(member, currentPenalties) {
  if (currentPenalties === 1) {
    member.send("Hey! Watch your language. :) This is your first warning.")
      .then(() => console.log(`Messaged ${member.displayName}`))
  } if (currentPenalties === 2) {
    member.send("Remember to watch your language. This is your second warning. The next infraction will result in a temporary ban.")
      .then(() => console.log(`Messaged ${member.displayName}`))
  } if (currentPenalties >= 3) {
    member.send("You have been banned for one day due to inappropriate language.")
      .then(() => console.log(`Messaged ${member.displayName}`))
    member.ban(1)
      .then(() => console.log(`Banned ${member.displayName}`))
  }
}

async function penalize(member) {
  userId = member.id;
  const collection = mongoClient.db("users").collection("penalties");
  const user = await collection.findOne({id: userId});
  console.log(user);
  var currentPenalties = user ? user.penalties + 1 : 1;
  if (user) {
    collection.updateOne({id: userId}, {$set: {penalties: currentPenalties}})
  } else {
    collection.insertOne({id: userId, penalties: currentPenalties})
  }
  punish(member, currentPenalties);
}

function reset() {
  const collection = mongoClient.db("users").collection("penalties");
  collection.drop();
}

exports.penalize = penalize;
exports.reset = reset;