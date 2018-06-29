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

    it("Crowdsale should reach soft cap and set the fund in Withdraw Mode.", async () => {
      let crowdSaleStartTime = await OpenSocialDAICOInstance.SALE_START_TIME.call();
      let crowdSaleEndTime = await OpenSocialDAICOInstance.SALE_END_TIME.call();
      var blocktime = await web3.eth.getBlock('latest').timestamp;

      await timeTravel((parseInt(crowdSaleStartTime) + 86400) - blocktime); // 86400 seconds == 1 day

      await OpenSocialDAICOInstance.addToWhiteList(accounts[10]);
      await OpenSocialDAICO.at(OpenSocialDAICO.address).sendTransaction({
          from: accounts[10],
          to: OpenSocialDAICO.address,
          value: web3.toWei(750, "ether")
      });

      await OpenSocialDAICOInstance.addToWhiteList(accounts[11]);
      await OpenSocialDAICO.at(OpenSocialDAICO.address).sendTransaction({
          from: accounts[11],
          to: OpenSocialDAICO.address,
          value: web3.toWei(750, "ether")
      });

      var blocktime = web3.eth.getBlock('latest').timestamp;

      await timeTravel(crowdSaleEndTime - blocktime);

      await OpenSocialDAICOInstance.finalizeCrowdsale();

      let state = (await PollManagedFundInstance.state.call()).valueOf();

      assert.equal(state, 2, "The current state is " + state + " and not " + 2 + ".");
    });

    it("Team wallet should be able to withdraw 10% of total ETH contributed.", async() => {
      let totalEtherContributed = web3.fromWei( await OpenSocialDAICOInstance.totalEtherContributed.call() );
      let calculatedFirstTimeWithdraw = totalEtherContributed.valueOf() * 0.1;
      let firstWithdrawAmount = web3.fromWei( await PollManagedFundInstance.firstWithdrawAmount.call() );

      await PollManagedFundInstance.firstWithdraw();

      let teamWallet = await PollManagedFundInstance.teamWallet.call();
      let amount = web3.fromWei(web3.eth.getBalance(teamWallet), "ether").valueOf();

      assert(amount == (1000 + (config.softCap * 0.1)), "Ether not withdrawn from PollManagedFund.")
      assert.equal(firstWithdrawAmount.valueOf(), calculatedFirstTimeWithdraw, "First Withdraw Amount is not 10% of the total ETH contributed.");
    });

    it("Team wallet should be able to withdraw 250 ETH 30 days after the end of the crowdsale.", async() => {
      let crowdSaleEndTime = await OpenSocialDAICOInstance.SALE_END_TIME.call();
      var blocktime = web3.eth.getBlock('latest').timestamp;

      var currentTapAmount = web3.fromWei(await PollManagedFundInstance.getCurrentTapAmount(), "ether").valueOf();

      await timeTravel((parseInt(crowdSaleEndTime) + (30 * 86400)) - blocktime); // 30 days

      var currentTapAmount = web3.fromWei(await PollManagedFundInstance.getCurrentTapAmount(), "ether").valueOf();

      await PollManagedFundInstance.withdraw();

      let teamWallet = await PollManagedFundInstance.teamWallet.call();
      let amount = web3.fromWei(web3.eth.getBalance(teamWallet), "ether").valueOf();

      assert(amount > 1395, "Ether not withdrawn from PollManagedFund.") // Just not exactly 1400 because of the time between withdrawel and tapamount calculation

    });

});
