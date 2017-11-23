'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMessageToUser = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

// send message to user
var addMessageToUser = exports.addMessageToUser = function addMessageToUser(uid, from, color, subject) {
  var text = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var battle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var artifact = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  var gold = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
  var people = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : null;
  var kills = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : null;
  var conquered = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : null;
  var sieged = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : null;
  var mana = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : null;
  var hero = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : null;
  var god = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : null;
  var spionage = arguments.length > 15 && arguments[15] !== undefined ? arguments[15] : null;

  return admin.database().ref('users').child(uid).child('messages').push({
    name: from,
    color: color,
    subject: subject,
    text: text,
    battle: battle,
    artifact: artifact,
    gold: gold,
    people: people,
    kills: kills,
    conquered: conquered,
    sieged: sieged,
    mana: mana,
    hero: hero,
    god: god,
    spionage: spionage,
    timestamp: Date.now(),
    read: false
  });
};

// add artifact to user
var addArtifactToUser = function addArtifactToUser(uid, name) {
  var quantity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  name = name.includes('lbl_artifact_') ? name : 'lbl_artifact_' + name;
  return admin.database().ref('artifacts').child(name.replace('lbl_artifact_', '')).once('value', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(artifact) {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!artifact) {
                _context2.next = 3;
                break;
              }

              _context2.next = 3;
              return admin.database().ref('users').child(uid).child('relics').orderByChild('name').equalTo(name).once('value', function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(relics) {
                  var relic;
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!(relics && relics.hasChildren())) {
                            _context.next = 4;
                            break;
                          }

                          relics.forEach(function (relic) {
                            admin.database().ref('users').child(uid).child('relics').child(relic.key).update({ quantity: relic.val().quantity + quantity });
                          });
                          _context.next = 9;
                          break;

                        case 4:
                          relic = (0, _extends3.default)({}, artifact.val());

                          relic.quantity = quantity;
                          delete relic['.key'];
                          _context.next = 9;
                          return admin.database().ref('users').child(uid).child('relics').push(relic);

                        case 9:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined);
                }));

                return function (_x15) {
                  return _ref2.apply(this, arguments);
                };
              }());

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x14) {
      return _ref.apply(this, arguments);
    };
  }());
};

// add hero to user
var addHeroToUser = function addHeroToUser(uid, name) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;

  name = name.includes('lbl_hero_') ? name : 'lbl_hero_' + name;
  return admin.database().ref('heroes').child(name.replace('lbl_hero_', '')).once('value', function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(hero) {
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!hero) {
                _context4.next = 3;
                break;
              }

              _context4.next = 3;
              return admin.database().ref('users').child(uid).child('contracts').orderByChild('name').equalTo(name).once('value', function () {
                var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(contracts) {
                  var contract;
                  return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          if (contracts && contracts.hasChildren()) {
                            contracts.forEach(function (contract) {
                              contract.ref.remove();
                            });
                          }
                          contract = (0, _extends3.default)({}, hero.val());

                          contract.level = level;
                          delete contract['.key'];
                          _context3.next = 6;
                          return admin.database().ref('users').child(uid).child('contracts').push(contract);

                        case 6:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, undefined);
                }));

                return function (_x18) {
                  return _ref4.apply(this, arguments);
                };
              }());

            case 3:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    return function (_x17) {
      return _ref3.apply(this, arguments);
    };
  }());
};

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
          auction.timestamp = Date.now() + 1000 * 60 * 60 * Math.floor(Math.random() * (12 - 6 + 1) + 6);
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
          contract.timestamp = Date.now() + 1000 * 60 * 60 * Math.floor(Math.random() * (12 - 6 + 1) + 6);
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
            var artifact = { name: auc.name, color: auc.color, quantity: auc.quantity };
            addArtifactToUser(auc.bidder, auc.name);
            addMessageToUser(auc.bidder, 'lbl_name_auction', 'dark', 'lbl_message_auction_win', 'lbl_message_auction_win_description', null, artifact, auc.bid);
            if (auc.owner) {
              admin.database().ref('users').child(auc.owner).transaction(function (user) {
                if (user) {
                  user.gold += parseInt(auc.bid);
                  addMessageToUser(user.ref, 'lbl_name_auction', 'dark', 'lbl_message_auction_sold', 'lbl_message_auction_sold_description', null, artifact, auc.bid);
                }
                return user;
              });
            }
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
            var hero = { name: con.name, color: con.color, level: con.level };
            addHeroToUser(con.bidder, con.name);
            addMessageToUser(con.bidder, 'lbl_name_tavern', 'dark', 'lbl_message_tavern_win', 'lbl_message_tavern_win_description', null, null, auc.bid, null, null, null, null, null, hero);
          }
          contract.ref.remove();
        }
      });
    });
    admin.database().ref('users').once('value', function (users) {
      users.forEach(function (user) {
        user.ref.transaction(function (player) {
          if (player) {
            player.turns = Math.min(MAX_TURNS, player.turns + TURNS_ADDITION);
          }
          return player;
        });
      });
    });
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});