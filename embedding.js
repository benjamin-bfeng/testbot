const use = require("@tensorflow-models/universal-sentence-encoder")
var referenceEmbeddings;

use.load().then(model => {
  // Embed an array of sentences.
  const sentences = [
    'you piece of shit',
    'piece of shit',
    'fuck',
    'god damn it',
    'go die in hell',
    'fucking homosexuals',
    'i would dick her down',
    'suck my dick',
    'fuck off',
    'i wanna fucking kill ben',
    'i want him to suffer in hell',
    'go to hell',
    'kill yourself',
    'go fuck yourself',
    'gay',
    'son of a bitch',
    'motherfucker',
    'homosexuals deserve to die',
    'i want to murder every single jew alive',
    'if i could i would shoot you',
    'i want to punch your fucking face',
    'you don\'t deserve to live',
    'concentration camps are a jew\'s best friend',
    'what a raggy fag',
    'wanna bag them fags',
    'what a noob go die',
    'you\'re a waste of oxygen',
    'that band is so gay',
    'those guys are fags',
    'no homo',
    'i don\'t like gays',
    'you should go die',
    'stop acting so gay',
    'you are disgusting',
    'i am repelled by people like them',
    'they are disgusting',
    'they are fucking weird',
    'i don\'t want to be associated with them',
    'they\'re too different',
    'they are not like us',
    'they are not normal',
    'i hate those types of people',
    'they are below us',
    'i would never associate with that kind of person',
    'they can burn in hell',
    'they can burn in hell for all i care',
    'god fucking damn it',
    'you are so weird',
    'queer lives do not matter',
    'you don\'t matter',
    'you do not matter',
    'no one cares about you',
    'nobody would blink an eye if you died',
    'you\'re worthless',
    'you are worthless',
    'stupid dumbass',
    'worthless bastard',
    'worhtless piece of shit',
    'what a fag',
    'where are your balls',
    'grow a pair',
    'grow a pair of balls',
    'he\'s retarded',
    'they\'re so stupid',
    'what a bunch of idiots',
    'your life is worthless'
  ];
  model.embed(sentences).then(embeddings => {
    embeddings.array().then(array => referenceEmbeddings = array);
  });
});

// function computeMagnitudes(v1,v2){
//   var mag1 = 0;
//   var mag2 = 0;
//   var magres = 0;
//   var vres =  v1.map((x, i) => x - v2[i]);
//   for(var i = 0; i<vres.length; i++){
//     mag1 += v1[i]*v1[i]
//     mag2 += v2[i]*v2[i]
//     magres += vres[i]*vres[i]
//   }
//    mag1 = Math.sqrt(mag1)
//    mag2 = Math.sqrt(mag2)
//    magres = Math.sqrt(magres)
//   return [mag1, mag2, magres]
// }

function dot(v1, v2) {
  return v1.reduce((a, x, i) => a + x * v2[i])
}
async function isOffensive(transcription) {
  //console.log(referenceEmbeddings);
  let promise = new Promise((resolve, reject) => {
    use.load().then(model => {
      // Embed an array of sentences.
      const sentences = [transcription]
      model.embed(sentences).then(embeddings => {
        embeddings.array().then(array => {
          //console.log(array[0]);
          for (let v of referenceEmbeddings) {
            let similarity = dot(array[0], v)
             console.log(similarity)
             if (similarity >= 0.75){
              resolve(true);
             }
          }
          resolve(false);
        });
      });
    });
  })
  return promise; 
}
exports.isOffensive = isOffensive
