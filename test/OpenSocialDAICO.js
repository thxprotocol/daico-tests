const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const LockedTokens = artifacts.require("LockedTokens");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");

contract('manager', function(accounts) {

    it("should set the owners of the token contract", function() {
        let OpenSocialCoinInstance;
        return OpenSocialCoin.deployed().then(function(instance) {
            OpenSocialCoinInstance = instance;
            return OpenSocialCoinInstance.setOwners([OpenSocialDAICO.address, PollManagedFund.address, LockedTokens.address]);
        }).then(function() {
            return OpenSocialCoinInstance.owners.call(0);
        }).then(function(firstOwner) {
            assert.equal(firstOwner, OpenSocialDAICO.address, "OpenSocialDAICO is set as owner");
            return OpenSocialCoinInstance.owners.call(1);
        }).then(function(secondOwner) {
            assert.equal(secondOwner, PollManagedFund.address, "PollManagedFund is set as owner");
        });
    });

    it("should set the locked token address", function() {
        let PollManagedFundInstance;
        return PollManagedFund.deployed().then(function(instance) {
            PollManagedFundInstance = instance;
            return PollManagedFundInstance.setLockedTokenAddress(LockedTokens.address)
        }).then(function() {
            return PollManagedFundInstance.lockedTokenAddress.call();
        }).then(function(lockedTokenAddress) {
          assert.equal(lockedTokenAddress, LockedTokens.address, "lockedTokens address is set");
        });
    });

    it("should set the token address", function() {
        let PollManagedFundInstance;
        return PollManagedFund.deployed().then(function(instance) {
            PollManagedFundInstance = instance;
            return PollManagedFundInstance.setTokenAddress(OpenSocialCoin.address)
        }).then(function() {
            return PollManagedFundInstance.token.call();
        }).then(function(tokenAddress) {
          assert.equal(tokenAddress, OpenSocialCoin.address, "token address is set");
        });
    });

    it("should set the crowdsale address on poll managed fund", function() {
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

    it("should set the crowdsale address on reservation fund", function() {
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

    it("should set the token price", function() {
        let OpenSocialInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialInstance = instance;
            return OpenSocialInstance.setTokenPrice(35000, 1);
        }).then(function() {
            return OpenSocialInstance.tokenPriceNum.call();
        }).then(function(tokenPriceNum) {
            assert.equal(tokenPriceNum, 35000, "35000 is set as token price numerator");
            return OpenSocialInstance.tokenPriceDenom.call();
        }).then(function(tokenPriceDenom) {
            assert.equal(tokenPriceDenom, 1, "1 is set as token price denominator");
        });
    });

    it("should set the locked token address", function() {
        let OpenSocialDAICOInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.setLockedTokens(LockedTokens.address);
        }).then(function() {
            return OpenSocialDAICOInstance.lockedTokens.call();
        }).then(function(lockedTokens) {
            assert.equal(lockedTokens, LockedTokens.address, "lockedTokens address is set to " + LockedTokens.address);
        });
    });

    it("should transfer contributed ether to the reservation fund", function() {
        let OpenSocialDAICOInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.sendTransaction({
                from: web3.eth.accounts[8],
                to: OpenSocialDAICO.address,
                value: web3.toWei(5, "ether")
            });
        }).then(function(tx) {
            return web3.eth.getBalance(ReservationFund.address);
        }).then(function(balance) {
            assert.equal(balance.valueOf(), web3.toWei(5, "ether"), "5 ether is contributed in the reservation fund");
        });
    });

    it("should add account 11 address to lists", function() {
        let OpenSocialDAICOInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.addToLists(web3.eth.accounts[8], true, true, true, true);
        }).then(function(tx) {
            return web3.eth.getBalance(PollManagedFund.address);
        }).then(function(balance) {
            assert.equal(balance.valueOf(), web3.toWei(5, "ether"), "5 ether is contributed in the poll managed fund");
        });
    });

    it("should transfer contributed ether to the poll managed fund", function() {
        let OpenSocialDAICOInstance;
        return OpenSocialDAICO.deployed().then(function(instance) {
            OpenSocialDAICOInstance = instance;
            return OpenSocialDAICOInstance.addToLists(web3.eth.accounts[9], true, true, true, true);
        }).then(function(tx) {
            return OpenSocialDAICOInstance.sendTransaction({
                from: web3.eth.accounts[9],
                to: OpenSocialDAICO.address,
                value: web3.toWei(5, "ether")
            });
        }).then(function(tx) {
            return web3.eth.getBalance(PollManagedFund.address);
        }).then(function(balance) {
            assert.equal(balance.valueOf(), web3.toWei(5, "ether"), "5 ether is contributed in the reservation fund");
        });
    });

    console.log(OpenSocialCoin.address);
    console.log(OpenSocialDAICO.address);
    console.log(ReservationFund.address);
    console.log(PollManagedFund.address);
    console.log(LockedTokens.address);

    console.log(web3.eth.accounts[8]);
    console.log(web3.eth.accounts[9]);

});
