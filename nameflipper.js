// ==UserScript==
// @name        name fixer
// @namespace   spacename
// @description sometimes fixes name orders, sometimes messes them up
// @include     https://exhentai.org/g/*
// @version     1
// @grant       none
// ==/UserScript==

// sounds that exist in Japanese
const japaneseArray = [
  'n', 
  'a', 'ka'      , 'ga', 'sa' , 'za', 'ta' , 'da' , 'na', 'ha', 'ba', 'pa', 'ma', 'ya', 'ra', 'wa',
  'i', 'ki'      , 'gi', 'shi', 'ji', 'chi', 'di' , 'ni', 'hi', 'bi', 'pi', 'mi'      , 'ri'      ,
  'u', 'ku'      , 'gu', 'su' , 'zu', 'tsu', 'dzu', 'nu', 'fu', 'bu', 'pu', 'mu', 'yu', 'ru'      ,
  'e', 'ke'      , 'ge', 'se' , 'ze', 'te' , 'de' , 'ne', 'he', 'be', 'pe', 'me'      , 're'      ,
  'o', 'ko', 'co', 'go', 'so' , 'zo', 'to' , 'do' , 'no', 'ho', 'bo', 'po', 'mo', 'yo', 'ro', 'wo',
  'kya', 'gya', 'sha', 'sya', 'ja', 'cha', 'nya', 'hya', 'bya', 'pya', 'mya', 'rya',
  'kyu', 'gyu', 'shu', 'syu', 'ju', 'chu', 'nyu', 'hyu', 'byu', 'pyu', 'myu', 'ryu',
  'kyo', 'gyo', 'sho', 'syo', 'jo', 'cho', 'nyo', 'hyo', 'byo', 'pyo', 'myo', 'ryo',
];
const japanese = new Set(japaneseArray);
const repeats = new Set(['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'p', 'r', 's', 't', 'w', 'z']);

function replaceNames() {
  var elements = document.querySelectorAll('[id^="ta_character:"]');
  for (var i = 0; i < elements.length; i++) {
    var name = elements[i].innerHTML;
    var names = name.split(' ');
    // only consider ones with exactly two names
    if (names.length == 2) {
      if (looksJapanese(names[0]) && looksJapanese(names[1])) {
        // flip the name
        elements[i].innerHTML = names[1] + ' ' + names[0];
        // change the border color so we know it was flipped
        elements[i].parentElement.style["border-color"] = "#559999"
      }
    }
  }
}

function looksJapanese(name) {
  //console.log('checking ' + name);
  for (var i = 0; i < name.length; i++) {
    // check for 1 letter sounds: a, i, n, etc
    var a1 = name[i];
    if (japanese.has(a1)) {
      //console.log('\t' + a1 + ' looks japanese');
      continue;
    }
    
    // check for 2 letter sounds: ka, ba, ha, etc
    if (i + 1 < name.length) {
      var a2 = name[i] + name[i+1];
      if (japanese.has(a2)) {
        //console.log('\t' + a2 + ' looks japanese');
        continue;
      }
    }
    
    // check for 3 letter sounds: kya, tsu, pyu, etc
    if (i + 2 < name.length) {
      var a3 = name[i] + name[i+1] + name[i+2];
      if (japanese.has(a3)) {
        //console.log('\t' + a3 + ' looks japanese');
        continue;
      }
    }
    
    // check for っ: oPpai, maTte, doCchi, etc
    if (i + 1 < name.length) {
      var a1 = name[i];
      var a2 = name[i+1];
      if (a1 == a2 && repeats.has(a1)) {
        //console.log('\t' + a1 + a2 + ' looks japanese');
        continue;
      }
    }
    
    // this doesn't look Japanese
    //console.log('\t' + a1 + ' doesn\'t look japanese');
    return false;
  }
  // didn't find anything obviously not Japanese, assume it is
  return true;
}

replaceNames();
