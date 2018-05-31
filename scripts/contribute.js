const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");

module.exports = async (callback) => {
  // This funds 2500 ETH (5 contribs of 20 ETH from 25 accounts)
  for (let i = 10; i < 35; i++) {
    await OpenSocialDAICO.at(OpenSocialDAICO.address).addToLists(web3.eth.accounts[i], true, false, false, false);

    for (let j = 0; j < 5; j++) {
      await OpenSocialDAICO.at(OpenSocialDAICO.address).sendTransaction({
          from: web3.eth.accounts[i],
          to: OpenSocialDAICO.address,
          value: web3.toWei(20, "ether")
      });
      console.log('... #' + i + ' contributed 20 ETH ' + (j + 1) + 'x');
    }
  }
}
