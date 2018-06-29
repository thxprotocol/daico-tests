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

    it("Crowdsale should be finalized and fund in Withdraw Mode.", async() => {
      // Contribute in bonus window 1
      let crowdSaleStartTime = await OpenSocialDAICOInstance.SALE_START_TIME.call().valueOf();
      let crowdSaleEndTime = await OpenSocialDAICOInstance.SALE_END_TIME.call().valueOf();

      await timeTravel((parseInt(crowdSaleStartTime) + 86400) - web3.eth.getBlock('latest').timestamp); // + 86400 seconds == 1 day

      await OpenSocialDAICOInstance.addToWhiteList(web3.eth.accounts[10]);
      var tx1 = await OpenSocialDAICOInstance.sendTransaction({
          from: web3.eth.accounts[10],
          to: OpenSocialDAICO.address,
          value: web3.toWei(1, "ether")
      });

      await OpenSocialDAICOInstance.addToWhiteList(web3.eth.accounts[11]);
      var tx2 = await OpenSocialDAICOInstance.sendTransaction({
          from: web3.eth.accounts[11],
          to: OpenSocialDAICO.address,
          value: web3.toWei(750, "ether")
      });

      await OpenSocialDAICOInstance.addToWhiteList(web3.eth.accounts[12]);
      var tx3 = await OpenSocialDAICOInstance.sendTransaction({
          from: web3.eth.accounts[12],
          to: OpenSocialDAICO.address,
          value: web3.toWei(750, "ether")
      });

      await timeTravel(crowdSaleEndTime - web3.eth.getBlock('latest').timestamp);

      await OpenSocialDAICOInstance.finalizeCrowdsale();

      let state = (await PollManagedFundInstance.state.call()).valueOf();
      var balance = web3.fromWei(await OpenSocialCoinInstance.balanceOf(accounts[10]), "ether").valueOf();

      assert(tx1 != null, "Transaction 1 of 1 ETH failed.");
      assert(tx2 != null, "Transaction 2 of 750 ETH failed.");
      assert(tx3 != null, "Transaction 3 of 750 ETH failed.");

      assert.equal(state, 2, "The current state is " + state + " and not " + 2 + ".");
      assert.equal(balance, config.tokenPriceNum * 1.1, "Token amount is not correct.");
    });

    it("Contributor should be able to transfer his tokens to another wallet.", async() => {
      var amountInWei = await OpenSocialCoinInstance.balanceOf(accounts[10]).valueOf();
      var amount= web3.fromWei(amountInWei, "ether").valueOf();

      // Allow transfers
      await OpenSocialCoinInstance.enableTransfers();

      // Transfer tokens
      await OpenSocialCoinInstance.approve(web3.eth.accounts[10], amountInWei, { from: web3.eth.accounts[10] });
      await OpenSocialCoinInstance.transferFrom(web3.eth.accounts[10], web3.eth.accounts[15], amountInWei, { from: web3.eth.accounts[10] });

      var balanceSender = web3.fromWei(await OpenSocialCoinInstance.balanceOf(accounts[10]), "ether").valueOf();
      var balanceReceiver = web3.fromWei(await OpenSocialCoinInstance.balanceOf(accounts[15]), "ether").valueOf();

      assert.equal(balanceSender, 0, "Token amount is not correct.");
      assert.equal(balanceReceiver, amount, "Token amount is not correct.");
    });

});
