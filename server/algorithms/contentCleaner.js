/*
Takes a string of words
Removes "stop words"
Access natural node module to stem
Groups and counts remaining words
Returns object of word: count pairs.
*/
var natural = require('natural');
var tokenizer = new natural.TreebankWordTokenizer();
var wordsToIgnore = require ('./dictionary.js').stopwords;
var testContent = "Macbeth is Shakespeare's shortest tragedy, and tells the story of a brave Scottish general named Macbeth who receives a prophecy from a trio of witches that one day he will become King of Scotland.Consumed by ambition and spurred to action by his wife, Macbeth murders King Duncan and takes the throne for himself. He is then wracked with guilt and paranoia, and he soon becomes a tyrannical ruler as he is forced to commit more and more murders to protect himself from enmity and suspicion.The bloodbath and consequent civil war swiftly take Macbeth and Lady Macbeth into the realms of arrogance, madness, and death.Shakespeare's source for the tragedy is the account of Macbeth, King of Scotland, Macduff, and Duncan in Holinshed's Chronicles (1587), a history of England, Scotland, and Ireland familiar to Shakespeare and his contemporaries, although the events in the play differ extensively from the history of the real Macbeth. In recent scholarship, the events of the tragedy are usually associated more closely with the execution of Henry Garnett for complicity in the Gunpowder Plot of 1605.[1]";

var shortTestContent = "Hello hello, hi hi hi object Object objects objective objectify objectified";

var getWordFrequencyFromString = function(str) {
    var arrDirtyWords = tokenizer.tokenize(str.replace(/[^\w\s]/gi, ' '));
    var arrFilteredWords = filterStopWords(arrDirtyWords);
    var result = groupAndStem(arrFilteredWords);
    //todo: use string distance to find closest 'real word'
    console.log(result);
};


//HELPER FUNCTIONS:

//filter stop words from array of words
var filterStopWords = function(arrTextToFilter) {
    return  arrTextToFilter.filter(function (word) {
        return wordsToIgnore.indexOf(word)  ==-1;
    });
};

// //take content from website and turn into an array of words. Remove whitespace and special characters.
// var removeWhitespaceFromString = function (str) {
//     return str.replace(/[^\w\s]/gi, '').split(' ');
// };

var groupAndStem = function(arrWords) {
    var groupHash = {};
    arrWords.forEach(function(word){
        var stemmed = natural.LancasterStemmer.stem(word.toLowerCase());
        if (groupHash.hasOwnProperty(stemmed)) groupHash[stemmed] +=1;
        else groupHash[stemmed] = Number(1);
    });
    return groupHash;
};

// var hashToStemmerHash = function (hash) {
//     var stemmerHash = {};

//     //loop through properties of hash and create a new hash with unique properties
//     for (var prop in hash) {
//         if (hash.hasOwnProperty(prop)) {
//             //run through stemmer and add to stemmer hash
//             var word = natural.PorterStemmer.stem(prop);
//             console.log(word);
//             if(stemmerHash.hasOwnProperty(word)) {
//                 console.log(stemmerHash[word]);
//                 stemmerHash[word] +=1;
//                 console.log('FOUND ', word, stemmerHash[word]);
//             }
//             else {
//                 console.log("NOT FOUND ", word)
//                 stemmerHash[word] = Number(1);
//             }
//         }
//     }
//     return stemmerHash;
// };

// var sortByValue = function (obj) {
//     return Object.keys(obj).sort(function(a,b) {
//         return obj[a] + obj[b];
//     });
//     //convert array back to object:
// };

// var sortByKey = function (obj) {
//     return Object.keys(obj).sort(function(a,b) {
//         return a + b;
//     });
// };

getWordFrequencyFromString(testContent);
