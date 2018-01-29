const prompt = require('prompt');
const console = require('better-console');

const { Trick } =  require('./Trick')

const { showHand,suitUnicode } = require('./globals');

class Round {
  constructor(teams,deck) {
    this.deck = this.shuffle(deck);
    this.tricks = [];
    this.playerOrder = null;
    this.teams = teams;
  }
  start() {
    console.log('round start')
    this.deal();
  }
  shuffle(deck) {
    deck = deck.sort(() => (Math.random() - 0.5))
    // console.log('shuffle deck', deck)
    return deck;
  }
  deal() {
    //console.log('this', this)
    for (let team of this.teams) {
      for (const player of team.players) {
        let hand = this.deck.splice(0, 7);
        this.deck = this.deck.slice(0, 7);
        player.hand = hand;
        // console.log(player)
      }
    }
    this.playerOrder = [
      this.teams[0].players[0],
      this.teams[1].players[0]
    ];
    //console.log(match.playerOrder)
    this.bid();
  }
  bid() {
    const players = this.playerOrder;
    // console.log(match,match.playerOrder)
    this.bids = [];
    // console.log(players)
    this.turn(0);
  }
  turn(index) {
    const players = this.playerOrder;
    if (index < players.length) {
      const player = players[index];
      showHand(player);
      prompt.get(['bid'], (err, result) => {
        let bid = result.bid;
        if (bid.toUpperCase() === 'P') {
          bid = 0;
        }
        for (let existingBid of this.bids) {
          if (existingBid.bid > bid && bid != 0) {
            bid = false;
          }
        }
        if (bid === false) {
          console.log(`INVALID BID. BID HIGHER, OR PASS`);
        } else {
          this.bids.push({player: player.name, bid: bid});
          console.table(this.bids);
          index++;
        }
        this.turn(index);
      })
    } else {
      let highestBid = Math.max.apply(Math, this.bids.map(function(bid) {
        return bid.bid;
      }))
      let winningBid = this.bids.filter(function(bid) {
        return parseFloat(bid.bid) === highestBid
      });
      winningBid = winningBid[0];
      console.log(winningBid)
      this.setDealer(winningBid.player);
    }
  }
  setDealer(playerName){
    const reorder = (data, index) => {
      return data.slice(index).concat(data.slice(0, index))
    };
    console.log(`${playerName} leads!`)
    console.log('teams',this.teams);
    console.log("playerOrder", this.playerOrder)
    this.playerOrder = reorder(this.playerOrder, findIndexOfObjByParam(this.playerOrder, 'name', playerName));
    this.chooseTrumps(this.playerOrder[0])
  }
  chooseTrumps(player){
    showHand(player)
    console.log(`What is trumps?`)
    prompt.get(['suit'], (err, result) => {
      let trumps = result.suit.toUpperCase()
      console.log(`${suitUnicode(trumps)} is trumps!`);
      let trick = new Trick(this.playerOrder);
      trick.trumps = trumps;
      trick.start()
    })
  }
}
exports.Round = Round;



const findIndexOfObjByParam = (array, param, value) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][param] === value) {
      return i;
    }
  }
  return -1;
}
