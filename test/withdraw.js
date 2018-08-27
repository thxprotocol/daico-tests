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
      let crowdSaleStartTime = await THXTokenDAICOInstance.SALE_START_TIME();
      let crowdSaleEndTime = await THXTokenDAICOInstance.SALE_END_TIME();

      await timeTravel((parseInt(crowdSaleStartTime) + 86401) - (web3.eth.getBlock('latest').timestamp)); // 86400 seconds == 1 day

      await THXTokenDAICOInstance.addToWhiteList(accounts[10]);
      await THXTokenDAICOInstance.sendTransaction({
          from: accounts[10],
          to: THXTokenDAICO.address,
          value: web3.toWei(750, "ether")
      });

      await THXTokenDAICOInstance.addToWhiteList(accounts[11]);
      await THXTokenDAICOInstance.sendTransaction({
          from: accounts[11],
          to: THXTokenDAICO.address,
          value: web3.toWei(750, "ether")
      });

      await timeTravel(crowdSaleEndTime - (web3.eth.getBlock('latest').timestamp));

      await THXTokenDAICOInstance.finalizeCrowdsale();

      let state = (await PollManagedFundInstance.state()).valueOf();

      assert.equal(state, 2, "The current state is " + state + " and not " + 2 + ".");
    });

    it("Team wallet should be able to withdraw 10% of total ETH contributed.", async() => {
      let totalEtherContributed = web3.fromWei( await THXTokenDAICOInstance.totalEtherContributed() );
      let calculatedFirstTimeWithdraw = totalEtherContributed.valueOf() * 0.1;
      let firstWithdrawAmount = web3.fromWei( await PollManagedFundInstance.firstWithdrawAmount() );

      await PollManagedFundInstance.firstWithdraw();

      let teamWallet = await PollManagedFundInstance.teamWallet();
      let amount = web3.fromWei(web3.eth.getBalance(teamWallet), "ether").valueOf();

      assert(amount == (1000 + (config.softCap * 0.1)), "Ether not withdrawn from PollManagedFund.")
      assert.equal(firstWithdrawAmount.valueOf(), calculatedFirstTimeWithdraw, "First Withdraw Amount is not 10% of the total ETH contributed.");
    });

    it("Team wallet should be able to withdraw 250 ETH 30 days after the end of the crowdsale.", async() => {
      let crowdSaleEndTime = await THXTokenDAICOInstance.SALE_END_TIME();
      let teamWallet = await PollManagedFundInstance.teamWallet();

      await timeTravel((parseInt(crowdSaleEndTime) + (30 * 86400)) - (web3.eth.getBlock('latest').timestamp)); // 30 days

      let amount = web3.fromWei(web3.eth.getBalance(teamWallet), "ether").valueOf();

      await PollManagedFundInstance.withdraw();

      let newAmount = web3.fromWei(web3.eth.getBalance(teamWallet), "ether").valueOf();
      let currentTapAmount = web3.fromWei(await PollManagedFundInstance.getCurrentTapAmount(), "ether").valueOf();

      assert(currentTapAmount < 1, "Ether not withdrawn from PollManagedFund.")
      assert(newAmount > amount, "Ether not transfered to Team Wallet.");
    });

});
