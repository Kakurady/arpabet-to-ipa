"use strict";
let ArpabetToIpaTable = {
  "AA": "ɑ",
  "AE": "æ",
  "AH": "ʌ",
  "AO": "ɔ",
  "AW": "aʊ",
  "AX": "ə",
  "AXR": "ɚ",
  "AY": "aɪ",
  "EH": "ɛ",
  "ER": "ɝ",
  "EY": "eɪ",
  "IH": "ɪ",
  "IX": "ɨ",
  "IY": "i",
  "OW": "oʊ",
  "OY": "ɔɪ",
  "UH": "ʊ",
  "UW": "u",
  "UX": "ʉ",
  "B": "b",
  "CH": "tʃ",
  "D": "d",
  "DH": "ð",
  "DX": "ɾ",
  "EL": "l̩",
  "EM": "m̩",
  "EN": "n̩",
  "F": "f",
  "G": "ɡ",
  "HH": "h",
// arpasing doesn't use H
  "JH": "dʒ",
  "K": "k",
  "L": "l",
  "M": "m",
  "N": "n",
  "NG": "ŋ",
//  "NX": "ɾ̃",
  "P": "p",
  "Q": "ʔ",
  "R": "ɹ",
  "S": "s",
  "SH": "ʃ",
  "T": "t",
  "TH": "θ",
  "V": "v",
  "W": "w",
  "WH": "ʍ",
  "Y": "j",
  "Z": "z",
  "ZH": "ʒ",
};

let ArpabetToIpaTableCaseInsensitive = {...ArpabetToIpaTable};
for (const key in ArpabetToIpaTable){
   ArpabetToIpaTableCaseInsensitive[key.toLowerCase()] = ArpabetToIpaTable[key];
}

let arr = [
  "aɪ",
  "aʊ",
  "b",
  "d",
  "dʒ",
  "eɪ",
  "f",
  "h",
  "i",
  "j",
  "k",
  "l",
  "l̩",
  "m",
  "m̩",
  "n",
  "n̩",
  "oʊ",
  "p",
  "s",
  "t",
  "tʃ",
  "u",
  "v",
  "w",
  "z",
  "æ",
  "ð",
  "ŋ",
  "ɑ",
  "ɔ",
  "ɔɪ",
  "ə",
  "ɚ",
  "ɛ",
  "ɝ",
  "ɡ",
  "ɨ",
  "ɪ",
  "ɹ",
  "ɾ",
  "ɾ̃",
  "ʃ",
  "ʉ",
  "ʊ",
  "ʌ",
  "ʍ",
  "ʒ",
  "ʔ",
  "θ"
];

function compareKeys(a, b){
  // longer text comes first
  if (a.length != b.length){
    return b.length - a.length;
  }
  // sort the rest alphabetically
  if (a < b) {return -1;}
  if (a > b) {return 1; }
  return 0;
}

function* maximumMatch(str, dict){
  if (!str || !str.length){return;}
  let keys = Object.keys(dict);
  keys.sort(compareKeys);

  // iterate over the string to tokenize.
  let i = 0 ;
  while(i < str.length){
    let found = false;
    // try tokens from longest to shortest.
    for (let j = 0; j < keys.length; j++){
      let key = keys[j];
      if (str.startsWith(key, i)){
        found = true;
        yield key;
        i += key.length;
      }
    }
    // if no token found, return a single character.
    if (!found){
      yield str.slice(i, i+1);
      i++;
    }
  }
}

function dictToRegEx(dict){
  let keys = Object.keys(dict);
  keys.sort(compareKeys);
  let pattern = keys.join("|");
  let re = new RegExp(`$(pattern)`, "g");
  return re;
}


function ArpabetToIpa(str){
  let table = ArpabetToIpaTableCaseInsensitive;
  function* strip_spaces (itor){
    let last = [];
    for (const token of itor){
      last.push(token);

      while (last.length >= 3){
        if (last[0] in table && last[1] == " " && last[2] in table){
          yield last.shift();
          last.shift();
        } else {
          yield last.shift();
        }
      } // while
    } // for
    yield* last;
  }
  let tokens = [...strip_spaces(maximumMatch(str, table))];

  return tokens.map(x=>(x in table? table[x]: x)).join("");
}

let srcPhon = ko.observable();
let dest = ko.computed(function _dest(){ return ArpabetToIpa(srcPhon()); } );

let viewmodel = {
  srcPhon, dest
};
ko.applyBindings(viewmodel);
