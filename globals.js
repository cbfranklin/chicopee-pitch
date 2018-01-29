const showHand = (player) => {
  console.log(`${player.name}'s Turn:`);
  console.log(player.hand)
  // console.table(player.hand)
}

const suitUnicode = (letter) => {
  letter = letter.toUpperCase();
  const unicode = {
    S: '♠',
    H: '♥',
    D: '♦',
    C: '♣'
  }
  return unicode[letter]
}

const cardValue = (value) => {
  // console.log('cardValue',value)
  const faceCards = [
    {
      value: 'A',
      number: 14
    }, {
      value: 'K',
      number: 13
    }, {
      value: 'Q',
      number: 12
    }, {
      value: 'J',
      number: 11
    }
  ];

  const numberCards = [2,3,4,5,6,7,8,9,10];

  if(numberCards.includes(parseFloat(value))){
    return value;
  }
  else{
    var number = faceCards.filter(function(card) {
      return card.value == value;
    });
    return number[0].number;
  }
}

const findIndexOfObjByParam = (array, param, value) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][param] === value) {
      return i;
    }
  }
  return -1;
}

const reorder = (data, index) => {
  return data.slice(index).concat(data.slice(0, index))
};

const gameValue = (value) => {
  // console.log('cardValue',value)
  const faceCards = [
    {
      value: 'A',
      number: 4
    }, {
      value: 'K',
      number: 3
    }, {
      value: 'Q',
      number: 2
    }, {
      value: 'J',
      number: 1
    },
    {
      value: '10',
      number: 10
    }
  ];

  const numberCards = [2,3,4,5,6,7,8,9];

  if(numberCards.includes(parseFloat(value))){
    return 0;
  }
  else{
    var number = faceCards.filter(function(card) {
      return card.value == value;
    });
    return number[0].number;
  }
}

// exports = {
//   showHand: showHand
// }
//
exports.showHand = showHand;
exports.suitUnicode = suitUnicode;
exports.cardValue = cardValue;
exports.findIndexOfObjByParam = findIndexOfObjByParam;
exports.reorder = reorder;
