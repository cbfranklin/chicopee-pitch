const prompt = require('prompt');
const console = require('better-console');
const deck = require('./deck.json')

const dummyTeams = require('./dummy-teams.json')

prompt.start()

let trick = null;
let round = null;

class Match {
  constructor() {
    this.teams = dummyTeams;
    this.playerOrder = this.setPlayerOrder(dummyTeams);
  }
  start() {
    console.log('match start');
    round = new Round();
    round.start();
  }
  nextRound() {
    if (matchOver) {
      console.log(`${matchOver.name} WINS!`)
    } else {
      let round = new Round();
      round.start();
    }
  }
  setPlayerOrder(teams) {
    if (teams[0].players.length > 1 || teams[1].players.length > 1) {
      return [teams[0].players[0], teams[1].players[0], teams[0].players[1], teams[1].players[1]]
    }
    return [teams[0].players[0], teams[1].players[0]]
  }
}

class Round extends Match {
  constructor(teams) {
    super(teams);
    this.deck = shuffle(deck);
    this.tricks = [];
    this.playerOrder = null;
  }
  start() {
    console.log('round start')
    this.teams = this.teams.map(team => {
      team.players = team.players.map(player => {
        player.hand = round.dealHand()
        return player
      })
      return team
    })
    round.bid()
  }
  dealHand() {
    if (this.deck.length < 6) {
      throw new Error('not enough cards left to deal')
    } else {
      let hand = this.deck.slice(0, 6);
      // would be cool to get rid of the side-effect of eliminating the cards from the deck
      // but how...
      this.deck = this.deck.slice(6, this.deck.length);
      return hand
    }
  }
  bid() {
    const players = match.playerOrder;
    // console.log(match,match.playerOrder)
    let bids = [];
    // console.log(players)
    turn(0);
    function turn(index) {
      if (index < players.length) {
        const player = players[index];
        showHand(player);
        prompt.get(['bid'], (err, result) => {
          let bid = result.bid;
          if (bid.toUpperCase() === 'P') {
            bid = 0;
          }
          for (let existingBid of bids) {
            if (existingBid.bid > bid && bid != 0) {
              bid = false;
            }
          }
          if (bid === false) {
            console.log(`INVALID BID. BID HIGHER, OR PASS`);
          } else {
            bids.push({player: player.name, bid: bid});
            console.table(bids);
            index++;
          }
          turn(index);
        })
      } else {
        let highestBid = Math.max.apply(Math, bids.map(function(bid) {
          return bid.bid;
        }))
        let winningBid = bids.filter(function(bid) {
          return parseFloat(bid.bid) === highestBid
        });
        winningBid = winningBid[0];
        setDealer(winningBid.player);
      }
    }
  }
}

class Trick extends Round {
  constructor(){
    super();
    this.cardsPlayed = [];
    this.trumps = null;
  }
  start() {
    this.cardsPlayed = [];
    console.log('trick start')
    if (this.tricks.length > 7) {
      return true;
    }
    console.log(`Trick #${this.tricks.length + 1}:`)
    const players = match.playerOrder;
    //console.log(players)
    turn(0);
    function turn(index) {
      if (index < players.length) {
        const player = players[index];
        showHand(player);
        prompt.get([
          'value', 'suit'
        ], (err, result) => {
          if (playCard(player, result.value.toUpperCase(), result.suit.toUpperCase())) {
            index++;
            console.table(showTrickStatus(match))
          } else {
            console.log(`YOU DONT HAVE THAT CARD`)
          }
          turn(index)
        })
      } else {
        determineTrickWinner(trick.cardsPlayed, trick.trumps)
      }
    }
  }
}

const shuffle = (deck) => deck.sort(() => (Math.random() - 0.5));

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

const playCard = (player, value, suit) => {
  const hand = player.hand;
  let i;
  let cardToBePlayed = false;
  for (i = hand.length - 1; i >= 0; i -= 1) {
    const card = hand[i];
    if (card.value === value && card.suit === suit) {
      cardToBePlayed = card;
      // console.log(`Playing the ${cardToBePlayed.text}`)
      cardToBePlayed.playedBy = player.name;
      trick.cardsPlayed.push(cardToBePlayed);
      hand.splice(i, 1);
      break;
    }
  }
  return cardToBePlayed;
}

const findIndexOfObjByParam = (array, param, value) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][param] === value) {
      return i;
    }
  }
  return -1;
}

const setDealer = (playerName) => {

  const reorder = (data, index) => {
    return data.slice(index).concat(data.slice(0, index))
  };
  console.log(`${playerName} leads!`)
  match.playerOrder = reorder(match.playerOrder, findIndexOfObjByParam(match.playerOrder, 'name', playerName));
  chooseTrumps(match.playerOrder[0])
}

const chooseTrumps = (player) => {
  showHand(player)
  console.log(`What is trumps?`)
  prompt.get(['suit'], (err, result) => {
    let trumps = result.suit.toUpperCase()
    console.log(`${suitUnicode(trumps)} is trumps!`);
    trick = new Trick();
    trick.trumps = trumps;
    trick.start()
  })
}

const suitUnicode = (letter) => {
  letter = letter.toUpperCase();
  const unicode = {
    S: '♠',
    H: '♥',
    D: '♦',
    C: '♣'
  }
  if (Object.keys(unicode).indexOf(letter) < 0) {
    throw new Error('invalid suit passed to suitUnicode, must be either S, H, D, or C')
  } else {
    return unicode[letter]
  }
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
