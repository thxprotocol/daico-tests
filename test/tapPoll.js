const THXTokenDAICO = artifacts.require("THXTokenDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const THXToken = artifacts.require("THXToken");
const PollManagedFund = artifacts.require("PollManagedFund");

const sharedConfig = require('./_shared_config.js');
const timeTravel = require("../scripts/time_travel.js");

contract('THXTokenDAICO', async (accounts) => {
    const CREATE_TAPPOLL_DATE = 1549784558;

    it("All instances should be available", async() => {
      context = await sharedConfig.run(accounts);

      ({ THXTokenDAICOInstance, ReservationFundInstance, THXTokenInstance, PollManagedFundInstance, LockedTokensInstance } = context);

      assert(THXTokenDAICOInstance !== undefined, 'has THXTokenDAICOInstance instance');
      assert(ReservationFundInstance !== undefined, 'has ReservationFundInstance instance');
      assert(THXTokenInstance !== undefined, 'has THXTokenInstance instance');
      assert(PollManagedFundInstance !== undefined, 'has PollManagedFundInstance instance');
      assert(LockedTokensInstance !== undefined, 'has LockedTokensInstance instance');
    });

    it("Contributors should contribute as much as the hard cap", async() => {
      let crowdSaleStartTime = await THXTokenDAICOInstance.SALE_START_TIME.call();


      await timeTravel((parseInt(crowdSaleStartTime) + 86400) - (web3.eth.getBlock('latest').timestamp)); // 86400 seconds == 1 day

      for (let i = 10; i < 35; i++) {
        await THXTokenDAICOInstance.addToLists(accounts[i], true, false, false, false);

        for (let j = 0; j < 5; j++) {
          await THXTokenDAICOInstance.sendTransaction({
              from: accounts[i],
              to: THXTokenDAICO.address,
              value: web3.toWei(20, "ether")
          });
        }
      }

      let balance = (await web3.eth.getBalance(PollManagedFund.address)).valueOf();

      assert.equal(web3.fromWei(balance, "ether"), 2500, "2500 ether in total is not contributed in the reservation fund");
    });

    it("The manager should be able to finalize the crowdsale and set the state to TeamWithdraw mode", async() => {
      let crowdSaleEndTime = await THXTokenDAICOInstance.SALE_END_TIME.call();


      await timeTravel(crowdSaleEndTime - (web3.eth.getBlock('latest').timestamp));

      await THXTokenDAICOInstance.finalizeCrowdsale();

      let state = (await PollManagedFundInstance.state.call()).valueOf();

      assert.equal(state, 2, "The current state is " + state + " and not " + 2 + ".");
    });

    it("The team should be able to create a tap poll that increases the tap with 10%", async() => {


      await timeTravel(CREATE_TAPPOLL_DATE - (web3.eth.getBlock('latest').timestamp));

      await PollManagedFundInstance.createTapPoll(10);

      let tapPollAddress = await PollManagedFundInstance.tapPoll.call();

      assert(tapPollAddress != "0x0000000000000000000000000000000000000000", "Tap poll is created");
    });

    it("A token holder should be able to vote YES on the tap poll", async () => {
      let tapPollAddress = await PollManagedFundInstance.tapPoll.call();
      let tx = await web3.eth.sendTransaction({
        from: accounts[10],
        to: tapPollAddress,
        data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000001",
        gas: 200000
      });

      assert(tx != null);
    });

    it("A token holder should be able to vote NO on the tap poll", async () => {
      let tapPollAddress = await PollManagedFundInstance.tapPoll.call();
      let tx = await web3.eth.sendTransaction({
        from: accounts[11],
        to: tapPollAddress,
        data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000000",
        gas: 200000
      });

      assert(tx != null);
    });

    it("A token holder should be able to revoke his tap poll vote", async () => {
      let tapPollAddress = await PollManagedFundInstance.tapPoll.call();
      let tx = await web3.eth.sendTransaction({
        from: accounts[11],
        to: tapPollAddress,
        data: "0x43c14b22",
        gas: 200000
      });

      assert(tx != null);
    });

});
