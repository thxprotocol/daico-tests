
# DAICO Smart Contracts 
This repository holds the deployment scripts and experimental code for the 
DAICO Smart Contracts needed for the OST Crowdsale.

## Installation RPC (go-ethereum/geth)

```
# Remove old Geth data
rm -rf ./datadir;
# Init the Geth blockchain with the genesis block
geth --datadir=./datadir/ init ./genesis.json
# Start the blockchain with usefull API's
geth --datadir=./datadir/ --rpc --rpcport 7545 --rpccorsdomain "*" --rpcaddr 127.0.0.1 --rpcapi "eth,net,web3,debug"
# Start the Geth Console
geth attach ipc://Users/peterpolman/Sites/daico/datadir/geth.ipc
# === Configure accounts first! ===
# Stop Geth and restart with --mine parameter
geth --datadir=./datadir/ --rpc --rpcport 7545 --rpccorsdomain "*" --rpcaddr 127.0.0.1 --rpcapi "eth,net,web3,debug" --mine
```

## Using the JavaScript console
```
# Generate 10 accounts and unlock all available accounts
for (var i = 0; i < 10; i++) personal.newAccount("");
for (var i = 0; i < personal.listAccounts.length; i++) personal.unlockAccount(personal.listAccounts[i], "", 15000)
```

## Using the MIST Wallet

Open MIST connected to the Geth RPC
```
open -a /Applications/Mist.app --args --rpc /Users/peterpolman/Sites/daico/datadir/geth.ipc
```

There is no feature in the interface to remove old contracts. Do this through the dev tools in MIST.
```
# Clear all Token contracts and Custom contracts from mist
CustomContracts.find().fetch().map(function(m) { CustomContracts.remove(m._id)})`
Tokens.find().fetch().map((m) => { Tokens.remove(m._id) } )`
```

## Using Remix 
```
# Start remix listener for folder holding the solidity files
remixd -s /Users/peterpolman/Sites/daico/contracts`
```

## Deployment

Remove contract json files and migrate to geth network
```
# On geth RPC
rm -rf build; 
truffle migrate --network geth;
```

```
# On ganache RPC
rm -rf build; 
truffle migrate --network ganache;
```

Mist logs are stored here:
```
/Users/peterpolman/Library/Application Support/Mist/logs/all.log`
```

## After deployment:
```
# First: Set the tokenprice through the crowdsale contract
# @param _tokenPriceNum
# @param _tokenPriceDenom
TheAbyssDAICO.at("0xb31ba2d2fc075b5d23b94cf73b04e756f7262395").setTokenPrice(30000,1);
```

```
# Second: Add the sender address to the lists
# @param test accounts
# @param isInWhiteList
# @param isInPrivilegedList
# @param isInLimitedList
# @param hasAdditionalBonus
TheAbyssDAICO.at("0xb31ba2d2fc075b5d23b94cf73b04e756f7262395").addToLists(web3.eth.accounts[9], true, true, true, true);
```

```
# Third: If there is a revert() on this line:
# require(msg.sender == limitedWalletsManager || ownerByAddress[msg.sender]);
#
# Probably add the correct manager or add more owners
# Set more owners on the token (coinbase, tokencontract, reservationfundcontract)
# @param coinbase
# @param †oken.address
# @param reservationFund.address
ABYSS.at("0x88438fc441b10a5fd1053da1a3f61575c2be11bb").setOwners([web3.eth.accounts[0], "0x88438fc441b10a5fd1053da1a3f61575c2be11bb", "0x15ef2dc7612d3a860487f18e94d42069e8ecf0f4"]);
```

```
# Forth: Set the crowdsale address as owner in the rervationfund so it can call txs
ReservationFund.at("0x15ef2dc7612d3a860487f18e94d42069e8ecf0f4").setCrowdsaleAddress("0xb31ba2d2fc075b5d23b94cf73b04e756f7262395");
```

```
# Fifth: Send money from account 2 to crowdsale address
web3.eth.sendTransaction({from: web3.eth.accounts[9], to: "0xb31ba2d2fc075b5d23b94cf73b04e756f7262395", value: web3.toWei(1, "ether")});
```

```
web3.eth.sendTransaction({from: web3.eth.accounts[0], to: web3.eth.accounts[1], value: web3.toWei(10, "ether")});
```

*Are processReservationContribution() and processReservationFundContribution() duplicates?*

# GOT STUCK HERE!

```
ReservationFund.sol:

69:         contributions[contributor] = safeAdd(contributions[contributor], msg.value);
70:         tokensToIssue[contributor] = safeAdd(tokensToIssue[contributor], _tokensToIssue);
71:         bonusTokensToIssue[contributor] = safeAdd(bonusTokensToIssue[contributor], _bonusTokensToIssue);
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

debug(ganache:0x1587aa21...)>

ReservationFund.sol:

69:         contributions[contributor] = safeAdd(contributions[contributor], msg.value);
70:         tokensToIssue[contributor] = safeAdd(tokensToIssue[contributor], _tokensToIssue);
71:         bonusTokensToIssue[contributor] = safeAdd(bonusTokensToIssue[contributor], _bonusTokensToIssue);
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

debug(ganache:0x1587aa21...)>

Transaction halted with a RUNTIME ERROR.

This is likely due to an intentional halting expression, like assert(), require() or revert(). It can also be due to out-of-gas exceptions. Please inspect your transaction parameters and contract code to determine the meaning of this error.
"0xff74dbadc4d1702e95e4ab2a02356a37e78a45b9"
```
