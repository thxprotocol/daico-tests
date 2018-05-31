/*
 * This scripts configures the Contracts so contributions can be made.
 */

const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");

module.exports = async (callback) => {
  const privateSaleHardCap = 655; // 655 in ETH
  const softCap = 1500; // 5714 in ETH
  const hardCap = 2500; // 22857 in ETH
  const tokenPriceNum = 35000;  // 35000 in OSC
  const tokenPriceDenom = 1;  // 1 in ETH

  console.log("Configuring OpenSocialCoin at " + OpenSocialCoin.address);

  console.log("... setting owners to " + OpenSocialDAICO.address + " and " + PollManagedFund.address);
  OpenSocialCoin.at(OpenSocialCoin.address).setOwners([OpenSocialDAICO.address, PollManagedFund.address]);

  console.log("OpenSocialCoin is configured!");

  console.log("Start configuring PollManagedFund Contract at " + PollManagedFund.address);

  console.log("... setting lockedTokensAddress to " + LockedTokens.address);
  PollManagedFund.at(PollManagedFund.address).setLockedTokenAddress(LockedTokens.address);

  console.log("... setting tokenAddress to " + OpenSocialCoin.address);
  PollManagedFund.at(PollManagedFund.address).setTokenAddress(OpenSocialCoin.address);

  console.log("... setting crowdsaleAddress to " + OpenSocialDAICO.address);
  PollManagedFund.at(PollManagedFund.address).setCrowdsaleAddress(OpenSocialDAICO.address);

  console.log("PollManagedFund is configured!");

  console.log("Configuring ReservationFund at " + ReservationFund.address);

  console.log("... setting crowdsaleAddress to " + OpenSocialDAICO.address);
  ReservationFund.at(ReservationFund.address).setCrowdsaleAddress(OpenSocialDAICO.address);

  console.log("ReservationFund is configured!");

  console.log("Configuring OpenSocialDAICO at " + OpenSocialDAICO.address);

  console.log("... setting private sale hardCap to " + privateSaleHardCap + " ETH.");
  OpenSocialDAICO.at(OpenSocialDAICO.address).setPrivateSaleHardCap(web3.toWei(privateSaleHardCap, "ether"));

  console.log("... setting soft cap to " + softCap + " ETH.");
  OpenSocialDAICO.at(OpenSocialDAICO.address).setSoftCap(web3.toWei(softCap, "ether"));

  console.log("... setting hard cap to " + hardCap + " ETH.");
  OpenSocialDAICO.at(OpenSocialDAICO.address).setHardCap(web3.toWei(hardCap, "ether"));

  console.log("... setting tokenPrice to " + tokenPriceNum + " OSC equals " + tokenPriceDenom + " ETH.");
  OpenSocialDAICO.at(OpenSocialDAICO.address).setTokenPrice(tokenPriceNum, tokenPriceDenom);

  console.log("... setting lockedTokensAddress to " + LockedTokens.address);
  OpenSocialDAICO.at(OpenSocialDAICO.address).setLockedTokens(LockedTokens.address);

  console.log("OpenSocialDAICO is configured!");

  console.log("Done:)");
}
