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
  showScore(){
    let score = this.teams.map(function(team) {

    })
    console.table(score);
  }
  end(){
    let winningPosition = false;
    let teams = this.teams;
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
}
exports.Match = Match;
