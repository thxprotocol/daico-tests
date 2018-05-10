
# DAICO Smart Contracts 
This repository holds the deployment scripts and experimental code for the 
DAICO Smart Contracts needed for the OST Crowdsale.

Clone the repository with `git clone git@github.com:peterpolman/daico-smart-contracts.git daico`

## Configure dev environment

[Install Ganache](https://github.com/trufflesuite/ganache)

Add the development network to `truffle.js`:
```
ganache: {
    host: "localhost",
    port: 8545,
    network_id: "5777",
    gas: "4700000"
}
```
Install truffle with `npm install truffle`

Start the console with `truffle console --network ganache`

## Configure test environment

[Install Geth RPC](https://github.com/ethereum/go-ethereum/wiki/geth)

Add the test network to `truffle.js`:
```
geth: {
    host: "localhost",
    port: 7545,
    network_id: "*"
}
```

## Configure and launch Ganache blockchain
Just start the Ganache application and `10 accounts` with `100 ether` each will be pre-configured. Make sure it is running on port `8545` and enable automining.

## Configure and launch Geth blockchain
Follow these steps to launch the local geth blockchain and use the console to configure and unlock accounts.

```
# Remove old Geth data
rm -rf ./datadir;
# Initialize geth with a genesis block
geth --datadir=./datadir/ init ./genesis.json
# Start the blockchain with usefull API's
geth --datadir=./datadir/ --rpc --rpcport 7545 --rpccorsdomain "*" --rpcaddr 127.0.0.1 --rpcapi "eth,net,web3,debug"
# WARNING: Configure accounts first throught the geth console, otherwise the coinbase to distribute mining rewards to can not be set!
# Stop Geth and restart with --mine parameter
geth --datadir=./datadir/ --rpc --rpcport 7545 --rpccorsdomain "*" --rpcaddr 127.0.0.1 --rpcapi "eth,net,web3,debug" --mine
```

## Using the JavaScript console
Use the JavaScript console the execute functions in contracts and call for values of properties. You can also configure accounts and obtain information about the chaindata.

```
# Start console for ganache
truffle console --network ganache
```

```
# Start console for geth
geth attach ipc://Users/peterpolman/Sites/daico/datadir/geth.ipc
```

```
# Generate 10 accounts
for (var i = 0; i < 10; i++) personal.newAccount("");
# Unlock all available accounts
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

Mist logs are stored here:
```
/Users/peterpolman/Library/Application Support/Mist/logs/all.log`
```

## Using Remix
Use Remix for quick debugging of smart contracts. Set up this listener for access to local files through the browser application.
```
# Start remix listener for folder holding the solidity files
remixd -s /Users/peterpolman/Sites/daico/contracts`
```

## Deployment

Remove contract json builds and and deploy on the chosen network.


```
# On the dev network
rm -rf build;
truffle migrate --network ganache;
```

```
# On the test network
rm -rf build;
truffle exec ./scripts/deploy_token.js --network geth;
truffle exec ./scripts/deploy_reservationfund.js --network geth;
truffle exec ./scripts/deploy_pollmanagedfund.js --network geth;
truffle exec ./scripts/deploy_crowdsale.js --network geth;
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
