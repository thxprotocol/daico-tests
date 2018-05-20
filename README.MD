# DAICO Smart Contracts
This repository holds the deployment scripts and experimental code for the
DAICO Smart Contracts needed for the OST Crowdsale.

Clone the repository with `git clone git@github.com:peterpolman/daico-smart-contracts.git daico`

## Index
* [Configuration of the DAICO](#configuration-of-the-daico)

## Configuration of the DAICO

**Before deployment**
1. Set the `SALE_START_TIME` property
2. Set the `SALE_END_TIME` property in `OpenSocialToken.sol`
3. Set the `SALE_END_TIME` property in `Crowdsale.sol`
4. Set the timestamps in the `refundPollDates` property in `PollManagedFund.sol`
5. Set the percentages in the `finalizeCrowdsale()` function in `Crowdsale.sol` to reflect the correct token allocation.

**After deployment**

```bash
# Soft Cap 4000000 USD in ether (@ $700)
OpenSocialDAICO.at(OpenSocialDAICO.address).setSoftCap(web3.toWei(5714, "ether"));
# Hard Cap 16000000 USD in ether (@ $700)
OpenSocialDAICO.at(OpenSocialDAICO.address).setHardCap(web3.toWei(22857, "ether"));

# Start here if soft and hard cap are fixed in contract
OpenSocialDAICO.at(OpenSocialDAICO.address).setTokenPrice(35000,1);
OpenSocialDAICO.at(OpenSocialDAICO.address).setLockedTokens(LockedTokens.address);
```

```bash
ReservationFund.at(ReservationFund.address).setCrowdsaleAddress(OpenSocialDAICO.address);
```

```bash
PollManagedFund.at(PollManagedFund.address).setLockedTokenAddress(LockedTokens.address);
PollManagedFund.at(PollManagedFund.address).setTokenAddress(OpenSocialCoin.address);
PollManagedFund.at(PollManagedFund.address).setCrowdsaleAddress(OpenSocialDAICO.address);
```

```bash
OpenSocialCoin.at(OpenSocialCoin.address).setOwners([OpenSocialDAICO.address, PollManagedFund.address]);
```


**Before contribution**

1. *Run through KYC process*
2. Add given wallet address to lists with `addTolists()`
```bash
# Adding address to whitelist, priviledged list, limited list and has an additional bonus
OpenSocialDAICO.at(OpenSocialDAICO.address).addToLists(web3.eth.accounts[12], true, true, true, true);
```

**User contribution**

```bash
# Send transaction
web3.eth.sendTransaction({from: web3.eth.accounts[12], to: OpenSocialDAICO.address, value: web3.toWei(5, "ether")})
```

**After contribution**
1.
