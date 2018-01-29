const dummyTeams = require('./dummy-teams.json');
const deck = require('./deck.json')
const { Round } = require('./Round')

class Match {
  constructor() {
    this.teams = dummyTeams;
    this.round = null;
    this.deck = deck;
  }
  start() {
    console.log('match start');
    this.round = new Round(this.teams,this.deck);
    this.round.start();
  }
  nextRound() {
    if (matchOver) {
      console.log(`${matchOver.name} WINS!`)
    } else {
      let round = new Round();
      round.start();
    }
  }
}
exports.Match = Match;
