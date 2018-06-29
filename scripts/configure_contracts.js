const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");

const config = require("../test/_config.js");

module.exports = async (callback) => {

  console.log("Configure OpenSocialCoin at " + OpenSocialCoin.address);

  console.log("... setting owners to " + OpenSocialDAICO.address + " and " + PollManagedFund.address);
  OpenSocialCoin.at(OpenSocialCoin.address).setOwners([OpenSocialDAICO.address, PollManagedFund.address]);

  console.log("Configure PollManagedFund Contract at " + PollManagedFund.address);

  console.log("... setting lockedTokensAddress to " + LockedTokens.address);
  PollManagedFund.at(PollManagedFund.address).setLockedTokenAddress(LockedTokens.address);

  console.log("... setting tokenAddress to " + OpenSocialCoin.address);
  PollManagedFund.at(PollManagedFund.address).setTokenAddress(OpenSocialCoin.address);

  console.log("... setting crowdsaleAddress to " + OpenSocialDAICO.address);
  PollManagedFund.at(PollManagedFund.address).setCrowdsaleAddress(OpenSocialDAICO.address);

  console.log("Configure ReservationFund at " + ReservationFund.address);

  console.log("... setting crowdsaleAddress to " + OpenSocialDAICO.address);
  ReservationFund.at(ReservationFund.address).setCrowdsaleAddress(OpenSocialDAICO.address);

  console.log("Configure OpenSocialDAICO at " + OpenSocialDAICO.address);

  console.log("... setting private sale hardCap to " + config.privateSaleHardCap + " ETH.");
  OpenSocialDAICO.at(OpenSocialDAICO.address).setPrivateSaleHardCap(web3.toWei(config.privateSaleHardCap, "ether"));

  console.log("... setting soft cap to " + config.softCap + " ETH.");
  OpenSocialDAICO.at(OpenSocialDAICO.address).setSoftCap(web3.toWei(config.softCap, "ether"));

  console.log("... setting hard cap to " + config.hardCap + " ETH.");
  OpenSocialDAICO.at(OpenSocialDAICO.address).setHardCap(web3.toWei(config.hardCap, "ether"));

  console.log("... setting tokenPrice to " + config.tokenPriceNum + " OSC equals " + config.tokenPriceDenom + " ETH.");
  OpenSocialDAICO.at(OpenSocialDAICO.address).setTokenPrice(config.tokenPriceNum, config.tokenPriceDenom);

  console.log("... setting lockedTokensAddress to " + LockedTokens.address);
  OpenSocialDAICO.at(OpenSocialDAICO.address).setLockedTokens(LockedTokens.address);

  console.log("Done:) Now travel through blocktime!");
}
