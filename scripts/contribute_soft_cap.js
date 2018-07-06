const THXTokenDAICO = artifacts.require("THXTokenDAICO");
const PollManagedFund = artifacts.require("PollManagedFund");

module.exports = async (callback) => {
  for (let i = 10; i < 25; i++) {
    await THXTokenDAICO.at(THXTokenDAICO.address).addToWhiteList(web3.eth.accounts[i]);

    for (let j = 0; j < 5; j++) {
      await THXTokenDAICO.at(THXTokenDAICO.address).sendTransaction({
          from: web3.eth.accounts[i],
          to: THXTokenDAICO.address,
          value: web3.toWei(20, "ether")
      });

      console.log('... #' + i + ' contributed 20 ETH [' + (j + 1) + 'x]');
    }
  }
}
