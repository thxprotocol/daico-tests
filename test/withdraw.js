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

      for (let i = 10; i < 25; i++) {
        await OpenSocialDAICO.at(OpenSocialDAICO.address).addToWhiteList(web3.eth.accounts[i]);

        for (let j = 0; j < 5; j++) {
          await OpenSocialDAICO.at(OpenSocialDAICO.address).sendTransaction({
              from: web3.eth.accounts[i],
              to: OpenSocialDAICO.address,
              value: web3.toWei(20, "ether")
          });

          console.log('... #' + i + ' contributed 20 ETH [' + (j + 1) + 'x]');
        }
      }

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

      assert.equal(firstWithdrawAmount.valueOf(), calculatedFirstTimeWithdraw, "First Withdraw Amount is not 10% of the total ETH contributed.");
    });

});
