/*
Takes a string of words
Removes "stop words"
Access natural node module to stem
Groups and counts remaining words
Returns object of word: count pairs.
*/
var _ = require('lodash');
var natural = require('natural');
var tokenizer = new natural.TreebankWordTokenizer();
var wordsToIgnore = require ('./dictionary.js').stopwords;


var testContent = "Macbeth is Shakespeare's shortest tragedy, and tells the story of a brave Scottish general named Macbeth who receives a prophecy from a trio of witches that one day he will become King of Scotland.Consumed by ambition and spurred to action by his wife, Macbeth murders King Duncan and takes the throne for himself. He is then wracked with guilt and paranoia, and he soon becomes a tyrannical ruler as he is forced to commit more and more murders to protect himself from enmity and suspicion.The bloodbath and consequent civil war swiftly take Macbeth and Lady Macbeth into the realms of arrogance, madness, and death.Shakespeare's source for the tragedy is the account of Macbeth, King of Scotland, Macduff, and Duncan in Holinshed's Chronicles (1587), a history of England, Scotland, and Ireland familiar to Shakespeare and his contemporaries, although the events in the play differ extensively from the history of the real Macbeth. In recent scholarship, the events of the tragedy are usually associated more closely with the execution of Henry Garnett for complicity in the Gunpowder Plot of 1605.[1]";

var shortTestContent = "Hello hello, 123 45 object Object objects objective objectify objectified";

//
var getWordFrequencyFromString = function(str, maxNumWords) {
    console.time('getWordFrequencyFromString')
    str = str.replace(/[0-9]/g,'');
    var arrDirtyWords = tokenizer.tokenize(str.replace(/[^\w\s]/gi, ' '));
    //console.log('num words before filter', arrDirtyWords.length);
    var arrFilteredWords = filterStopWords(arrDirtyWords);
    // console.log('num words after filter', arrFilteredWords.length);
    // console.time('buildStemmerHash');
    var sHash = buildStemmerHash(arrFilteredWords);
    // console.timeEnd('buildStemmerHash');
    // console.time('buildEnglishHash');
    var englishHash = buildEnglishHash(arrFilteredWords);
    //console.timeEnd('buildEnglishHash');
    var sortedHash = sortAndTrim(englishHash, maxNumWords);
    console.timeEnd('getWordFrequencyFromString');
    return sortedHash;
};


//HELPER FUNCTIONS:

//filter stop words from array of words
var filterStopWords = function(arrTextToFilter) {
    return  arrTextToFilter.filter(function (word) {
        return wordsToIgnore.indexOf(word)  ===-1;
    });
};

var buildStemmerHash = function(arrWords) {
    var stemmerHash = {};
    arrWords.forEach(function(word){
        var stemmed = natural.LancasterStemmer.stem(word.toLowerCase());
        //add to stemmerHash:
        if (stemmerHash.hasOwnProperty(stemmed)) stemmerHash[stemmed] +=1;
        else stemmerHash[stemmed] = Number(1);
    });
    return stemmerHash;
};

var buildReverseDict = function(arrWords) {
    var reverseDictionary = {};
    arrWords.forEach(function(word){
        var stemmed = natural.LancasterStemmer.stem(word.toLowerCase());
        //add to reverseDictionary:
        if (reverseDictionary.hasOwnProperty(stemmed)){
            var curArr = reverseDictionary[stemmed];
            if (curArr.indexOf(word.toLowerCase()) === -1) {
                curArr.push(word.toLowerCase());
            }
        }
        else {
            reverseDictionary[stemmed] = [word.toLowerCase()];
        }
    });
    return reverseDictionary;
};

//combine StemmerHash and ReverseDict
var buildEnglishHash = function(arrWords) {
    var stemmerHash = {};
    var reverseDictionary = {};
    arrWords.forEach(function(word){
        var stemmed = natural.LancasterStemmer.stem(word.toLowerCase());
        //add to reverseDictionary:
        if (reverseDictionary.hasOwnProperty(stemmed)){
            var curArr = reverseDictionary[stemmed];
            if (curArr.indexOf(word.toLowerCase()) === -1) {
                curArr.push(word.toLowerCase());
            }
            stemmerHash[stemmed] +=1;
        }
        else {
            reverseDictionary[stemmed] = [word.toLowerCase()];
            stemmerHash[stemmed] = Number(1);
        }
    });
    var englishHash = {}
    //loop through stemmed keys
    Object.keys(reverseDictionary).forEach(function(stemmer){
        var bestmatch = "", distClosest = 0;
        //for each valuearr at key, generate array of {dist: word}
        for(var i = 0; i < reverseDictionary[stemmer].length; i ++) {
            var curWord = reverseDictionary[stemmer][i];
            var dist = natural.JaroWinklerDistance(stemmer, curWord);
            if (dist === 1) {
                bestmatch = curWord;
                break;
            }
            if (dist > distClosest) bestmatch = curWord;
        }
        englishHash[bestmatch] = stemmerHash[stemmer];
    });
    //remove all stopWords that may have creeped in from stemming
    wordsToIgnore.forEach(function(wordToIgnore) {
        if (englishHash.hasOwnProperty(wordToIgnore))
            delete englishHash[wordToIgnore];
    });

    Object.keys(englishHash).forEach(function(key) {
        if(key.length < 2) delete englishHash[key];
    });

    return englishHash;
};

var sortAndTrim = function (obj, numKeys) {
    var arr = _.pairs(obj).sort(function(a, b) {
        return b[1] - a[1];
    });
    if(numKeys) {
        arr = arr.splice(0, numKeys);
    }
    return _.object(arr);
    //return arr;
};

//getWordFrequencyFromString(testContent);
module.exports = function(str, maxNumWords) {
    return getWordFrequencyFromString(str, maxNumWords);
};
