const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");

const shared = require('./configuration.js');
const timeTravel = require("../scripts/timeTravel.js");

contract('OpenSocialDAICO', async (accounts) => {
    const SECONDS_IN_A_DAY = 86400;

    let crowdSaleStartTime;
    let crowdSaleEndTime;

    let daysUntilCrowdSale;
    let daysUntilCrowdSaleEnd;

    let OpenSocialDAICOInstance;
    let PollManagedFundInstance;
    let OpenSocialCoinInstance;
    let ReservationFundInstance;
    let LockedTokensInstance;

    it("All instances should be available", async() => {
      context = await shared.run(accounts);

      ({ OpenSocialDAICOInstance, ReservationFundInstance, OpenSocialCoinInstance, PollManagedFundInstance, LockedTokensInstance } = context);

      assert(OpenSocialDAICOInstance !== undefined, 'has OpenSocialDAICOInstance instance');
      assert(ReservationFundInstance !== undefined, 'has ReservationFundInstance instance');
      assert(OpenSocialCoinInstance !== undefined, 'has OpenSocialCoinInstance instance');
      assert(PollManagedFundInstance !== undefined, 'has PollManagedFundInstance instance');
      assert(LockedTokensInstance !== undefined, 'has LockedTokensInstance instance');
    });

    it("Contributors should contribute till hard cap", async() => {
      crowdSaleStartTime = (await OpenSocialDAICOInstance.SALE_START_TIME.call()).valueOf();;

      let now = Math.floor(Date.now() / 1000);
      daysUntilCrowdSale = Math.ceil( (crowdSaleStartTime - now) / SECONDS_IN_A_DAY );

      await timeTravel(SECONDS_IN_A_DAY * (daysUntilCrowdSale + 1)) // Travel to the crowdsale start date (add 1 to be sure)

      // This funds 1500 ETH (5 contribs of 20 ETH from 25 accounts)
      for (let i = 10; i < 35; i++) {
        await OpenSocialDAICOInstance.addToLists(web3.eth.accounts[i], true, false, false, false);

        for (let j = 0; j < 5; j++) {
          await OpenSocialDAICOInstance.sendTransaction({
              from: web3.eth.accounts[i],
              to: OpenSocialDAICO.address,
              value: web3.toWei(20, "ether")
          });
          console.log('... #' + i + ' contributed 20 ETH ' + (j + 1) + 'x');
        }
      }

      let balance = (await web3.eth.getBalance(PollManagedFund.address)).valueOf();

      assert.equal(web3.fromWei(balance, "ether"), 2500, "2500 ether in total is not contributed in the reservation fund");
    });

    it("The manager should be able to finalize the crowdsale and set the state to TeamWithdraw mode", async() => {
      crowdSaleEndTime = (await OpenSocialDAICOInstance.SALE_END_TIME.call()).valueOf();;
      daysUntilCrowdSaleEnd = Math.ceil( (crowdSaleEndTime - crowdSaleStartTime) / SECONDS_IN_A_DAY );

      await timeTravel(SECONDS_IN_A_DAY * (daysUntilCrowdSaleEnd + 1)) // Travel to the crowd sale end date
      await OpenSocialDAICOInstance.finalizeCrowdsale();

      let state = (await PollManagedFundInstance.state.call()).valueOf();

      // 0. Crowdsale, 1. CrowdsaleRefund, 2. TeamWithdraw, 3. Refund
      assert.equal(state, 2, "The current state is " + state + " and not " + 2 + ".");
    });

});
