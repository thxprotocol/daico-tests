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

    it("Crowdsale should reach soft cap and set the fund in Withdraw Mode.", async () => {
      let crowdSaleStartTime = await THXTokenDAICOInstance.SALE_START_TIME.call();
      let crowdSaleEndTime = await THXTokenDAICOInstance.SALE_END_TIME.call();
      var blocktime = await web3.eth.getBlock('latest').timestamp;

      await timeTravel((parseInt(crowdSaleStartTime) + 86401) - blocktime); // 86400 seconds == 1 day

      await THXTokenDAICOInstance.addToWhiteList(accounts[10]);
      await THXTokenDAICO.at(THXTokenDAICO.address).sendTransaction({
          from: accounts[10],
          to: THXTokenDAICO.address,
          value: web3.toWei(750, "ether")
      });

      await THXTokenDAICOInstance.addToWhiteList(accounts[11]);
      await THXTokenDAICO.at(THXTokenDAICO.address).sendTransaction({
          from: accounts[11],
          to: THXTokenDAICO.address,
          value: web3.toWei(750, "ether")
      });

      var blocktime = web3.eth.getBlock('latest').timestamp;

      await timeTravel(crowdSaleEndTime - blocktime);

      await THXTokenDAICOInstance.finalizeCrowdsale();

      let state = (await PollManagedFundInstance.state.call()).valueOf();

      assert.equal(state, 2, "The current state is " + state + " and not " + 2 + ".");
    });

    it("Team wallet should be able to withdraw 10% of total ETH contributed.", async() => {
      let totalEtherContributed = web3.fromWei( await THXTokenDAICOInstance.totalEtherContributed.call() );
      let calculatedFirstTimeWithdraw = totalEtherContributed.valueOf() * 0.1;
      let firstWithdrawAmount = web3.fromWei( await PollManagedFundInstance.firstWithdrawAmount.call() );

      await PollManagedFundInstance.firstWithdraw();

      let teamWallet = await PollManagedFundInstance.teamWallet.call();
      let amount = web3.fromWei(web3.eth.getBalance(teamWallet), "ether").valueOf();

      assert(amount == (1000 + (config.softCap * 0.1)), "Ether not withdrawn from PollManagedFund.")
      assert.equal(firstWithdrawAmount.valueOf(), calculatedFirstTimeWithdraw, "First Withdraw Amount is not 10% of the total ETH contributed.");
    });

    it("Team wallet should be able to withdraw 250 ETH 30 days after the end of the crowdsale.", async() => {
      let crowdSaleEndTime = await THXTokenDAICOInstance.SALE_END_TIME.call();
      var blocktime = web3.eth.getBlock('latest').timestamp;
      let teamWallet = await PollManagedFundInstance.teamWallet.call();

      await timeTravel((parseInt(crowdSaleEndTime) + (30 * 86400)) - blocktime); // 30 days

      let amount = web3.fromWei(web3.eth.getBalance(teamWallet), "ether").valueOf();

      await PollManagedFundInstance.withdraw();

      let newAmount = web3.fromWei(web3.eth.getBalance(teamWallet), "ether").valueOf();
      var currentTapAmount = web3.fromWei(await PollManagedFundInstance.getCurrentTapAmount(), "ether").valueOf();

      assert(currentTapAmount < 1, "Ether not withdrawn from PollManagedFund.")
      // Just not exactly 1400 because of the time between withdrawel and tapamount calculation
      assert(newAmount > 1395, "Ether not transfered to Team Wallet.");
    });

});
