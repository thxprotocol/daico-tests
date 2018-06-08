const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");

const shared = require('./configuration.js');
const timeTravel = require("../scripts/time_travel.js");

contract('OpenSocialDAICO', async (accounts) => {
    const SECONDS_IN_A_DAY = 86400;

    let privateSaleStartTime;
    let crowdSaleStartTime;
    let daysUntilPrivateSale;
    let daysUntilCrowdSale;

    it("All instances should be available", async() => {
      context = await shared.run(accounts);

      ({ OpenSocialDAICOInstance, ReservationFundInstance, OpenSocialCoinInstance, PollManagedFundInstance, LockedTokensInstance } = context);

      assert(OpenSocialDAICOInstance !== undefined, 'has OpenSocialDAICOInstance instance');
      assert(ReservationFundInstance !== undefined, 'has ReservationFundInstance instance');
      assert(OpenSocialCoinInstance !== undefined, 'has OpenSocialCoinInstance instance');
      assert(PollManagedFundInstance !== undefined, 'has PollManagedFundInstance instance');
      assert(LockedTokensInstance !== undefined, 'has LockedTokensInstance instance');
    });

    before(async () => {
      OpenSocialDAICO.deployed().then(function(instance) {
          OpenSocialDAICOInstance = instance;
          return OpenSocialDAICOInstance.PRIVATE_SALE_START_TIME.call();
      }).then(function(r) {
          privateSaleStartTime = r.valueOf();
          return OpenSocialDAICOInstance.SALE_START_TIME.call();
      }).then(async (r) => {
          crowdSaleStartTime = r.valueOf();

          let now = Math.floor(Date.now() / 1000);
          daysUntilPrivateSale = Math.ceil( (privateSaleStartTime - now) / SECONDS_IN_A_DAY );

          await timeTravel(SECONDS_IN_A_DAY * daysUntilPrivateSale) // Travel to the private sale start date
      });
    });

    it("A privileged contributor should be able to contribute to the teamWallet if contributor is in privilegedList", () => {
        let OpenSocialDAICOInstance;
        let oldTeamWalletBalance;

        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.addToLists(web3.eth.accounts[12], false, true, false, true);
        }).then(() => {
            return OpenSocialDAICOInstance.teamWallet.call();
        }).then(function(teamWalletAddress) {
            return web3.eth.getBalance(teamWalletAddress);
        }).then(function(r) {
            oldTeamWalletBalance = web3.fromWei(r.valueOf(), "ether");

            return OpenSocialDAICOInstance.sendTransaction({
                from: web3.eth.accounts[12],
                to: OpenSocialDAICO.address,
                value: web3.toWei(500, "ether")
            });
        }).then(() => {
            return OpenSocialDAICOInstance.teamWallet.call();
        }).then(function(teamWalletAddress) {
            return web3.eth.getBalance(teamWalletAddress);
        }).then(function(r) {
            let newTeamWalletbalance = web3.fromWei(r.valueOf(), "ether");
            let calculatedNewTeamWalletBalance = parseInt(oldTeamWalletBalance) + 500;
            assert.equal(newTeamWalletbalance, calculatedNewTeamWalletBalance, "500 ether is not added to the teamWallet");
        });
    });

    it("A contributor should be able to contribute to the Reservation Fund if contributor is not whitelisted", () => {
        let OpenSocialDAICOInstance;
        return OpenSocialDAICO.deployed().then(async (instance) => {
            OpenSocialDAICOInstance = instance;

            let now = Math.floor(Date.now() / 1000);
            daysUntilCrowdSale = Math.ceil( (crowdSaleStartTime - now) / SECONDS_IN_A_DAY );

            await timeTravel(SECONDS_IN_A_DAY * ((daysUntilCrowdSale - daysUntilPrivateSale) + 1)) // Travel to the crowd sale start date

            return OpenSocialDAICOInstance.sendTransaction({
                from: web3.eth.accounts[10],
                to: OpenSocialDAICO.address,
                value: web3.toWei(250, "ether")
            });
        }).then(function(tx) {
            return web3.eth.getBalance(ReservationFund.address);
        }).then(function(r) {
            assert.equal(r.valueOf(), web3.toWei(250, "ether"), "the balance of the Reservation Fund is " + r.valueOf() + " ETH and not " + "250 ETH");
        });
    });

    it("Contributions in the Reservation Fund should be transfered to the Poll Managed Fund when the contributor becomes whitelisted", () => {
        let OpenSocialDAICOInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.addToLists(web3.eth.accounts[10], true, false, false, false);
        }).then(function(tx) {
            return web3.eth.getBalance(PollManagedFund.address);
        }).then(function(r) {
            assert.equal(r.valueOf(), web3.toWei(250, "ether"), "the balance of the Poll Managed Fund is " + r.valueOf() + " ETH and not " + "250 ETH");
        }).then(function(tx) {
            return web3.eth.getBalance(ReservationFund.address);
        }).then(function(r) {
            assert.equal(r.valueOf(), web3.toWei(0, "ether"), "the balance of the Reservation Fund is " + r.valueOf() + " ETH and not " + "0 ETH");
        });
    });

    it("A contributor should be able to contribute to the Poll Managed Fund if contributor is already whitelisted", () => {
        let OpenSocialDAICOInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.addToLists(web3.eth.accounts[11], true, false, false, false);
        }).then(function(tx) {
            return OpenSocialDAICOInstance.sendTransaction({
                from: web3.eth.accounts[11],
                to: OpenSocialDAICO.address,
                value: web3.toWei(500, "ether")
            });
        }).then(function(tx) {
            return web3.eth.getBalance(PollManagedFund.address);
        }).then(function(r) {
            // Add another assertaton that checks if 5 ether is substracted from account 10
            // Add another assertion that checks if the amount of contributors is 2
            assert.equal(web3.fromWei(r.valueOf(), "ether"), 750, "750 ether in total is not contributed in the reservation fund");
        });
    });

    it("A contributor should be able to refund its payment when soft cap is not met", () => {
        let PollManagedFundInstance;
        let OpenSocialDAICOInstance;
        let oldBalance = web3.eth.getBalance(web3.eth.accounts[11]);

        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.forceCrowdsaleRefund();
        }).then(() => {
            return PollManagedFund.deployed();
        }).then(function(instance) {
            PollManagedFundInstance = instance;
            return PollManagedFundInstance.state.call();
        }).then(function(r) {
            assert.equal(r.valueOf(), 1, "The current state is " + r.valueOf() + " and not " + 1 + ".");

            return PollManagedFundInstance.refundCrowdsaleContributor({ from: web3.eth.accounts[11] });
        }).then(function(r) {
            let currentBalance = web3.eth.getBalance(web3.eth.accounts[11]);
            let newBalance = parseInt(web3.fromWei(currentBalance, "ether").valueOf());
            let calculatedNewBalance = parseInt(web3.fromWei(oldBalance, "ether").valueOf()) + 500;

            assert.equal(newBalance, calculatedNewBalance, "The new balance doesn't equal the old balance with refuned 500 ETH");
        });
    });
});
