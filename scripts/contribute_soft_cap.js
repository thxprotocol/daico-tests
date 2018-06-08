const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const PollManagedFund = artifacts.require("PollManagedFund");

module.exports = async (callback) => {
  await OpenSocialDAICO.deployed();

  for (let i = 10; i < 25; i++) {
    await OpenSocialDAICO.at(OpenSocialDAICO.address).addToWhiteList(web3.eth.accounts[i]);

    for (let j = 0; j < 5; j++) {
      await PollManagedFund.at(PollManagedFund.address).sendTransaction({
          from: web3.eth.accounts[i],
          to: OpenSocialDAICO.address,
          value: web3.toWei(20, "ether")
      });

      console.log('... #' + i + ' contributed 20 ETH ' + (j + 1) + 'x');
    }
  }
}
