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

1. Set the tokenPrice numerator and denominator through console with `setTokenPrice(uint256 _tokenPriceNum, uint256 _tokenPriceDenom)`
2. Set the softCap property with `setSoftCap(uint256 _softCap)`
3. Set the hardCap property with `setHardCap(uint256 _hardCap)`
4. Set the crowdsale address in `ReservationFund.sol` with `setCrowdsaleAddress(address crowdsaleAddress)`
5. Set the Crowdsale address and PollManagedFund address as owners of the `OpenSocialToken.sol` contract.

**Before contribution**

1. Run through KYC process
2. Add given wallet address to lists with `addTolists()`
3. 

**User contribution**
1. 

**After contribution**
1. 