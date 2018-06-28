const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");

const sharedConfig = require('./_shared_config.js');
const timeTravel = require("../scripts/time_travel.js");

contract('OpenSocialDAICO', async (accounts) => {

    it("All instances should be available", async () => {
      context = await sharedConfig.run(accounts);

      ({ OpenSocialDAICOInstance, ReservationFundInstance, OpenSocialCoinInstance, PollManagedFundInstance, LockedTokensInstance } = context);

      assert(OpenSocialDAICOInstance !== undefined, 'has OpenSocialDAICOInstance instance');
      assert(ReservationFundInstance !== undefined, 'has ReservationFundInstance instance');
      assert(OpenSocialCoinInstance !== undefined, 'has OpenSocialCoinInstance instance');
      assert(PollManagedFundInstance !== undefined, 'has PollManagedFundInstance instance');
      assert(LockedTokensInstance !== undefined, 'has LockedTokensInstance instance');
    });

    it("A privileged contributor should be able to contribute to the teamWallet if contributor is in privilegedList", async () => {
      let privateSaleStartTime = await OpenSocialDAICOInstance.PRIVATE_SALE_START_TIME.call();
      let blocktime = await web3.eth.getBlock('latest').timestamp;

      await timeTravel(privateSaleStartTime - blocktime);

      await OpenSocialDAICOInstance.addToLists(web3.eth.accounts[12], false, true, false, true);

      let teamWalletAddress = await OpenSocialDAICOInstance.teamWallet.call();
      var balance = await web3.eth.getBalance(teamWalletAddress);
      let teamWalletBalance = web3.fromWei(balance.valueOf(), "ether");

      await OpenSocialDAICOInstance.sendTransaction({
          from: web3.eth.accounts[12],
          to: OpenSocialDAICO.address,
          value: web3.toWei(500, "ether")
      });

      var balance = await web3.eth.getBalance(teamWalletAddress);
      let newTeamWalletbalance = web3.fromWei(balance.valueOf(), "ether");
      let calculatedNewTeamWalletBalance = parseInt(teamWalletBalance) + 500;

      assert.equal(newTeamWalletbalance, calculatedNewTeamWalletBalance, "500 ether is not added to the teamWallet");
      // Check for bonus on contributor token wallet.
    });

    it("A contributor should be able to contribute to the Reservation Fund if contributor is not whitelisted", async () => {
        let crowdSaleStartTime = await OpenSocialDAICOInstance.SALE_START_TIME.call();
        let blocktime = await web3.eth.getBlock('latest').timestamp;

        await timeTravel((parseInt(crowdSaleStartTime) + 86400) - blocktime); // 86400 seconds == 1 day

        await OpenSocialDAICOInstance.sendTransaction({
            from: web3.eth.accounts[10],
            to: OpenSocialDAICO.address,
            value: web3.toWei(250, "ether")
        });

        var balance = web3.eth.getBalance(ReservationFund.address);
        let reservationFundBalance = balance.valueOf();

        assert.equal(reservationFundBalance, web3.toWei(250, "ether"), "the balance of the Reservation Fund is not correct.");
    });

    it("Contributions in the Reservation Fund should be transfered to the Poll Managed Fund when the contributor becomes whitelisted", async () => {
        await OpenSocialDAICOInstance.addToLists(web3.eth.accounts[10], true, false, false, false);

        var balance = await web3.eth.getBalance(PollManagedFund.address);
        let PollManagedFundBalance = balance.valueOf();

        assert.equal(PollManagedFundBalance, web3.toWei(250, "ether"), "the balance of the Poll Managed Fund is not correct.");

        var balance = await web3.eth.getBalance(ReservationFund.address);
        let reservationFundBalance = balance.valueOf();

        assert.equal(reservationFundBalance, web3.toWei(0, "ether"), "the balance of the Reservation Fund is not correct.");
    });

    it("A contributor should be able to contribute to the Poll Managed Fund if contributor is already whitelisted", async () => {
        await OpenSocialDAICOInstance.addToLists(web3.eth.accounts[11], true, false, false, false);
        await OpenSocialDAICOInstance.sendTransaction({
            from: web3.eth.accounts[11],
            to: OpenSocialDAICO.address,
            value: web3.toWei(500, "ether")
        });

        var balance = await web3.eth.getBalance(PollManagedFund.address);
        let PollManagedFundBalance = web3.fromWei(balance.valueOf(), "ether");

        assert.equal(PollManagedFundBalance, 750, "750 ether in total is not contributed in the reservation fund");
        // Add another assertaton that checks if 5 ether is substracted from account 10
        // Add another assertion that checks if the amount of contributors is 2
    });

    it("A contributor should be able to refund its payment when soft cap is not met", async () => {
        let oldBalance = await web3.eth.getBalance(web3.eth.accounts[11]);

        await OpenSocialDAICOInstance.forceCrowdsaleRefund();

        let state = (await PollManagedFundInstance.state.call()).valueOf();

        assert.equal(state, 1, "The current state is " + state + " and not 1.");

        await PollManagedFundInstance.refundCrowdsaleContributor({ from: web3.eth.accounts[11] });

        var balance = await web3.eth.getBalance(web3.eth.accounts[11]);
        let newBalance = parseInt(web3.fromWei(balance, "ether").valueOf());
        let calculatedNewBalance = parseInt(web3.fromWei(oldBalance, "ether").valueOf()) + 500;

        assert.equal(newBalance, calculatedNewBalance, "The new balance doesn't equal the old balance with refuned 500 ETH");
    });

});
