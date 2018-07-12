const THXTokenDAICO = artifacts.require("THXTokenDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const THXToken = artifacts.require("THXToken");
const PollManagedFund = artifacts.require("PollManagedFund");

const RefundPoll = artifacts.require("RefundPoll");

const config = require('./_config.js');
const sharedConfig = require('./_shared_config.js');
const timeTravel = require("../scripts/time_travel.js");

contract('THXTokenDAICO', async (accounts) => {
    let RefundPollInstance;

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

      assert.equal(web3.fromWei(balance, "ether"), config.hardCap, "2500 ether in total is not contributed in the reservation fund");

      var totalSupply = await THXTokenInstance.totalSupply();

      console.log(totalSupply);
    });

    it("The manager should be able to finalize the crowdsale and set the state to TeamWithdraw mode", async() => {
      let crowdSaleEndTime = await THXTokenDAICOInstance.SALE_END_TIME.call();


      await timeTravel(parseInt(crowdSaleEndTime) - (web3.eth.getBlock('latest').timestamp));

      await THXTokenDAICOInstance.finalizeCrowdsale();

      let state = (await PollManagedFundInstance.state.call()).valueOf();

      assert.equal(state, 2, "The current state is " + state + " and not " + 2 + ".");
    });


    /*********************************************************************************************************
     * Tests:
     * 1. Travel to the first refund poll DateTime
     * 2. Check if address of the refund poll is unset
     * 3. Create the refund poll with account 10
     * 4. Check if address of the refund poll is no longer unset
     *********************************************************************************************************/
    it("A token holder should be able to create the first refund poll on the correct date.", async() => {

      let firstRefundPollDate = await PollManagedFundInstance.refundPollDates.call(0);

      await timeTravel(parseInt(firstRefundPollDate) - (web3.eth.getBlock('latest').timestamp));

      var refundPollAddress = await PollManagedFundInstance.refundPoll.call();

      assert(refundPollAddress == '0x0000000000000000000000000000000000000000', "Poll should be undefined");

      var tx = await PollManagedFundInstance.createRefundPoll({
        from: accounts[10]
      });

      var refundPollAddress = await PollManagedFundInstance.refundPoll.call();

      assert(refundPollAddress != '0x0000000000000000000000000000000000000000', "Poll should not be undefined");

      // Set the RefundPollInstance!
      RefundPollInstance = await RefundPoll.at(refundPollAddress);
    });


    /*********************************************************************************************************
     * Tests:
     * 1. Check the amount of YES votes
     * 2. Vote YES with account 10 - 24
     * 3. Check if the amount of YES votes increased
     *********************************************************************************************************/
    it("Token holders should be able to vote YES on the refund poll", async () => {
      let refundPollAddress = await PollManagedFundInstance.refundPoll.call();
      let yesCounter = await RefundPollInstance.yesCounter.call();

      for (var i = 10; i < 25; i++) {
        let tx = await web3.eth.sendTransaction({
          from: accounts[i],
          to: refundPollAddress,
          data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000001",
          gas: 200000
        });
        assert(tx != null);
      }

      let newYesCounter = await RefundPollInstance.yesCounter.call();

      assert(newYesCounter > yesCounter, 'no YES votes added');
    });


    /*********************************************************************************************************
     * Tests:
     * 1. Check the amount of NO votes
     * 2. Vote NO with account 15 - 34
     * 3. Check if the amount of NO votes increased
     *********************************************************************************************************/
    it("Token holders should be able to vote NO on the refund poll", async () => {
      let refundPollAddress = await PollManagedFundInstance.refundPoll.call();
      let noCounter = await RefundPollInstance.noCounter.call();

      for (var i = 25; i < 35; i++) {
        let tx = await web3.eth.sendTransaction({
          from: accounts[i],
          to: refundPollAddress,
          data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000000",
          gas: 200000
        });
        assert(tx != null);
      }
      let newNoCounter = await RefundPollInstance.noCounter.call();

      assert(newNoCounter > noCounter, 'no NO votes added');
    });


    /*********************************************************************************************************
     * Tests:
     * 1. Check if the PollManagedFund is still in withdraw mode
     * 2. Check if withdraw is currently enabled
     * 3. Travel to the hold end time set in the Refund Poll
     * 4. Finalize the Refund Poll
     * 5. Check if withdraw is currently disabled
     * 6. Check if the second refund poll date is not unset
     *********************************************************************************************************/
    it("A token holder should be able finalize the first refund poll", async () => {
      let holdEndTime = await RefundPollInstance.holdEndTime.call();
      var isWithdrawEnabled = await PollManagedFundInstance.isWithdrawEnabled.call();
      var state = await PollManagedFundInstance.state.call();

      assert(state.valueOf() == 2, "Poll should still be in withdraw mode");
      assert(isWithdrawEnabled == true, "Poll should still be in withdraw mode");

      await timeTravel(parseInt(holdEndTime) - (web3.eth.getBlock('latest').timestamp));

      var tx = await RefundPollInstance.tryToFinalize();

      var isWithdrawEnabled = await PollManagedFundInstance.isWithdrawEnabled.call();
      let secondRefundPollDate = await PollManagedFundInstance.secondRefundPollDate.call();

      assert(isWithdrawEnabled == false, "Poll should not be in withdraw mode");
      assert(secondRefundPollDate != 0, "second refund poll date should be set");
    });

    /*********************************************************************************************************
     * Tests:
     * 1. Travel to the second refund poll date
     * 2. Check if address of the refund poll is unset
     * 3. Create the refund poll with account 10
     * 4. Check if address of the refund poll is no longer unset
     *********************************************************************************************************/
    it("A token holder should be able to create the second refund poll on the correct date.", async() => {
      let secondRefundPollDate = await PollManagedFundInstance.secondRefundPollDate.call();

      await timeTravel(parseInt(secondRefundPollDate) - (web3.eth.getBlock('latest').timestamp));

      var refundPollAddress = await PollManagedFundInstance.refundPoll.call();

      assert(refundPollAddress == '0x0000000000000000000000000000000000000000', "Poll should be undefined");

      var tx = await PollManagedFundInstance.createRefundPoll({
        from: accounts[10]
      });

      var refundPollAddress = await PollManagedFundInstance.refundPoll.call();

      assert(refundPollAddress != '0x0000000000000000000000000000000000000000', "Poll should not be undefined");

      // Reset the RefundPollInstance!
      RefundPollInstance = await RefundPoll.at(refundPollAddress);
    });

    it("Token holders should be able to vote YES on the refund poll", async () => {
      let refundPollAddress = await PollManagedFundInstance.refundPoll.call();
      let yesCounter = await RefundPollInstance.yesCounter.call();

      for (var i = 10; i < 25; i++) {
        let tx = await web3.eth.sendTransaction({
          from: accounts[i],
          to: refundPollAddress,
          data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000001",
          gas: 200000
        });
        assert(tx != null);
      }

      let newYesCounter = await RefundPollInstance.yesCounter.call();

      assert(newYesCounter > yesCounter, 'no YES votes added');
    });

    it("Token holders should be able to vote NO on the refund poll", async () => {
      let refundPollAddress = await PollManagedFundInstance.refundPoll.call();
      let noCounter = await RefundPollInstance.noCounter.call();

      for (var i = 25; i < 35; i++) {
        let tx = await web3.eth.sendTransaction({
          from: accounts[i],
          to: refundPollAddress,
          data: "0x4b9f5c980000000000000000000000000000000000000000000000000000000000000000",
          gas: 200000
        });
        assert(tx != null);
      }
      let newNoCounter = await RefundPollInstance.noCounter.call();

      assert(newNoCounter > noCounter, 'no NO votes added');
    });


    it("A token holder should be able finalize the second refund poll", async () => {
      let endTime = await RefundPollInstance.endTime.call();

      var isWithdrawEnabled = await PollManagedFundInstance.isWithdrawEnabled.call();
      var state = await PollManagedFundInstance.state.call();

      assert(state.valueOf() == 2, "Poll should be in withdraw mode");
      assert(isWithdrawEnabled == false, "Poll should be in withdraw mode");


      await timeTravel(parseInt(endTime) - (web3.eth.getBlock('latest').timestamp));

      var tx = await RefundPollInstance.tryToFinalize();

      var isWithdrawEnabled = await PollManagedFundInstance.isWithdrawEnabled.call();
      var state = await PollManagedFundInstance.state.call();

      assert(state.valueOf() == 3, "Poll should be in refund mode");
    });


});
