const { showHand,suitUnicode,cardValue } = require('./globals');

const prompt = require('prompt');

class Trick{
  constructor(playerOrder){
    this.cardsPlayed = [];
    this.trumps = null;
    this.tricks = 0;
    this.playerOrder = playerOrder;
  }
  start() {
    this.tricks += 1;
    console.log('trick start', this.tricks)
    if (this.tricks.length > 7) {
      return true;
    }
    console.log(`Trick #${this.tricks}:`)
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
      this.determineTrickWinner()
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
    console.log(`${suitUnicode(trumps)} is trumps...`)
    console.log(`${lead.unicode} was lead...`)

    let trumped = null;
    //if trumps was not lead, determine if trick was trumped
    if(lead.suit !== trumps){
      let trumped = false;
      for(card of this.cardsPlayed){
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
}
exports.Trick = Trick;
