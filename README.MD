# DAICO Smart Contracts
This repository holds the Smart Contracts, deployment/migration, test and configuration scripts for the THX Token Sale Smart Contracts. Helper scripts for manually testing and debugging the contracts are also provided.

Clone the repository recursively so the forked contracts repo will also be cloned.

```bash
git clone --recursive git@github.com:goalgorilla/daico-smart-contracts.git daico
```

## Index
* [Installation](#installation)
* [Start RPC](#start-rpc)
* [Accounts and Wallets](#accounts-and-wallets)
* [Deployment](#deployment)
* [Configuration](#configuration)
* [Management](#management)
* [Automated Testing](#automated-testing)

## Installation

We use the Truffle toolbox to interact with the RPC. It gives us migration, debug and console interfaces. For development purposes we use the Ganache CLI. With brew we need to install the Ethereum packages so we can use the solidity compiler.

```bash
# Install these packages globally
npm install -g truffle
npm install -g ganache-cli
```

## Start RPC

Start ganache-cli with 35 accounts filled with 1000 ETH each and a gas configuration that is similar to the current values used in the main net.

```bash
# Start ganache-cli
ganache-cli --accounts=35 --defaultBalanceEther=1000 --gasPrice=10225000000 --gasLimit=8500000
```

## Accounts and wallets
| Account # | Description |
|-|-|
| 0 | Coinbase, contract owner and has manager roles |
| 1 | Team Wallet |
| 2 | Crowdsale Token Wallet |
| 3 | Foundation Token Wallet |
| 4 | Company Token Wallet |
| 5 | Reserve Token Wallet |
| 6 | Bounty Token Wallet |
| 7 | Advisor Token Wallet |
| 8 | - |
| 9 | - |
| 10 | Test account #0 |
| 11 | Test account #1 |
| .. | .. |
| 34 | Test account #34 |

## Deployment

Some statics need to be set in the contracts. Follow these steps:

1. Set the `SALE_START_TIME` property
2. Set the `SALE_END_TIME` property in `OpenSocialToken.sol`
3. Set the `SALE_END_TIME` property in `Crowdsale.sol`
4. Set the timestamps in the `refundPollDates` property in `PollManagedFund.sol`
5. Set the percentages in the `finalizeCrowdsale()` function in `Crowdsale.sol` to reflect the correct token allocation.

The migration script will deploy the contracts on the Ganache blockchain. Make sure it is started and has at least 9 accounts preconfigured.
These contracts will be deployed and accessible:

* **Crowdsale.sol:**
The THXTokenDAICO contract that distributes payments to the correct funds and allows contributors to refund.

* **PollManagedFund.sol:**
The fund holding the teams ETH, releasing some each month depending on the tap configuration

* **ReservationFund.sol:**
The fund holding ETH send to the Crowdsale contract by contributors prior to passing their KYC

* **THXToken.sol:**
The Token contract listing all contributors that are allowed to have tokens.

* **LockedTokens.sol:**
Contract responsible for locking tokens for a specific amount of time

```bash
# Remove previous builds and deploy the crowdsale with the deployment script provided in /migrations/2_deploy_contracts.js
rm -rf build;
truffle migrate --network ganache;
```

## Configuration

```bash
# Configure the crowdsale with the configuration script provided in /scripts/1_configure_contracts.js
truffle exec scripts/configure_contracts.js --network ganache
```

## Management

These commands help you testing and using the contracts through the truffle console. Start the console with:

```bash
truffle console --network ganache
```

### Getting ETH and THX balances from contracts and accounts

Use these commands to get the current ETH or THX balances for accounts or contracts.

```javascript
// Get THX balance of a specific user
THXToken.at(THXToken.address).balances(web3.eth.accounts[10])
// Get ETH balance of a specific user
web3.eth.getBalance(web3.eth.accounts[10])
// Log all balances in console
for (let i = 0; i < web3.eth.accounts.length; i++) console.log(web3.eth.getBalance(web3.eth.accounts[i]))
// Check the current amount of ETH in the ReservationFund
web3.eth.getBalance(ReservationFund.address);
// Check the current amount of ETH in the PollManagedFund
web3.eth.getBalance(PollManagedFund.address);
```

### Adding an address to a list.

Before contributors contribute ETH they should pass KYC and be listed so we know where the funds come from. There are 3 lists with different purposes giving contributing different conditions to contribute under.

| List # | Description |
|-|-|
| PrivilegedList | PrivilegedList addresses can contribute a minimum of 100 ETH up to a maximum of 3000 ETH. Set the hasAdditionalBonus parameter true to make sure the Private Sale contributor receives its 20% bonus. |
| WhiteList | Within the first day of the crowdsale whiteListed addresses can contribute a minimum of 0.2 ETH up to a maximum of 20 ETH. |
| LimitedList | Used for US contributors. Their funds are locked for 365 days in a limited wallet and therefor can not be transferred. |

```javascript
// If you need to add a user to multiple lists use this method.
THXTokenDAICO.at(THXTokenDAICO.address).addToLists(web3.eth.accounts[10], true, false, false, false);
// Add address to whitelist with additional bonus
THXTokenDAICO.at(THXTokenDAICO.address).addToLists(web3.eth.accounts[10], true, false, false, true);
THXTokenDAICO.at(THXTokenDAICO.address).addToWhiteList(web3.eth.accounts[10]);
// Add address to privilegedList with no additional bonus
THXTokenDAICO.at(THXTokenDAICO.address).addToLists(web3.eth.accounts[10], false, true, false, false);
THXTokenDAICO.at(THXTokenDAICO.address).addToPrivilegedList(web3.eth.accounts[10]);
// Add address to privilegedList with additional bonus
THXTokenDAICO.at(THXTokenDAICO.address).addToLists(web3.eth.accounts[10], false, true, false, true);
THXTokenDAICO.at(THXTokenDAICO.address).addToPrivilegedList(web3.eth.accounts[10]);
THXTokenDAICO.at(THXTokenDAICO.address).addAdditionalBonusMember(web3.eth.accounts[10]);

// Check if user is in whiteList
THXTokenDAICO.at(THXTokenDAICO.address).whiteList.call(web3.eth.accounts[10])
// Check if user is in privilegedList
THXTokenDAICO.at(THXTokenDAICO.address).privilegedList.call(web3.eth.accounts[10])
// Check if user has additional bonus @TODO this transaction needs more research
THXTokenDAICO.at(THXTokenDAICO.address).additionalBonusOwnerState.call(web3.eth.accounts[10])
```

### During the crowdsale

Call for stats on total token supply, total ether contributed and amount ether ccontributed per user. There is more:)

```javascript
// Check the totalEtherContributed during the crowdsale
THXTokenDAICO.at(THXTokenDAICO.address).totalEtherContributed.call();
// Check the total generated amount of tokens
THXToken.at(THXToken.address).totalSupply.call()
// Check the amount a user has contributed
THXTokenDAICO.at(THXTokenDAICO.address).userTotalContributed.call(web3.eth.accounts[10])
// Contribute 20 ether from account 11
THXTokenDAICO.at(THXTokenDAICO.address).sendTransaction({ from: web3.eth.accounts[11], to: THXTokenDAICO.address, value: web3.toWei(20, "ether") });
```

### Finalizing the Crowdsale

Finalize the crowdsale, enable token transfers and disable the limits. Transfer 10000 THX from account 10 to account 11.

```javascript
// Check the current state of the PollManagedFund
PollManagedFund.at(PollManagedFund.address).state.call();
// Finalize the crowdsale when sale is ended or hardcap is met
THXTokenDAICO.at(THXTokenDAICO.address).finalizeCrowdsale();
// Check if issuance is finished
THXToken.at(THXToken.address).issuanceFinished.call()
// Check if coin transfers are allowed
THXToken.at(THXToken.address).allowTransfers.call()
// Allow transfers
THXToken.at(THXToken.address).enableTransfers()
// Check if we are in limited transfer period
THXToken.at(THXToken.address).isLimitEnabled.call();
// Approve tokens to be transferred during limited period
THXToken.at(THXToken.address).addLimitedWalletAddress(web3.eth.accounts[10]);
THXToken.at(THXToken.address).increaseApproval(web3.eth.accounts[10], 10000 * (10 ^ 18));
// Disable limit
THXToken.at(THXToken.address).disableLimit()
// Display the current token balances of accounts
THXToken.at(THXToken.address).balanceOf(web3.eth.accounts[10]);
THXToken.at(THXToken.address).balanceOf(web3.eth.accounts[11]);
// Transfer 1000 THX from accounts 10 to accounts 11
THXToken.at(THXToken.address).approve(web3.eth.accounts[10], 10000 * (10 ^ 18), { from: web3.eth.accounts[10] });
THXToken.at(THXToken.address).transferFrom(web3.eth.accounts[10], web3.eth.accounts[11], 10000 * (10 ^ 18), { from: web3.eth.accounts[10] })
// Check how much accounts 10 allowed account 11
THXToken.at(THXToken.address).allowed(web3.eth.accounts[10], web3.eth.accounts[11]);

```

### Refunding contributors

Force the state of the Poll Managed Fund in Refund mode and refund crowdsale contributors account 10.

```javascript
// Force refund state (only refundManager as defined during deployment)
THXTokenDAICO.at(THXTokenDAICO.address).forceCrowdsaleRefund()
// Check the current state of the PollManagedFund
PollManagedFund.at(PollManagedFund.address).state.call();
// Call refund method from a specific account when contract is in Refund state
PollManagedFund.at(PollManagedFund.address).refundCrowdsaleContributor({ from: web3.eth.accounts[10] })
```

### Vote for tap change

To simulate a scenario where we can vote for tap increases refunding we need to finalize the crowdsale to get the PollManagedFund into TeamWithDraw mode. I added some scripts to speed up this process.

```bash
rm -rf build;
truffle migrate --network ganache;
# Configure the settings of the contracts after migrating
truffle exec scripts/configureContracts.js --network ganache;
# Travel to the start of the crowdsale
truffle exec scripts/time/start_public.js --network ganache;
# Configure this so enough contributions are made to reach the softcap or hardcap
truffle exec scripts/contribute_hard_cap.js --network ganache;
# Travel to the end of the crowdsale
truffle exec scripts/time/end_public.js --network ganache;
```

Finalize the crowdsale and check if the Poll Managed Fund has the TeamWithDraw state.

```javascript
THXTokenDAICO.at(THXTokenDAICO.address).finalizeCrowdsale();
// Should return 2 (withdraw mode)
PollManagedFund.at(PollManagedFund.address).state.call();
```

Change the blocktime to a date that is the 10th of a month. You can only travel in the future and need to restart the chain if you travel too far ahead in time.

```bash
# Travels to 1549784558 (Sun, 10 Feb 2019 09:42:38 +0200)
truffle exec scripts/time/create_tap_poll.js --network ganache;
```

Create the tap poll and cast a YES vote, a NO vote and revoke that NO vote from that user.

```javascript
// Create a tap poll that increased the tap with 10%
PollManagedFund.at(PollManagedFund.address).createTapPoll(10);
// Check if the address of the tapPoll is set and not 0x0000...
var tapPollAddress = PollManagedFund.at(PollManagedFund.address).tapPoll.call();
// Vote YES from account 10
web3.eth.sendTransaction({ from: web3.eth.accounts[10], to: tapPollAddress, data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000001", gas: 200000});
// Vote YES from account 11
web3.eth.sendTransaction({ from: web3.eth.accounts[11], to: tapPollAddress, data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000000", gas: 200000});
// Revoke a vote from an account that voted
web3.eth.sendTransaction({ from: web3.eth.accounts[11], to: tapPollAddress, data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000000", gas: 200000});
```

### Vote for full refund

@TODO Create a refundPoll on a date set in `PollManagedFund.refundPollDates`, vote YES with the majority and see if all ETH is refunded automagically.

```javascript
// Create a refundPoll but make sure you are in the correct time window (see refundPollDates PollManagedFund)
...
```

## Time traveling

Smart Contracts containing logic that depends on time often use the `now` variable which is set with the timestamp of the last block in the blockchain that is created. You can check this in the console with:

```javascript
let blocktime = web3.eth.getBlock('latest').timestamp // Returns a UNIX timestamp
```

```bash
# Travels to SALE_START_TIME;
truffle exec scripts/time/start_public.js --network ganache;
# Travels to SALE_END_TIME;
truffle exec scripts/time/end_public.js --network ganache;
# Travels to 1554076800 (01.04.2019)
truffle exec scripts/time/create_refund_poll.js --network ganache;
# Travels to 1549784558 (Sun, 10 Feb 2019 09:42:38 +0200)
truffle exec scripts/time/create_tap_poll.js --network ganache;
```

## Automated Testing

For the key features in the DAICO contracts automated tests are written. You can find them in the `/test` folder and run them with:

```bash
# Run a specific test, remember to restart your RPC between tests.
truffle test ./test/configuration.js --network ganache
truffle test ./test/contributing.js --network ganache
truffle test ./test/voting.js --network ganache
truffle test ./test/refunding.js --network ganache
```
