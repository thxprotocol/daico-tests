# Setup dev environment
This document will guide you through the installation and configuration of a local dev and test environment. It will also explain how to use the JS console, MIST wallet and Remix IDE.

## Index
* [Configure dev environment](#configure-dev-environment)
* [Configure test environment](#configure-test-environment)
* [Configure and launch Ganache blockchain](#configure-and-launch-ganache-blockchain)
* [Configure and launch Geth blockchain](#configure-and-launch-geth-blockchain)
* [Using the JavaScript console](#using-the-javascript-console)
* [Using the MIST Wallet](#using-the-mist-wallet)
* [Using Remix](#using-remix)

## Configure dev environment

[Install Ganache](https://github.com/trufflesuite/ganache)

Add the development network to `truffle.js`:
```
ganache: {
    host: "localhost",
    port: 8545,
    network_id: "*"
}
```
1. Install truffle with `npm install -g truffle`
2. Start the console with `truffle console --network ganache`

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
1. Install truffle with `npm install -g truffle`
2. Start the console with `truffle console --network ganache`

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

