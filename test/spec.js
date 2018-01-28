const mocha = require('mocha')
const assert = require('chai').assert
const dummyTeams = require('../dummy-teams.json')
const Game = require('../pitch.js')
const util = require('util')
const _ = require('lodash')

const Match = Game.Match
const Round = Game.Round
const suitUnicode = Game.suitUnicode
const matchOver = Game.matchOver
const determineMatchWinner = Game.determineMatchWinner

describe('spec', () => {
  describe('class Match', () => {
    let testMatch = undefined
    beforeEach(function(){
      testMatch = new Match(dummyTeams)
    })
    it('should exist', () => {
      let actual = testMatch.constructor.name
      let expected = 'Match'
      assert.equal(actual, expected)
    })

    describe('Match#start', () => {
      it('should exist', () => {
        let actual = typeof testMatch.start
        let expected = 'function'
        assert.equal(actual, expected)
      })
      it('should set player order according to the number of players', () => {
        testMatch.start()
        let playerOrder = testMatch.playerOrder.map(player => player.name)
        let expectedOrder = ['Connor', 'Andy']
        let actual = _.isEqual(playerOrder, expectedOrder)
        let expected = true
        assert.equal(actual, expected)
      })
      it('should deal hands to all players', () => {
        testMatch.start()
        let actual = true
        let expected = true
        testMatch.teams.forEach(team => {
          team.players.forEach(player => {
            if (player.hand.length < 6) {
              actual = false
            }
          })
        })
        assert.equal(actual, expected)
      })
    })
  })

  describe('class Round', () => {

    let testRound = undefined
    beforeEach(() => {
      testRound = new Round()
    })

    it('should exist', () => {
      let actual = testRound.constructor.name
      let expected = 'Round'
      assert.equal(actual, expected)
    })

    describe('Round#Deal', () => {
      it('should exist', () => {
        let actual = typeof testRound.dealHand
        let expected = 'function'
        assert.equal(actual, expected)
      })
      it('should deal a 6-card hand to a player', () => {
        let player = dummyTeams[1].players[0]
        player.hand = testRound.dealHand()
        let expected = 6
        let actual = player.hand.length
        assert.equal(actual, expected)
      })
      it('should reduce the card count of the deck by 6 after being called', () => {
        let playerOne = dummyTeams[0].players[0]
        let playerTwo = dummyTeams[1].players[0]
        playerOne.hand = testRound.dealHand()
        playerTwo.hand = testRound.dealHand()
        let expected = 40
        let actual = testRound.deck.length
        assert.equal(actual, expected)
      })
      it('should not contain the cards dealt to the players after being called', () => {
        let playerOne = dummyTeams[0].players[0]
        let playerTwo = dummyTeams[1].players[0]
        playerOne.hand = testRound.dealHand()
        playerTwo.hand = testRound.dealHand()
        let actual = true
        let expected = true
        playerOne.hand.forEach(playerCard => {
          testRound.deck.forEach(deckCard => {
            if (_.isEqual(playerCard, deckCard)) {
              actual = false
            }
          })
        })
        playerTwo.hand.forEach(playerCard => {
          testRound.deck.forEach(deckCard => {
            if (_.isEqual(playerCard, deckCard)) {
              actual = false
            }
          })
        })
        assert.equal(actual, expected)
      })
      it('should not deal the same card to multiple players', () => {
        let playerOne = dummyTeams[0].players[0]
        let playerTwo = dummyTeams[1].players[0]
        playerOne.hand = testRound.dealHand()
        playerTwo.hand = testRound.dealHand()
        let actual = true
        let expected = true
        playerOne.hand.forEach(playerOneCard => {
          playerTwo.hand.forEach(playerTwoCard => {
            if (_.isEqual(playerOneCard, playerTwoCard)) {
              actual = false
            }
          })
        })
        assert.equal(actual, expected)
      })
      it('should not deal more than 52 cards', () => {
        for (let i = 0; i < 8; i++) {
          testRound.dealHand()
        }
        function throwError(){
          testRound.dealHand()
        }
        let expectedError = 'not enough cards left to deal'
        assert.throws(throwError, Error, expectedError)
      })
    })
  })

  describe('suitUnicode', () => {
    it('should exist', () => {
      let actual = typeof suitUnicode
      let expected = 'function'
      assert.equal(actual, expected)
    })
    it('should return the correct unicode character for a given input', () => {
      let actualSpades = suitUnicode('s')
      let expectedSpades = '♠'
      assert.equal(actualSpades, expectedSpades)
      let actualHearts = suitUnicode('h')
      let expectedHearts = '♥'
      assert.equal(actualHearts, expectedHearts)
      let actualDiamonds = suitUnicode('d')
      let expectedDiamonds = '♦'
      assert.equal(actualDiamonds, expectedDiamonds)
      let actualClubs = suitUnicode('c')
      let expectedClubs = '♣'
      assert.equal(actualClubs, expectedClubs)
    })
    it('should throw an error if given an invalid input', () => {
      function throwError(){
        suitUnicode('k')
      }
      let expectedError = 'invalid suit passed to suitUnicode, must be either S, H, D, or C'
      assert.throws(throwError, Error, expectedError)
    })
  })

  describe('matchOver', () => {
    it('should exist', () => {
      let actual = typeof matchOver
      let expected = 'function'
      assert.equal(actual, expected)
    })
    it('should return true if a team\s score is >= 11', () => {
      let testTeamsOne = [
        {score: 10},
        {score: 11}
      ]
      let testTeamsTwo = [
        {score: 3},
        {score: 7}
      ]
      let actual = matchOver(testTeamsOne)
      let expected = true
      assert.equal(actual, expected)

      actual = matchOver(testTeamsTwo)
      expected = false
      assert.equal(actual, expected)
    })
    it('should return false if a team\s score is < 11', () => {
      let testTeams = [
        {score: 10},
        {score: 10}
      ]
      let actual = matchOver(testTeams)
      let expected = false
      assert.equal(actual, expected)
    })
  })

  describe('determineMatchWinner', () => {
    it('should exist', () => {
      let actual = typeof determineMatchWinner
      let expected = 'function'
      assert.equal(actual, expected)
    })
    it('should return a winning team if that team leads by >= 2 points', () => {
      let testTeamsOne = [
        {score: 2, name: 'team1'},
        {score: 0, name: 'team2'}
      ]
      let testTeamsTwo = [
        {score: 3, name: 'team1'},
        {score: 0, name: 'team2'}
      ]

      let matchWinner = determineMatchWinner(testTeamsOne)
      let actual = matchWinner.name
      let expected = 'team1'
      assert.equal(actual, expected)

      matchWinner = determineMatchWinner(testTeamsTwo)
      actual = matchWinner.name
      expected = 'team1'
      assert.equal(actual, expected)
    })
    it('should throw an error if neither team leads by >= 2 points', () => {
      let testTeams = [
        {score: 1},
        {score: 2}
      ]
      function throwsError() {
        determineMatchWinner(testTeams)
      }
      let expectedError = 'determineMatchWinner: neither team has a 2-point or higher lead'
      assert.throws(throwsError, Error, expectedError)
    })
  })
})
