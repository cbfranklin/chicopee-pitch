const prompt = require('prompt');
const console = require('better-console');

// const { Trick } =  require('./Trick')

const { showHand,suitUnicode,findIndexOfObjByParam,cardValue,reorder } = require('./globals');

class Round {
  constructor(teams,deck) {
    this.deck = this.shuffle(deck);
    this.tricks = 0;
    this.playerOrder = null;
    this.teams = teams;
    this.trumps = null
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
    console.log(`${playerName} leads!`)
    console.log('teams',this.teams);
    console.log("playerOrder", this.playerOrder)
    // should reorder players, allowing winning player to lead next trick
    this.playerOrder = reorder(this.playerOrder, findIndexOfObjByParam(this.playerOrder, 'name', playerName));
    this.chooseTrumps(this.playerOrder[0])
  }
  chooseTrumps(player){
    showHand(player)
    console.log(`What is trumps?`)
    prompt.get(['suit'], (err, result) => {
      let trumps = result.suit.toUpperCase()
      console.log(`${suitUnicode(trumps)} is trumps!`);
      this.tricks += 1;
      this.trumps = trumps;
      this.trick = new Trick(this.playerOrder, this.tricks, this.trumps);
      this.trick.start()
    })
  }
  nextTrick(){
    this.tricks += 1;
    this.trick = new Trick(this.playerOrder, this.tricks, this.trumps);
    this.trick.start();
  }
  determineRoundWinner(){
    // define trumps locally
    const trumps = this.trumps;
    // all cards played
    const allCardsPlayed = () => {
      let cards = [];
      for(let team of this.teams){
        for(let player of team.players){
          cards = cards.concat(player.won)
        }
      }
      return cards;
    }
    // all trumps played
    const allTrumpsPlayed = allCardsPlayed().filter(function(card){
      return card.suit = trumps;
    });

    const determineLow = (allTrumpsPlayed) => {
      let hash = [];
      for(let card in allTrumpsPlayed){
        
      }
    }
    const determineHigh = (allTrumpsPlayed) => {

    }
    // determine if jack was dealt
    const isJackOut = (allTrumpsPlayed) => {
      for(let card in allTrumpsPlayed){
        if(this.value === 'J'){
          return true;
          break;
        }
      }
      return false;
    }

    const countForGame = () => {

      for(let team of this.teams){
        team.pointsOfGame = 0;
        for(let player of team.players){
          for(let card of player.won){
            team.pointsOfGame += gameValue(card)
          }
        }
      }

      console.log(this.teams)

    }
    const roundScore = () => {}
  }
}

class Trick{
  constructor(playerOrder,tricks,trumps){
    this.cardsPlayed = [];
    this.trumps = trumps;
    this.tricks = tricks;
    this.playerOrder = playerOrder;
  }
  start() {
    console.log(`Trick #${this.tricks}:`)
    console.log(this.trumps,'is trumps')
    const players = this.playerOrder;
    //console.log(players)
    this.turn(0);
  }
  turn(index){
    if (index < this.playerOrder.length) {
      const player = this.playerOrder[index];
      showHand(player);
      prompt.get([
        'value', 'suit'
      ], (err, result) => {
        if (this.playCard(player, result.value.toUpperCase(), result.suit.toUpperCase())) {
          index++;
          console.table(this.showStatus())
        } else {
          console.log(`YOU DONT HAVE THAT CARD`)
        }
        this.turn(index)
      })
    } else {
      // determine winner
      const winner = this.determineTrickWinner();
      // should reorder
      this.playerOrder = reorder(this.playerOrder, findIndexOfObjByParam(this.playerOrder, 'name', winner));
      const winnerIndex = findIndexOfObjByParam(this.playerOrder, 'name', winner);
      //console.log(winnerIndex)
      match.round.playerOrder[winnerIndex].won.push(this.cardsPlayed);
      if(this.tricks < 7){
        match.round.nextTrick();
      }
      else{
        console.log('END OF ROUND!!!')
        match.round.determineRoundWinner();
      }

    }
  }
  playCard(player, value, suit){
    const hand = player.hand;
    let i;
    let cardToBePlayed = false;
    for (i = hand.length - 1; i >= 0; i -= 1) {
      const card = hand[i];
      if (card.value === value && card.suit === suit) {
        cardToBePlayed = card;
        // console.log(`Playing the ${cardToBePlayed.text}`)
        cardToBePlayed.playedBy = player.name;
        this.cardsPlayed.push(cardToBePlayed);
        hand.splice(i, 1);
        break;
      }
    }
    return cardToBePlayed;
  }
  showStatus(){
    console.log(`Current Trick:`)
    console.table(this.cardsPlayed.map(function(card) {
      return {card: card.unicode, 'played by': card.playedBy}
    }))
  }

  determineTrickWinner(){
    console.log('Determining trick winner...')
    const trumps = this.trumps;
    const lead = this.cardsPlayed[0];
    // the suit of the card lead is boss, even if not trumps,
    // until someone trumps the trick
    let suitLead = lead.suit;
    console.log('trumps',trumps)
    console.log('suitLead',suitLead)
    console.log(`${suitUnicode(trumps)} is trumps...`)
    console.log(`${lead.unicode} was lead...`)

    let trumped = null;
    //if trumps was not lead, determine if trick was trumped
    if(lead.suit !== trumps){
      let trumped = false;
      console.log(this.cardsPlayed)
      for(let card of this.cardsPlayed){
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
      trickFiltered = this.cardsPlayed.filter(function(card){
        return card.suit = trumps
      })
    }
    else{
      //filter for cards of lead suit only
      trickFiltered = this.cardsPlayed.filter(function(card){
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
}

exports.Round = Round;
