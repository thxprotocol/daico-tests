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

    it("Crowdsale should be finalized and fund in Withdraw Mode.", async() => {
      // Contribute in bonus window 1
      let crowdSaleStartTime = await THXTokenDAICOInstance.SALE_START_TIME();
      let crowdSaleEndTime = await THXTokenDAICOInstance.SALE_END_TIME();

      await timeTravel((parseInt(crowdSaleStartTime) + 86400) - web3.eth.getBlock('latest').timestamp); // + 86400 seconds == 1 day

      await THXTokenDAICOInstance.addToWhiteList(accounts[10]);
      var tx1 = await THXTokenDAICOInstance.sendTransaction({
          from: accounts[10],
          to: THXTokenDAICO.address,
          value: web3.toWei(1, "ether")
      });

      await THXTokenDAICOInstance.addToWhiteList(accounts[11]);
      var tx2 = await THXTokenDAICOInstance.sendTransaction({
          from: accounts[11],
          to: THXTokenDAICO.address,
          value: web3.toWei(750, "ether")
      });

      await THXTokenDAICOInstance.addToWhiteList(accounts[12]);
      var tx3 = await THXTokenDAICOInstance.sendTransaction({
          from: accounts[12],
          to: THXTokenDAICO.address,
          value: web3.toWei(750, "ether")
      });

      await timeTravel((parseInt(crowdSaleEndTime) + 86400) - web3.eth.getBlock('latest').timestamp);

      await THXTokenDAICOInstance.finalizeCrowdsale();

      let state = (await PollManagedFundInstance.state()).valueOf();
      var balance = web3.fromWei(await THXTokenInstance.balanceOf(accounts[10]), "ether").valueOf();

      assert(tx1 != null, "Transaction 1 of 1 ETH failed.");
      assert(tx2 != null, "Transaction 2 of 750 ETH failed.");
      assert(tx3 != null, "Transaction 3 of 750 ETH failed.");

      assert(state == 2, "The current state is " + state + " and not " + 2 + ".");
      assert(balance == config.tokenPriceNum * 1.2, "Token amount of account 10 is not correct.");
    });

    it("Reserve token wallet owner should be able to release his tokens 274 days after the crowdsale.", async () => {
      let crowdSaleEndTime = await THXTokenDAICOInstance.SALE_END_TIME();
      var blocktime = web3.eth.getBlock('latest').timestamp;

      // Travel 365 days after sale end time and tokens should be able to be unlocked
      await timeTravel((parseInt(crowdSaleEndTime) + (86400 * 300)) - blocktime);

      var blocktime = web3.eth.getBlock('latest').timestamp;

      // Allow transfers
      await THXTokenInstance.enableTransfers();

      var balanceSender = await THXTokenInstance.balanceOf(accounts[5]);

      // Release locked tokens
      await LockedTokensInstance.releaseTokens({from: accounts[5]})

      var newBalanceSender = await THXTokenInstance.balanceOf(accounts[5]);

      assert(newBalanceSender > balanceSender, "Balance sender is not higher than before release.")
    });

    it("Reserve token wallet owner should be able to transfer his tokens to another wallet.", async () => {
      // Send grants wallet funds to account 20
      var balanceSender = await THXTokenInstance.balanceOf(accounts[5]).valueOf();
      var balanceReceiver = await THXTokenInstance.balanceOf(accounts[20]).valueOf();

      // Transfer tokens
      await THXTokenInstance.approve(accounts[5], balanceSender, { from: accounts[5] });
      await THXTokenInstance.transferFrom(accounts[5], accounts[20], balanceSender, { from: accounts[5] });

      var newBalanceSender = await THXTokenInstance.balanceOf(accounts[5]).valueOf();
      var newBalanceReceiver = await THXTokenInstance.balanceOf(accounts[20]).valueOf();

      assert(newBalanceSender == 0, "Balance sender is not 0")
      assert(newBalanceReceiver > balanceReceiver, "Balance sender is higher thann before")
    });

});
