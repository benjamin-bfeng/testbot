const use = require("@tensorflow-models/universal-sentence-encoder")
var referenceEmbeddings;

use.load().then(model => {
  // Embed an array of sentences.
  const sentences = [
    'you piece of shit',
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
    ''
  ];
  model.embed(sentences).then(embeddings => {
    embeddings.array().then(array => referenceEmbeddings = array);
  });
});

async function isOffensive(transcription) {
  
}

exports.isOffensive = isOffensive;