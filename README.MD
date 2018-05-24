# DAICO Smart Contracts
This repository holds the Smart Contracts, deployment, test and configuration scripts for the OpenSocial DAICO Smart Contracts.

Clone the repository with `git clone git@github.com:peterpolman/daico-smart-contracts.git daico`

## Index
* [Installation](#installation)
* [Start RPC](#start-rpc)
* [Accounts and Wallets](#accounts-and-wallets)
* [Deployment](#deployment)
* [Configuration](#configuration)
* [Management](#management)
* [Automated Testing](#automated-testing)

## Installation

We use the truffle toolbox to interact with the RPC. It gives us migration, debug and console interfaces. For development purposes we use the ganache command line interface. With brew we need to install the ethereum packages so we can use the solidity compiler.

```bash
npm install -g truffle
npm install -g ganache-cli
brew install ethereum/ethereum
```

## Start RPC

Start ganache-cli with 10 accounts filled with 1000 ETH each and a pretty realistic gas configuration

```bash
# Start ganache-cli
ganache-cli --accounts=15 --defaultBalanceEther=1000 --gasPrice=10225000000 --gasLimit=8500000
```

## Accounts and wallets

**accounts[0]:** Coinbase, contract owner and has manager roles

**accounts[1]:** Team Wallet
**accounts[2]:** ReferralToken Wallet
**accounts[3]:** FoundationToken Wallet
**accounts[4]:** CompanyToken Wallet
**accounts[5]:** ReserveToken Wallet
**accounts[6]:** BountyToken Wallet
**accounts[7]:** AdvisorToken Wallet
**accounts[8]:** BnbToken Wallet

**accounts[10]:** Test accounts #0
**accounts[11]:** Test accounts #1
**accounts[12]:** Test accounts #2
**accounts[13]:** Test accounts #3
**accounts[14]:** Test accounts #4
**accounts[15]:** Test accounts #5

## Deployment

Some statics need to be set in the contracts. Follow these steps:

1. Set the `SALE_START_TIME` property
2. Set the `SALE_END_TIME` property in `OpenSocialToken.sol`
3. Set the `SALE_END_TIME` property in `Crowdsale.sol`
4. Set the timestamps in the `refundPollDates` property in `PollManagedFund.sol`
5. Set the percentages in the `finalizeCrowdsale()` function in `Crowdsale.sol` to reflect the correct token allocation.

The migration script will deploy the contracts on the Ganache blockchain. Make sure it is started and has at least 9 accounts preconfigured.

```bash
# Remove previous builds and deploy the crowdsale with the deployment script provided in /migrations/2_deploy_contracts.js
rm -rf build; truffle migrate --network ganache;
```

## Configuration

```bash
# Configure the crowdsale with the configuration script provided in /scripts/1_configure_contracts.js
truffle exec scripts/1_configure_contracts.js --network ganache
```

## Management

These commands help you testing and using the contracts through the truffle console.

```bash
truffle console --network ganache
```

### Getting ETH and OSC balances from contracts and accounts

```javascript
// Get OSC balance of a specific user
OpenSocialCoin.at(OpenSocialCoin.address).balances(web3.eth.accounts[10])
// Get ETH balance of a specific user
web3.eth.getBalance(web3.eth.accounts[10])
// Log all balances in console
for (let i = 0; i < web3.eth.accounts.length; i++) console.log(web3.eth.getBalance(web3.eth.accounts[i]))
// Check the current amount of ETH in the ReservationFund
web3.eth.getBalance(ReservationFund.address);
// Check the current amount of ETH in the PollManagedFund
web3.eth.getBalance(PollManagedFund.address);
// Send 5 ETH from account 10 to crowdsale
OpenSocialDAICO.at(OpenSocialDAICO.address).sendTransaction({from: web3.eth.accounts[10], to: OpenSocialDAICO.address, value: web3.toWei(900, "ether")});
```

### Adding an address to a list.

#### Whitelist:
Within the first day of the crowdsale whiteListed addresses can contribute a minimum of 0.2 ETH up to a maximum of 20 ETH.

#### PrivilegedList:
PrivilegedList addresses can contribute a minimum of 100 ETH up to a maximum of 3000 ETH.

#### LimitedList:
*This needs more research!*

```javascript
/*
 * Adding address to whitelist, priviledged list, limited list and has an additional bonus
 *
 * @param account = accounts[12]
 * @param isInWhiteList (min 0.2 ETH, max 20 ETH)
 * @param isInPrivilegedList (min 100 ETH, max 3000 ETH)
 * @param isInLimitedList (?)
 * @param hasAdditionalBonus (Should check compute additional bonuses because of contrib in time window)
 */
// Add address to whitelist with no additional bonus
OpenSocialDAICO.at(OpenSocialDAICO.address).addToLists(web3.eth.accounts[10], true, false, false, false);
// Add address to whitelist with additional bonus
OpenSocialDAICO.at(OpenSocialDAICO.address).addToLists(web3.eth.accounts[10], true, false, false, true);
// Add address to privilegedList with no additional bonus
OpenSocialDAICO.at(OpenSocialDAICO.address).addToLists(web3.eth.accounts[10], false, true, false, false);
// Add address to privilegedList with additional bonus
OpenSocialDAICO.at(OpenSocialDAICO.address).addToLists(web3.eth.accounts[10], false, true, false, true);
// Check if user is in whiteList
OpenSocialDAICO.at(OpenSocialDAICO.address).whiteList.call(web3.eth.accounts[10])
// Check if user is in privilegedList
OpenSocialDAICO.at(OpenSocialDAICO.address).privilegedList.call(web3.eth.accounts[10])
// Check if user has additional bonus @TODO this transaction needs more research
OpenSocialDAICO.at(OpenSocialDAICO.address).additionalBonusOwnerState.call(web3.eth.accounts[10])
```

### During the crowdsale

```javascript
// Check the totalEtherContributed during the crowdsale
OpenSocialDAICO.at(OpenSocialDAICO.address).totalEtherContributed.call();

```

### Finalizing the Crowdsale

```javascript
// Check the current state of the PollManagedFund
PollManagedFund.at(PollManagedFund.address).state.call();
// Check if coin transfers are allowed
OpenSocialCoin.at(OpenSocialCoin.address).allowTransfers.call()
// Check if issuance is finished
OpenSocialCoin.at(OpenSocialCoin.address).issuanceFinished.call()
// Allow transfers
OpenSocialCoin.at(OpenSocialCoin.address).enableTransfers()
// Transfer 100 OSC from accounts 10 to accounts 11
OpenSocialCoin.at(OpenSocialCoin.address).transferFrom(web3.eth.accounts[10], web3.eth.accounts[11], 100)
// Finalize the crowdsale when sale is ended or hardcap is met
OpenSocialDAICO.at(OpenSocialDAICO.address).finalizeCrowdsale();
// Check the amount a user has contributed
OpenSocialDAICO.at(OpenSocialDAICO.address).userTotalContributed.call(web3.eth.accounts[10])

```

#### Refunding contributors

```javascript
// Force refund state (only refundManager as defined during deployment)
PollManagedFund.at(PollManagedFund.address).forceRefund({ from: web3.eth.accounts[0] })
// Check the current state of the PollManagedFund
PollManagedFund.at(PollManagedFund.address).state.call();
// Call refund method from a specific accounts when contract is in Refund state
PollManagedFund.at(PollManagedFund.address).refundTokenHolder({ from: web3.eth.accounts[10] })
```
...

#### Voting

...


## Automated Testing

For the key features in the DAICO contracts automated tests are written. You can find them in the `/test` folder and run them with:

```bash
# Run all tests in the test folder
truffle test --network ganache
```
