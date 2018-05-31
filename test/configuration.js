const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");
const LockedTokens = artifacts.require("LockedTokens");

const run = exports.run = async(accounts) => {
  const OpenSocialDAICOInstance = await OpenSocialDAICO.deployed();
  const ReservationFundInstance = await ReservationFund.deployed();
  const OpenSocialCoinInstance = await OpenSocialCoin.deployed();
  const PollManagedFundInstance = await PollManagedFund.deployed();
  const LockedTokensInstance = await LockedTokens.deployed();

  const privateSaleHardCap = 655; // 655 in ETH
  const softCap = 1500; // 5714 in ETH
  const hardCap = 2500; // 22857 in ETH
  const tokenPriceNum = 35000;  // 35000 in OSC
  const tokenPriceDenom = 1;  // 1 in ETH

  it("OpenSocialDAICO contract is deployed", () => {
    assert(OpenSocialDAICOInstance !== undefined, "OpenSocialDAICO is deployed");
  });

  it("ReservationFund contract is deployed", () => {
    assert(ReservationFundInstance !== undefined, "ReservationFund is deployed");
  });

  it("OpenSocialCoin contract is deployed", () => {
    assert(OpenSocialCoinInstance !== undefined, "OpenSocialCoin is deployed");
  });

  it("PollManagedFund contract is deployed", () => {
    assert(PollManagedFundInstance !== undefined, "PollManagedFund is deployed");
  });

  it("LockedTokens contract is deployed", () => {
    assert(LockedTokensInstance !== undefined, "LockedTokens is deployed");
  });

  it("The manager should be able to set the owners of the token contract", () => {
      let OpenSocialCoinInstance;
      return OpenSocialCoin.deployed().then(function(instance) {
          OpenSocialCoinInstance = instance;
          return OpenSocialCoinInstance.setOwners([OpenSocialDAICO.address, PollManagedFund.address]);
      }).then(() => {
          return OpenSocialCoinInstance.owners.call(0);
      }).then(function(firstOwner) {
          assert.equal(firstOwner, OpenSocialDAICO.address, "OpenSocialDAICO is not set to " + OpenSocialDAICO.adress);
          return OpenSocialCoinInstance.owners.call(1);
      }).then(function(secondOwner) {
          assert.equal(secondOwner, PollManagedFund.address, "PollManagedFund is not set to " + PollManagedFund.adress);
      });
  });

  it("The manager should be able to set the locked token address on the Poll Managed Fund contract", () => {
      let PollManagedFundInstance;
      return PollManagedFund.deployed().then(function(instance) {
          PollManagedFundInstance = instance;
          return PollManagedFundInstance.setLockedTokenAddress(LockedTokens.address)
      }).then(() => {
          return PollManagedFundInstance.lockedTokenAddress.call();
      }).then(function(lockedTokenAddress) {
        assert.equal(lockedTokenAddress, LockedTokens.address, "lockedTokens address is not set to " + LockedTokens.adress);
      });
  });

  it("The manager should be able to set the token address on the Poll Managed Fund contract", () => {
      let PollManagedFundInstance;
      return PollManagedFund.deployed().then(function(instance) {
          PollManagedFundInstance = instance;
          return PollManagedFundInstance.setTokenAddress(OpenSocialCoin.address)
      }).then(() => {
          return PollManagedFundInstance.token.call();
      }).then(function(tokenAddress) {
        assert.equal(tokenAddress, OpenSocialCoin.address, "token address is not set to the correct address " + OpenSocialCoin.adress);
      });
  });

  it("The manager should be able to set the crowdsale address on Poll Managed Fund contract", () => {
      let PollManagedFundInstance;
      return PollManagedFund.deployed().then(function(instance) {
          PollManagedFundInstance = instance;
          return PollManagedFundInstance.setCrowdsaleAddress(OpenSocialDAICO.address)
      }).then(() => {
          return PollManagedFundInstance.crowdsaleAddress.call();
      }).then(function(crowdsaleAddress) {
        assert.equal(crowdsaleAddress, OpenSocialDAICO.address, "crowdsale address is set");
      });
  });

  it("The manager should be able to set the crowdsale address on Reservation Fund contract", () => {
      let ReservationFundInstance;
      return ReservationFund.deployed().then(function(instance) {
          ReservationFundInstance = instance;
          return ReservationFundInstance.setCrowdsaleAddress(OpenSocialDAICO.address);
      }).then(() => {
          return ReservationFundInstance.crowdsale.call();
      }).then(function(crowdsaleAddress) {
          assert.equal(crowdsaleAddress, OpenSocialDAICO.address, "crowdsale address is set");
      });
  });

  it("The manager should be able to set the private sale hard cap in the Crowdsale contract", () => {
      let OpenSocialInstance;
      return OpenSocialDAICO.deployed().then(function(instance) {
          OpenSocialInstance = instance;
          return instance.setPrivateSaleHardCap(web3.toWei(privateSaleHardCap, "ether"));
      }).then(() => {
          return OpenSocialInstance.privateSaleHardCap.call();
      }).then(function(r) {
          assert.equal(web3.fromWei(r.valueOf(), "ether"), privateSaleHardCap, privateSaleHardCap + " ETH is not set as hard cap");
      });
  });

  it("The manager should be able to set the soft cap in the Crowdsale contract", () => {
      let OpenSocialInstance;
      return OpenSocialDAICO.deployed().then(function(instance) {
          OpenSocialInstance = instance;
          return instance.setSoftCap(web3.toWei(softCap, "ether"));
      }).then(() => {
          return OpenSocialInstance.softCap.call();
      }).then(function(r) {
          assert.equal(web3.fromWei(r.valueOf(), "ether"), softCap, softCap + " ETH is not set as soft cap");
      });
  });

  it("The manager should be able to set the hard cap in the Crowdsale contract", () => {
      let OpenSocialInstance;
      return OpenSocialDAICO.deployed().then(function(instance) {
          OpenSocialInstance = instance;
          return instance.setHardCap(web3.toWei(hardCap, "ether"));
      }).then(() => {
          return OpenSocialInstance.hardCap.call();
      }).then(function(r) {
          assert.equal(web3.fromWei(r.valueOf(), "ether"), hardCap, hardCap + " ETH is not set as hard cap");
      });
  });

  it("The manager should be able to set the token price in the Crowdsale contract", () => {
      let OpenSocialInstance;
      return OpenSocialDAICO.deployed().then(function(instance) {
          OpenSocialInstance = instance;
          return OpenSocialInstance.setTokenPrice(35000, 1);
      }).then(() => {
          return OpenSocialInstance.tokenPriceNum.call();
      }).then(function(r) {
          assert.equal(r, tokenPriceNum, tokenPriceNum + " is not set as token price numerator");
          return OpenSocialInstance.tokenPriceDenom.call();
      }).then(function(r) {
          assert.equal(r, tokenPriceDenom, tokenPriceDenom + " is not set as token price denominator");
      });
  });

  it("The manager should be able to set the locked token address in the Crowdsale contract", () => {
      let OpenSocialDAICOInstance;
      return OpenSocialDAICO.deployed().then(function(instance) {
          OpenSocialDAICOInstance = instance;
          return OpenSocialDAICOInstance.setLockedTokens(LockedTokens.address);
      }).then(() => {
          return OpenSocialDAICOInstance.lockedTokens.call();
      }).then(function(lockedTokens) {
          assert.equal(lockedTokens, LockedTokens.address, "lockedTokens address is not set to " + LockedTokens.address);
      });
  });

  return { OpenSocialDAICOInstance, ReservationFundInstance, OpenSocialCoinInstance, PollManagedFundInstance, LockedTokensInstance };
};

contract('Configuration', run);
