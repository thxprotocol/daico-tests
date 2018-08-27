const THXTokenDAICO = artifacts.require("THXTokenDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const THXToken = artifacts.require("THXToken");
const PollManagedFund = artifacts.require("PollManagedFund");

const config = require('./_config.js');
const sharedConfig = require('./_shared_config.js');
const timeTravel = require("../scripts/time_travel.js");

contract('THXTokenDAICO', async (accounts) => {

    it("All instances should be available", async() => {
      context = await sharedConfig.run(accounts);

      ({ THXTokenDAICOInstance, ReservationFundInstance, THXTokenInstance, PollManagedFundInstance, LockedTokensInstance } = context);

      assert(THXTokenDAICOInstance !== undefined, 'has THXTokenDAICOInstance instance');
      assert(ReservationFundInstance !== undefined, 'has ReservationFundInstance instance');
      assert(THXTokenInstance !== undefined, 'has THXTokenInstance instance');
      assert(PollManagedFundInstance !== undefined, 'has PollManagedFundInstance instance');
      assert(LockedTokensInstance !== undefined, 'has LockedTokensInstance instance');
    });

    it("Contributor should be able to make payment in bonus window 1", async() => {
      // Contribute in bonus window 1
      let crowdSaleStartTime = await THXTokenDAICOInstance.SALE_START_TIME().valueOf();
      let bonusWindow1EndTime = await THXTokenDAICOInstance.BONUS_WINDOW_1_END_TIME().valueOf();


      await timeTravel((parseInt(crowdSaleStartTime) + 86400) - (web3.eth.getBlock('latest').timestamp)); // + 86400 seconds == 1 day

      await THXTokenDAICOInstance.addToWhiteList(accounts[10]);
      let tx = await THXTokenDAICOInstance.sendTransaction({
          from: accounts[10],
          to: THXTokenDAICO.address,
          value: web3.toWei(1, "ether")
      });

      var blocktime = web3.eth.getBlock('latest').timestamp;

      assert(blocktime > crowdSaleStartTime && blocktime < bonusWindow1EndTime, "Bonus window not correct.");
      assert(tx != null, "Transaction of 1 ETH failed.");
    });

    it("Contributor should be able to make payment in bonus window 2", async() => {
      // Contribute in bonus window 2
      let bonusWindow1EndTime = await THXTokenDAICOInstance.BONUS_WINDOW_1_END_TIME().valueOf();
      let bonusWindow2EndTime = await THXTokenDAICOInstance.BONUS_WINDOW_2_END_TIME().valueOf();

      await timeTravel((parseInt(bonusWindow1EndTime) + 86400) - (web3.eth.getBlock('latest').timestamp)); // + 86400 seconds == 1 day

      await THXTokenDAICOInstance.addToWhiteList(accounts[11]);
      let tx = await THXTokenDAICOInstance.sendTransaction({
          from: accounts[11],
          to: THXTokenDAICO.address,
          value: web3.toWei(1, "ether")
      });

      var blocktime = web3.eth.getBlock('latest').timestamp;

      assert(blocktime > bonusWindow1EndTime && blocktime < bonusWindow2EndTime, "Bonus window not correct.");
      assert(tx != null, "Transaction of 1 ETH failed.");
    });

    it("Contributor should be able to make payment in bonus window 3", async() => {
      // Contribute in bonus window 3
      let bonusWindow2EndTime = await THXTokenDAICOInstance.BONUS_WINDOW_2_END_TIME().valueOf();
      let bonusWindow3EndTime = await THXTokenDAICOInstance.BONUS_WINDOW_3_END_TIME().valueOf();

      await timeTravel((parseInt(bonusWindow2EndTime) + 86400) - (web3.eth.getBlock('latest').timestamp)); // + 86400 seconds == 1 day

      await THXTokenDAICOInstance.addToWhiteList(accounts[12]);
      let tx = await THXTokenDAICOInstance.sendTransaction({
          from: accounts[12],
          to: THXTokenDAICO.address,
          value: web3.toWei(1, "ether")
      });

      var blocktime = web3.eth.getBlock('latest').timestamp;

      assert(blocktime > bonusWindow2EndTime && blocktime < bonusWindow3EndTime, "Bonus window not correct.");
      assert(tx != null, "Transaction of 1 ETH failed.");
    });

    it("Contributor should be able to make payment outside of bonus windows", async() => {
      // Contribute with no bonus
      let bonusWindow3EndTime = await THXTokenDAICOInstance.BONUS_WINDOW_3_END_TIME().valueOf();

      await timeTravel((parseInt(bonusWindow3EndTime) + 86400) - (web3.eth.getBlock('latest').timestamp));

      await THXTokenDAICOInstance.addToWhiteList(accounts[13]); // + 86400 seconds == 1 day
      let tx = await THXTokenDAICOInstance.sendTransaction({
          from: accounts[13],
          to: THXTokenDAICO.address,
          value: web3.toWei(1, "ether")
      });

      var blocktime = web3.eth.getBlock('latest').timestamp;

      assert(blocktime > bonusWindow3EndTime, "Bonus window not correct.");
      assert(tx != null, "Transaction of 1 ETH failed.");
    });

    it("1st week contributor should receive 10% more tokens.", async() => {
      var balance = web3.fromWei(await THXTokenInstance.balanceOf(accounts[10]), "ether").valueOf();

      assert.equal(balance, config.tokenPriceNum * 1.1, "Bonus was not calculated correct.");
    });

    it("2nd week contributor should receive 7.5% more tokens.", async() => {
      var balance = web3.fromWei(await THXTokenInstance.balanceOf(accounts[11]), "ether").valueOf();

      assert.equal(balance, config.tokenPriceNum * 1.075, "Bonus was not calculated correct.");
    });

    it("3th week contributor should receive 5% more tokens.", async() => {
      var balance = web3.fromWei(await THXTokenInstance.balanceOf(accounts[12]), "ether").valueOf();

      assert.equal(balance, config.tokenPriceNum * 1.05, "Bonus was not calculated correct.");
    });

    it("Contributors outside bonus windows should receive no bonus.", async() => {
      var balance = web3.fromWei(await THXTokenInstance.balanceOf(accounts[13]), "ether").valueOf();

      assert.equal(balance, config.tokenPriceNum, "Amount was not calculated correct.");
    });
});
