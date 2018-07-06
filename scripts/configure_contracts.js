const THXTokenDAICO = artifacts.require("THXTokenDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const THXToken = artifacts.require("THXToken");
const PollManagedFund = artifacts.require("PollManagedFund");

const config = require("../test/_config.js");

module.exports = async (callback) => {

  console.log("Configure THXToken at " + THXToken.address);

  console.log("... setting owners to " + THXTokenDAICO.address + " and " + PollManagedFund.address);
  THXToken.at(THXToken.address).setOwners([THXTokenDAICO.address, PollManagedFund.address]);

  console.log("Configure PollManagedFund Contract at " + PollManagedFund.address);

  console.log("... setting lockedTokensAddress to " + LockedTokens.address);
  PollManagedFund.at(PollManagedFund.address).setLockedTokenAddress(LockedTokens.address);

  console.log("... setting tokenAddress to " + THXToken.address);
  PollManagedFund.at(PollManagedFund.address).setTokenAddress(THXToken.address);

  console.log("... setting crowdsaleAddress to " + THXTokenDAICO.address);
  PollManagedFund.at(PollManagedFund.address).setCrowdsaleAddress(THXTokenDAICO.address);

  console.log("Configure ReservationFund at " + ReservationFund.address);

  console.log("... setting crowdsaleAddress to " + THXTokenDAICO.address);
  ReservationFund.at(ReservationFund.address).setCrowdsaleAddress(THXTokenDAICO.address);

  console.log("Configure THXTokenDAICO at " + THXTokenDAICO.address);

  console.log("... setting private sale hardCap to " + config.privateSaleHardCap + " ETH.");
  THXTokenDAICO.at(THXTokenDAICO.address).setPrivateSaleHardCap(web3.toWei(config.privateSaleHardCap, "ether"));

  console.log("... setting soft cap to " + config.softCap + " ETH.");
  THXTokenDAICO.at(THXTokenDAICO.address).setSoftCap(web3.toWei(config.softCap, "ether"));

  console.log("... setting hard cap to " + config.hardCap + " ETH.");
  THXTokenDAICO.at(THXTokenDAICO.address).setHardCap(web3.toWei(config.hardCap, "ether"));

  console.log("... setting tokenPrice to " + config.tokenPriceNum + " THX equals " + config.tokenPriceDenom + " ETH and " + config.bnbTokenPriceNum + " THX equals " + config.bnbTokenPriceDenom + " BNB.");
  THXTokenDAICO.at(THXTokenDAICO.address).setTokenPrice(config.tokenPriceNum, config.tokenPriceDenom, config.bnbTokenPriceNum, config.bnbTokenPriceDenom);

  console.log("... setting lockedTokensAddress to " + LockedTokens.address);
  THXTokenDAICO.at(THXTokenDAICO.address).setLockedTokens(LockedTokens.address);

  console.log("Done:) Now travel through blocktime!");
}
