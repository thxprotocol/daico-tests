const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const PollManagedFund = artifacts.require("PollManagedFund");
const LockedTokens = artifacts.require("LockedTokens");

const config = require("./_config.js");

const run = exports.run = async (accounts) => {
  const OpenSocialDAICOInstance = await OpenSocialDAICO.deployed();
  const ReservationFundInstance = await ReservationFund.deployed();
  const OpenSocialCoinInstance = await OpenSocialCoin.deployed();
  const PollManagedFundInstance = await PollManagedFund.deployed();
  const LockedTokensInstance = await LockedTokens.deployed();

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

  it("The manager should be able to set the owners of the token contract", async () => {
      await OpenSocialCoinInstance.setOwners([OpenSocialDAICO.address, PollManagedFund.address]);
      let firstOwner = await OpenSocialCoinInstance.owners.call(0);
      let secondOwner = await OpenSocialCoinInstance.owners.call(1);

      assert.equal(firstOwner, OpenSocialDAICO.address, "OpenSocialDAICO is not set to " + OpenSocialDAICO.adress);
      assert.equal(secondOwner, PollManagedFund.address, "PollManagedFund is not set to " + PollManagedFund.adress);
  });

  it("The manager should be able to set the locked token address on the Poll Managed Fund contract", async () => {
      await PollManagedFundInstance.setLockedTokenAddress(LockedTokens.address);
      let lockedTokenAddress = await PollManagedFundInstance.lockedTokenAddress.call();

      assert.equal(lockedTokenAddress, LockedTokens.address, "lockedTokens address is not set to " + LockedTokens.adress);
  });

  it("The manager should be able to set the token address on the Poll Managed Fund contract", async () => {
      await PollManagedFundInstance.setTokenAddress(OpenSocialCoin.address);
      let tokenAddress = await PollManagedFundInstance.token.call();

      assert.equal(tokenAddress, OpenSocialCoin.address, "token address is not set to the correct address " + OpenSocialCoin.adress);
  });

  it("The manager should be able to set the crowdsale address on Poll Managed Fund contract", async () => {
      await PollManagedFundInstance.setCrowdsaleAddress(OpenSocialDAICO.address)
      let crowdsaleAddress = await PollManagedFundInstance.crowdsaleAddress.call();

      assert.equal(crowdsaleAddress, OpenSocialDAICO.address, "crowdsale address is set");
  });

  it("The manager should be able to set the crowdsale address on Reservation Fund contract", async () => {
      await ReservationFundInstance.setCrowdsaleAddress(OpenSocialDAICO.address);
      let crowdsaleAddress = await ReservationFundInstance.crowdsale.call();

      assert.equal(crowdsaleAddress, OpenSocialDAICO.address, "crowdsale address is set");
  });

  it("The manager should be able to set the private sale hard cap in the Crowdsale contract", async () => {
      await OpenSocialDAICOInstance.setPrivateSaleHardCap(web3.toWei(config.privateSaleHardCap, "ether"));
      let privateSaleHardCap = await OpenSocialDAICOInstance.privateSaleHardCap.call();

      assert.equal(web3.fromWei(privateSaleHardCap.valueOf(), "ether"), config.privateSaleHardCap, config.privateSaleHardCap + " ETH is not set as hard cap");
  });

  it("The manager should be able to set the soft cap in the Crowdsale contract", async () => {
      await OpenSocialDAICOInstance.setSoftCap(web3.toWei(config.softCap, "ether"));
      let softCap = await OpenSocialDAICOInstance.softCap.call();

      assert.equal(web3.fromWei(softCap.valueOf(), "ether"), config.softCap, config.softCap + " ETH is not set as soft cap");
  });

  it("The manager should be able to set the hard cap in the Crowdsale contract", async () => {
      await OpenSocialDAICOInstance.setHardCap(web3.toWei(config.hardCap, "ether"));
      let hardCap = await OpenSocialDAICOInstance.hardCap.call();

      assert.equal(web3.fromWei(hardCap.valueOf(), "ether"), config.hardCap, config.hardCap + " ETH is not set as hard cap");
  });

  it("The manager should be able to set the token price in the Crowdsale contract", async () => {
      await OpenSocialDAICOInstance.setTokenPrice(config.tokenPriceNum, config.tokenPriceDenom);
      let tokenPriceNum = await OpenSocialDAICOInstance.tokenPriceNum.call();
      let tokenPriceDenom = await OpenSocialDAICOInstance.tokenPriceDenom.call();

      assert.equal(tokenPriceNum, config.tokenPriceNum, config.tokenPriceNum + " is not set as token price numerator");
      assert.equal(tokenPriceDenom, config.tokenPriceDenom, config.tokenPriceDenom + " is not set as token price denominator");
  });

  it("The manager should be able to set the locked token address in the Crowdsale contract", async () => {
      await OpenSocialDAICOInstance.setLockedTokens(LockedTokens.address);
      let lockedTokens = await OpenSocialDAICOInstance.lockedTokens.call();

      assert.equal(lockedTokens, LockedTokens.address, "lockedTokens address is not set to " + LockedTokens.address);
  });

  return { OpenSocialDAICOInstance, ReservationFundInstance, OpenSocialCoinInstance, PollManagedFundInstance, LockedTokensInstance };

};

contract('Configuration', run);
