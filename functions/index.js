'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _api = require('src/services/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var TURNS_ADDITION = 1;
var MAX_TURNS = 300;

/*
exports.avarice = functions.database.ref('/users/{uid}/turns').onUpdate(event => { // when turns are updated
  console.log('User ' + event.data.parent.val().name + ' went from ' + event.data.previous.val() + ' turns to ' + event.data.current.val())
  return true
})
*/

// https://cron-job.org
// https://us-central1-wyzard-14537.cloudfunctions.net/avarice
// creates new auctions
exports.avarice = functions.https.onRequest(function (req, res) {
  if (req.method === 'GET') {
    // artifact
    admin.database().ref('artifacts').once('value', function (artifacts) {
      if (artifacts && artifacts.hasChildren()) {
        var auctions = [];
        artifacts.forEach(function (artifact) {
          var auction = (0, _assign2.default)({}, artifact.val()); // {...artifact.val()}
          auction.quantity = 1;
          auction.timestamp = Date.now() + 1000 * 60 * 60 * Math.floor(Math.random() * (48 - 24 + 1) + 24);
          delete auction['.key'];
          auctions.push(auction);
        });
        // random
        var index = Math.floor(Math.random() * auctions.length);
        admin.database().ref('auctions').push(auctions[index]);
      }
    });
    // contract
    admin.database().ref('heroes').once('value', function (heroes) {
      if (heroes && heroes.hasChildren()) {
        var contracts = [];
        heroes.forEach(function (hero) {
          var contract = (0, _assign2.default)({}, hero.val()); // {...hero.val()}
          contract.level = Math.floor(Math.random() * 5) + 1;
          contract.timestamp = Date.now() + 1000 * 60 * 60 * Math.floor(Math.random() * (48 - 24 + 1) + 24);
          delete contract['.key'];
          contracts.push(contract);
        });
        // random
        var index = Math.floor(Math.random() * contracts.length);
        admin.database().ref('tavern').push(contracts[index]);
      }
    });
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});

// https://cron-job.org
// https://us-central1-wyzard-14537.cloudfunctions.net/generosity
// update user turns and check auction expirations
exports.generosity = functions.https.onRequest(function (req, res) {
  if (req.method === 'GET') {
    // check artifact auctions finished
    admin.database().ref('auctions').once('value', function (auctions) {
      auctions.forEach(function (auction) {
        var auc = auction.val();
        if (auc.timestamp <= Date.now()) {
          if (auc.bidder) {
            (0, _api.addArtifactToUser)(auc.bidder, auc.name);
          }
          auction.ref.remove();
        }
      });
    });
    // check hero contracts finished
    admin.database().ref('tavern').once('value', function (contracts) {
      contracts.forEach(function (contract) {
        var con = contract.val();
        if (con.timestamp <= Date.now()) {
          if (con.bidder) {
            (0, _api.addHeroToUser)(con.bidder, con.name);
          }
          contract.ref.remove();
        }
      });
    });
    // check user turns
    admin.database().ref('users').once('value', function (users) {
      users.forEach(function (user) {
        user.ref.child('turns').set(Math.min(MAX_TURNS, user.child('turns').val() + TURNS_ADDITION));
      });
    });
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});