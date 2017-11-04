// ==UserScript==
// @name        sadpanda name flipper
// @namespace   spacename
// @description sometimes fixes name orders, sometimes messes them up
// @include     https://exhentai.org/g/*
// @version     1
// @grant       none
// ==/UserScript==

// letter combinations form romanizing Japanese words
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

// memes
const memes = [
  'Anal Aficionado',
  'Baby Batter Bladder',
  'Ballsack Knapsack',
  'Boner Toner',
  'Cock Sock',
  'Erection Confection',
  'Fluid Druid',
  'Jizz Wiz',
  'Lewd Lieutenant',
  'Mattress Actress',
  'Penis Machinist ',
  'Phallus Chalice',
  'Prostate Magistrate',
  'Rear Admiral',
  'Salami Tsunami',
  'Scrotum Totem',
  'Semen Demon',
  'Shaft Shaft',
  'Sperm Worm',
  'Spunk Monk',
  'Testicle Vestibule',
  'Wang Wrangler',
  'Weenie Genie',
];

function replaceNames() {
  var elements = document.querySelectorAll('[id^="ta_character:"]');
  for (var i = 0; i < elements.length; i++) {
    var name = elements[i].innerHTML;
    var names = name.split(' ');
    // only consider ones with exactly two names
    if (names.length == 2) {
      var flipName = false;
      if (looksJapanese(names[0]) && looksJapanese(names[1])) {
        // name should be flipped
        flipName = true;
        // change the border color so we know it was flipped
        elements[i].parentElement.style['border-color'] = '#559999';
      }
      // modify the name in the page
      var meme = getMeme(names.join(' '));
      elements[i].innerHTML = names[flipName ? 1 : 0] + ' "' + meme + '" ' + names[flipName ? 0 : 1];
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

// based on https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
function getMeme(s) {
  var hash = 0;
  if (s.length == 0) return hash;
  for (var i = 0; i < s.length; i++) {
    char = s.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  var index = hash % memes.length;
  if (index < 0) {
    index += memes.length;
  }
  return memes[index];
}

replaceNames();
