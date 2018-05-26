const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");

contract('OpenSocialDAICO', function(accounts) {
    let privateSaleHardCap = 655;
    let softCap = 1500;
    let hardCap = 2500;
    let tokenPriceNum = 35000;
    let tokenPriceDenom = 1;

    it("The manager should be able to set the owners of the token contract", function() {
        let OpenSocialCoinInstance;
        return OpenSocialCoin.deployed().then(function(instance) {
            OpenSocialCoinInstance = instance;
            return OpenSocialCoinInstance.setOwners([OpenSocialDAICO.address, PollManagedFund.address]);
        }).then(function() {
            return OpenSocialCoinInstance.owners.call(0);
        }).then(function(firstOwner) {
            assert.equal(firstOwner, OpenSocialDAICO.address, "OpenSocialDAICO is not set to " + OpenSocialDAICO.adress);
            return OpenSocialCoinInstance.owners.call(1);
        }).then(function(secondOwner) {
            assert.equal(secondOwner, PollManagedFund.address, "PollManagedFund is not set to " + PollManagedFund.adress);
        });
    });

    it("The manager should be able to set the locked token address on the Poll Managed Fund contract", function() {
        let PollManagedFundInstance;
        return PollManagedFund.deployed().then(function(instance) {
            PollManagedFundInstance = instance;
            return PollManagedFundInstance.setLockedTokenAddress(LockedTokens.address)
        }).then(function() {
            return PollManagedFundInstance.lockedTokenAddress.call();
        }).then(function(lockedTokenAddress) {
          assert.equal(lockedTokenAddress, LockedTokens.address, "lockedTokens address is not set to " + LockedTokens.adress);
        });
    });

    it("The manager should be able to set the token address on the Poll Managed Fund contract", function() {
        let PollManagedFundInstance;
        return PollManagedFund.deployed().then(function(instance) {
            PollManagedFundInstance = instance;
            return PollManagedFundInstance.setTokenAddress(OpenSocialCoin.address)
        }).then(function() {
            return PollManagedFundInstance.token.call();
        }).then(function(tokenAddress) {
          assert.equal(tokenAddress, OpenSocialCoin.address, "token address is not set to the correct address " + OpenSocialCoin.adress);
        });
    });

    it("The manager should be able to set the crowdsale address on Poll Managed Fund contract", function() {
        let PollManagedFundInstance;
        return PollManagedFund.deployed().then(function(instance) {
            PollManagedFundInstance = instance;
            return PollManagedFundInstance.setCrowdsaleAddress(OpenSocialDAICO.address)
        }).then(function() {
            return PollManagedFundInstance.crowdsaleAddress.call();
        }).then(function(crowdsaleAddress) {
          assert.equal(crowdsaleAddress, OpenSocialDAICO.address, "crowdsale address is set");
        });
    });

    it("The manager should be able to set the crowdsale address on Reservation Fund contract", function() {
        let ReservationFundInstance;
        return ReservationFund.deployed().then(function(instance) {
            ReservationFundInstance = instance;
            return ReservationFundInstance.setCrowdsaleAddress(OpenSocialDAICO.address);
        }).then(function() {
            return ReservationFundInstance.crowdsale.call();
        }).then(function(crowdsaleAddress) {
            assert.equal(crowdsaleAddress, OpenSocialDAICO.address, "crowdsale address is set");
        });
    });

    it("The manager should be able to set the private sale hard cap in the Crowdsale contract", function() {
        let OpenSocialInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialInstance = instance;
            return instance.setPrivateSaleHardCap(web3.toWei(privateSaleHardCap, "ether"));
        }).then(function() {
            return OpenSocialInstance.privateSaleHardCap.call();
        }).then(function(r) {
            assert.equal(web3.fromWei(r.valueOf(), "ether"), privateSaleHardCap, privateSaleHardCap + " ETH is not set as hard cap");
        });
    });

    it("The manager should be able to set the soft cap in the Crowdsale contract", function() {
        let OpenSocialInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialInstance = instance;
            return instance.setSoftCap(web3.toWei(softCap, "ether"));
        }).then(function() {
            return OpenSocialInstance.softCap.call();
        }).then(function(r) {
            assert.equal(web3.fromWei(r.valueOf(), "ether"), softCap, softCap + " ETH is not set as soft cap");
        });
    });

    it("The manager should be able to set the hard cap in the Crowdsale contract", function() {
        let OpenSocialInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialInstance = instance;
            return instance.setHardCap(web3.toWei(hardCap, "ether"));
        }).then(function() {
            return OpenSocialInstance.hardCap.call();
        }).then(function(r) {
            assert.equal(web3.fromWei(r.valueOf(), "ether"), hardCap, hardCap + " ETH is not set as hard cap");
        });
    });

    it("The manager should be able to set the token price in the Crowdsale contract", function() {
        let OpenSocialInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialInstance = instance;
            return OpenSocialInstance.setTokenPrice(35000, 1);
        }).then(function() {
            return OpenSocialInstance.tokenPriceNum.call();
        }).then(function(r) {
            assert.equal(r, tokenPriceNum, tokenPriceNum + " is not set as token price numerator");
            return OpenSocialInstance.tokenPriceDenom.call();
        }).then(function(r) {
            assert.equal(r, tokenPriceDenom, tokenPriceDenom + " is not set as token price denominator");
        });
    });

    it("The manager should be able to set the locked token address in the Crowdsale contract", function() {
        let OpenSocialDAICOInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.setLockedTokens(LockedTokens.address);
        }).then(function() {
            return OpenSocialDAICOInstance.lockedTokens.call();
        }).then(function(lockedTokens) {
            assert.equal(lockedTokens, LockedTokens.address, "lockedTokens address is not set to " + LockedTokens.address);
        });
    });

    it("A privileged contributor should be able to contribute to the teamWallet if contributor is in privilegedList", function() {
        let OpenSocialDAICOInstance;
        let oldTeamWalletBalance;

        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.addToLists(web3.eth.accounts[12], false, true, false, true);
        }).then(function() {
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
        }).then(function() {
            return OpenSocialDAICOInstance.teamWallet.call();
        }).then(function(teamWalletAddress) {
            return web3.eth.getBalance(teamWalletAddress);
        }).then(function(r) {
            let newTeamWalletbalance = web3.fromWei(r.valueOf(), "ether");
            let calculatedNewTeamWalletBalance = parseInt(oldTeamWalletBalance) + 500;
            assert.equal(newTeamWalletbalance, calculatedNewTeamWalletBalance, "500 ether is not added to the teamWallet");
        });
    });

    // TRAVEL IN TIME INTO THE PUBLIC SALE PERIOD
    const SECONDS_IN_A_DAY = 86400;
    const jsonrpc = '2.0'
    const id = 0

    const send = (method, params = []) => {
      web3.currentProvider.send({ id, jsonrpc, method, params })
    }

    const timeTravel = async seconds => {
      await send('evm_increaseTime', [seconds])
      await send('evm_mine')
    }

    it("A contributor should be able to contribute to the Reservation Fund if contributor is not whitelisted", async function() {
        await timeTravel(SECONDS_IN_A_DAY * 100)

        let OpenSocialDAICOInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
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

    it("Contributions in the Reservation Fund should be transfered to the Poll Managed Fund when the contributor becomes whitelisted", function() {
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

    it("A contributor should be able to contribute to the Poll Managed Fund if contributor is already whitelisted", function() {
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

    it("A contributor should be able to refund its payment when soft cap is not met", function() {
        let PollManagedFundInstance;
        let OpenSocialDAICOInstance;
        let oldBalance = web3.eth.getBalance(web3.eth.accounts[11]);

        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.forceCrowdsaleRefund();
        }).then(function() {
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
