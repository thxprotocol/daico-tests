const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");

const config = require('./_config.js');
const sharedConfig = require('./_shared_config.js');
const timeTravel = require("../scripts/time_travel.js");

contract('OpenSocialDAICO', async (accounts) => {

    it("All instances should be available", async() => {
      context = await sharedConfig.run(accounts);

      ({ OpenSocialDAICOInstance, ReservationFundInstance, OpenSocialCoinInstance, PollManagedFundInstance, LockedTokensInstance } = context);

      assert(OpenSocialDAICOInstance !== undefined, 'has OpenSocialDAICOInstance instance');
      assert(ReservationFundInstance !== undefined, 'has ReservationFundInstance instance');
      assert(OpenSocialCoinInstance !== undefined, 'has OpenSocialCoinInstance instance');
      assert(PollManagedFundInstance !== undefined, 'has PollManagedFundInstance instance');
      assert(LockedTokensInstance !== undefined, 'has LockedTokensInstance instance');
    });

    it("Contributor should be able to make payment in bonus window 1", async() => {
      // Contribute in bonus window 1
      let crowdSaleStartTime = await OpenSocialDAICOInstance.SALE_START_TIME.call().valueOf();
      let bonusWindow1EndTime = await OpenSocialDAICOInstance.BONUS_WINDOW_1_END_TIME.call().valueOf();
      var blocktime = web3.eth.getBlock('latest').timestamp;

      await timeTravel((parseInt(crowdSaleStartTime) + 86400) - blocktime); // + 86400 seconds == 1 day

      await OpenSocialDAICOInstance.addToWhiteList(accounts[10]);
      let tx = await OpenSocialDAICOInstance.sendTransaction({
          from: accounts[10],
          to: OpenSocialDAICO.address,
          value: web3.toWei(1, "ether")
      });

      var blocktime = web3.eth.getBlock('latest').timestamp;

      assert(blocktime > crowdSaleStartTime && blocktime < bonusWindow1EndTime, "Bonus window not correct.");
      assert(tx != null, "Transaction of 1 ETH failed.");

    });

    it("Contributor should be able to make payment in bonus window 2", async() => {
      // Contribute in bonus window 2
      let bonusWindow1EndTime = await OpenSocialDAICOInstance.BONUS_WINDOW_1_END_TIME.call().valueOf();
      let bonusWindow2EndTime = await OpenSocialDAICOInstance.BONUS_WINDOW_2_END_TIME.call().valueOf();
      var blocktime = web3.eth.getBlock('latest').timestamp;

      await timeTravel((parseInt(bonusWindow1EndTime) + 86400) - blocktime); // + 86400 seconds == 1 day

      var blocktime = web3.eth.getBlock('latest').timestamp;

      await OpenSocialDAICOInstance.addToWhiteList(accounts[11]);
      let tx = await OpenSocialDAICOInstance.sendTransaction({
          from: accounts[11],
          to: OpenSocialDAICO.address,
          value: web3.toWei(1, "ether")
      });

      assert(blocktime > bonusWindow1EndTime && blocktime < bonusWindow2EndTime, "Bonus window not correct.");
      assert(tx != null, "Transaction of 1 ETH failed.");

    });

    it("Contributor should be able to make payment in bonus window 3", async() => {
      // Contribute in bonus window 3
      let bonusWindow2EndTime = await OpenSocialDAICOInstance.BONUS_WINDOW_2_END_TIME.call().valueOf();
      let bonusWindow3EndTime = await OpenSocialDAICOInstance.BONUS_WINDOW_3_END_TIME.call().valueOf();
      var blocktime = web3.eth.getBlock('latest').timestamp;

      await timeTravel((parseInt(bonusWindow2EndTime) + 86400) - blocktime); // + 86400 seconds == 1 day

      var blocktime = web3.eth.getBlock('latest').timestamp;

      await OpenSocialDAICOInstance.addToWhiteList(accounts[12]);
      let tx = await OpenSocialDAICOInstance.sendTransaction({
          from: accounts[12],
          to: OpenSocialDAICO.address,
          value: web3.toWei(1, "ether")
      });

      assert(blocktime > bonusWindow2EndTime && blocktime < bonusWindow3EndTime, "Bonus window not correct.");
      assert(tx != null, "Transaction of 1 ETH failed.");

    });

    it("Contributor should be able to make payment outside of bonus windows", async() => {
      // Contribute with no bonus
      let bonusWindow3EndTime = await OpenSocialDAICOInstance.BONUS_WINDOW_3_END_TIME.call().valueOf();
      var blocktime = web3.eth.getBlock('latest').timestamp;

      await timeTravel((parseInt(bonusWindow3EndTime) + 86400) - blocktime);

      var blocktime = web3.eth.getBlock('latest').timestamp;

      await OpenSocialDAICOInstance.addToWhiteList(accounts[13]); // + 86400 seconds == 1 day
      let tx = await OpenSocialDAICOInstance.sendTransaction({
          from: accounts[13],
          to: OpenSocialDAICO.address,
          value: web3.toWei(1, "ether")
      });

      assert(blocktime > bonusWindow3EndTime, "Bonus window not correct.");
      assert(tx != null, "Transaction of 1 ETH failed.");

    });

    it("1st week contributor should receive 10% more tokens.", async() => {
      var balance = web3.fromWei(await OpenSocialCoinInstance.balanceOf(accounts[10]), "ether").valueOf();

      assert.equal(balance, config.tokenPriceNum * 1.1, "Bonus was not calculated correct.");
    });

    it("2nd week contributor should receive 7.5% more tokens.", async() => {
      var balance = web3.fromWei(await OpenSocialCoinInstance.balanceOf(accounts[11]), "ether").valueOf();

      assert.equal(balance, config.tokenPriceNum * 1.075, "Bonus was not calculated correct.");
    });

    it("3th week contributor should receive 5% more tokens.", async() => {
      var balance = web3.fromWei(await OpenSocialCoinInstance.balanceOf(accounts[12]), "ether").valueOf();

      assert.equal(balance, config.tokenPriceNum * 1.05, "Bonus was not calculated correct.");
    });

    it("Contributors outside bonus windows should receive no bonus.", async() => {
      var balance = web3.fromWei(await OpenSocialCoinInstance.balanceOf(accounts[13]), "ether").valueOf();

      assert.equal(balance, config.tokenPriceNum, "Amount was not calculated correct.");
    });
});
