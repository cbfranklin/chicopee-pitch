const { Match } = require('./Match');

const prompt = require('prompt');
prompt.start();

let trick = null;
let round = null;

const showHand = (player) => {
  console.log(`${player.name}'s Turn:`);
  console.table(player.hand)
}

const showTrickStatus = (match) => {
  console.log(`Current Trick:`)
  console.table(trick.cardsPlayed.map(function(card) {
    return {card: card.unicode, 'played by': card.playedBy}
  }))
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

const showScore = (match) => {
  return {team: team.name, score: team.score}
  let score = match.teams.map(function(team) {})
  console.table(score);
}

const matchOver = (match) => {
  let winningPosition = false;
  let teams = match.teams;
  for (team of teams) {
    if (team.score >= 11) {
      winningPosition = true
    }
  }
  if (winningPosition === true) {
    if (abs(teams[0].score - teams[1].score) >= 2) {
      let highestScore = Math.max.apply(Math, teams.map(function(team) {
        return team.score;
      }))
      let winningTeam = teams.filter(function(team) {
        return parseFloat(team.score) === highestScore
      });
      return winningTeam;
    }
  } else {
    return false;
  }
}

const determineTrickWinner = (trick, trumps) => {
  console.log('Determining trick winner...')
  const lead = trick[0];
  // the suit of the card lead is boss, even if not trumps,
  // until someone trumps the trick
  let suitLead = lead.suit;
  console.log(`${suitUnicode(trumps)} is trumps...`)
  console.log(`${lead.unicode} was lead...`)

  let trumped = null;
  //if trumps was not lead, determine if trick was trumped
  if(lead.suit !== trumps){
    let trumped = false;
    for(card of trick){
      if(card.suit === trumps){
        trumped = true;
        break;
      }
    }
  }
  else{
    trumped = true;
  }
  let trickFiltered = null;
  if(trumped){
    // filter for trump cards only
    trickFiltered = trick.filter(function(card){
      return card.suit = trumps
    })
  }
  else{
    //filter for cards of lead suit only
    trickFiltered = trick.filter(function(card){
      return card.suit = lead.suit
    })
  }
  let highestCard = Math.max.apply(Math, trickFiltered.map(function(card) {
    let value = cardValue(card.value);
    return value;
  }))
  let winningCard = trickFiltered.filter(function(card) {
    return parseFloat(cardValue(card.value)) === highestCard
  });
  // console.log(`Winning Card: ${winningCard.unicode}`);
  let winningPlayer = winningCard[0].playedBy;
  console.log(`${winningPlayer} takes the trick!`)
  return winningPlayer;
}

const determineLow = () => {}
const determineHigh = () => {}
const countForGame = () => {}

let match = new Match();
match.start();
