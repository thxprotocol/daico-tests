const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");

const shared = require('./configuration.js');
const timeTravel = require("../scripts/time_travel.js");

contract('OpenSocialDAICO', async (accounts) => {
    const SECONDS_IN_A_DAY = 86400;
    const CREATE_TAPPOLL_DATE = 1549784558;

    let crowdSaleStartTime;
    let crowdSaleEndTime;

    let daysUntilCrowdSale;
    let daysUntilCrowdSaleEnd;
    let tapPollAddress;

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

      let blocktime = web3.eth.getBlock('latest').timestamp;
      daysUntilCrowdSale = Math.ceil( (crowdSaleStartTime - blocktime) / SECONDS_IN_A_DAY );

      await timeTravel(SECONDS_IN_A_DAY * (daysUntilCrowdSale + 1))

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
      let blocktime = web3.eth.getBlock('latest').timestamp;
      daysUntilCrowdSaleEnd = Math.ceil( (crowdSaleEndTime - blocktime) / SECONDS_IN_A_DAY );

      await timeTravel(SECONDS_IN_A_DAY * (daysUntilCrowdSaleEnd + 1))
      await OpenSocialDAICOInstance.finalizeCrowdsale();

      let state = (await PollManagedFundInstance.state.call()).valueOf();

      assert.equal(state, 2, "The current state is " + state + " and not " + 2 + ".");
    });

    it("The team should be able to create a tap poll that increases the tap with 10%", async() => {
      // Travel to a date in the future that is the 10th day of the month
      let blocktime = web3.eth.getBlock('latest').timestamp;
      daysUntilTapPollCreate = Math.ceil( (CREATE_TAPPOLL_DATE - blocktime) / SECONDS_IN_A_DAY );

      await timeTravel(SECONDS_IN_A_DAY * (daysUntilTapPollCreate))
      await PollManagedFundInstance.createTapPoll(10);

      tapPollAddress = (await PollManagedFundInstance.tapPoll.call())

      assert(tapPollAddress != "0x0000000000000000000000000000000000000000", "Tap poll is created");
    });

    it("A contributor should be able to vote YES on the tap poll", async () => {
      let tx = await web3.eth.sendTransaction({
        from: web3.eth.accounts[10],
        to: tapPollAddress,
        data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000001",
        gas: 200000
      });

      assert(tx != null);
    });

    it("A contributor should be able to vote NO on the tap poll", async () => {
      let tx = await web3.eth.sendTransaction({
        from: web3.eth.accounts[11],
        to: tapPollAddress,
        data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000000",
        gas: 200000
      });

      assert(tx != null);
    });

    it("A contributor should be able to revoke his tap poll vote", async () => {
      let tx = await web3.eth.sendTransaction({
        from: web3.eth.accounts[11],
        to: tapPollAddress,
        data: "0x43c14b22",
        gas: 200000
      });

      assert(tx != null);
    });

});
