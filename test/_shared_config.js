const THXTokenDAICO = artifacts.require("THXTokenDAICO");
const ReservationFund = artifacts.require("ReservationFund");
const THXToken = artifacts.require("THXToken");
const PollManagedFund = artifacts.require("PollManagedFund");
const LockedTokens = artifacts.require("LockedTokens");

const config = require("./_config.js");

const run = exports.run = async (accounts) => {
  const THXTokenDAICOInstance = await THXTokenDAICO.deployed();
  const ReservationFundInstance = await ReservationFund.deployed();
  const THXTokenInstance = await THXToken.deployed();
  const PollManagedFundInstance = await PollManagedFund.deployed();
  const LockedTokensInstance = await LockedTokens.deployed();

  it("THXTokenDAICO contract is deployed", () => {
    assert(THXTokenDAICOInstance !== undefined, "THXTokenDAICO is deployed");
  });

  it("ReservationFund contract is deployed", () => {
    assert(ReservationFundInstance !== undefined, "ReservationFund is deployed");
  });

  it("THXToken contract is deployed", () => {
    assert(THXTokenInstance !== undefined, "THXToken is deployed");
  });

  it("PollManagedFund contract is deployed", () => {
    assert(PollManagedFundInstance !== undefined, "PollManagedFund is deployed");
  });

  it("LockedTokens contract is deployed", () => {
    assert(LockedTokensInstance !== undefined, "LockedTokens is deployed");
  });

  it("The manager should be able to set the owners of the token contract", async () => {
      await THXTokenInstance.setOwners([THXTokenDAICO.address, PollManagedFund.address, accounts[0]]);
      let firstOwner = await THXTokenInstance.owners.call(0);
      let secondOwner = await THXTokenInstance.owners.call(1);

      assert.equal(firstOwner, THXTokenDAICO.address, "THXTokenDAICO is not set to " + THXTokenDAICO.adress);
      assert.equal(secondOwner, PollManagedFund.address, "PollManagedFund is not set to " + PollManagedFund.adress);
  });

  it("The manager should be able to set the locked token address on the Poll Managed Fund contract", async () => {
      await PollManagedFundInstance.setLockedTokenAddress(LockedTokens.address);
      let lockedTokenAddress = await PollManagedFundInstance.lockedTokenAddress.call();

      assert.equal(lockedTokenAddress, LockedTokens.address, "lockedTokens address is not set to " + LockedTokens.adress);
  });

  it("The manager should be able to set the token address on the Poll Managed Fund contract", async () => {
      await PollManagedFundInstance.setTokenAddress(THXToken.address);
      let tokenAddress = await PollManagedFundInstance.token.call();

      assert.equal(tokenAddress, THXToken.address, "token address is not set to the correct address " + THXToken.adress);
  });

  it("The manager should be able to set the crowdsale address on Poll Managed Fund contract", async () => {
      await PollManagedFundInstance.setCrowdsaleAddress(THXTokenDAICO.address)
      let crowdsaleAddress = await PollManagedFundInstance.crowdsaleAddress.call();

      assert.equal(crowdsaleAddress, THXTokenDAICO.address, "crowdsale address is set");
  });

  it("The manager should be able to set the crowdsale address on Reservation Fund contract", async () => {
      await ReservationFundInstance.setCrowdsaleAddress(THXTokenDAICO.address);
      let crowdsaleAddress = await ReservationFundInstance.crowdsale.call();

      assert.equal(crowdsaleAddress, THXTokenDAICO.address, "crowdsale address is set");
  });

  it("The manager should be able to set the private sale hard cap in the Crowdsale contract", async () => {
      await THXTokenDAICOInstance.setPrivateSaleHardCap(web3.toWei(config.privateSaleHardCap, "ether"));
      let privateSaleHardCap = await THXTokenDAICOInstance.privateSaleHardCap.call();

      assert.equal(web3.fromWei(privateSaleHardCap.valueOf(), "ether"), config.privateSaleHardCap, config.privateSaleHardCap + " ETH is not set as hard cap");
  });

  it("The manager should be able to set the soft cap in the Crowdsale contract", async () => {
      await THXTokenDAICOInstance.setSoftCap(web3.toWei(config.softCap, "ether"));
      let softCap = await THXTokenDAICOInstance.softCap.call();

      assert.equal(web3.fromWei(softCap.valueOf(), "ether"), config.softCap, config.softCap + " ETH is not set as soft cap");
  });

  it("The manager should be able to set the hard cap in the Crowdsale contract", async () => {
      await THXTokenDAICOInstance.setHardCap(web3.toWei(config.hardCap, "ether"));
      let hardCap = await THXTokenDAICOInstance.hardCap.call();

      assert.equal(web3.fromWei(hardCap.valueOf(), "ether"), config.hardCap, config.hardCap + " ETH is not set as hard cap");
  });

  it("The manager should be able to set the token price in the Crowdsale contract", async () => {
      await THXTokenDAICOInstance.setTokenPrice(config.tokenPriceNum, config.tokenPriceDenom, config.bnbTokenPriceNum, config.bnbTokenPriceDenom);
      let tokenPriceNum = await THXTokenDAICOInstance.tokenPriceNum.call();
      let tokenPriceDenom = await THXTokenDAICOInstance.tokenPriceDenom.call();
      let bnbTokenPriceNum = await THXTokenDAICOInstance.bnbTokenPriceNum.call();
      let bnbTokenPriceDenom = await THXTokenDAICOInstance.bnbTokenPriceDenom.call();

      assert.equal(tokenPriceNum, config.tokenPriceNum, config.tokenPriceNum + " is not set as token price numerator");
      assert.equal(tokenPriceDenom, config.tokenPriceDenom, config.tokenPriceDenom + " is not set as token price denominator");
      assert.equal(bnbTokenPriceNum, config.bnbTokenPriceNum, config.bnbTokenPriceNum + " is not set as token price numerator");
      assert.equal(bnbTokenPriceDenom, config.bnbTokenPriceDenom, config.bnbTokenPriceDenom + " is not set as token price denominator");
  });

  it("The manager should be able to set the locked token address in the Crowdsale contract", async () => {
      await THXTokenDAICOInstance.setLockedTokens(LockedTokens.address);
      let lockedTokens = await THXTokenDAICOInstance.lockedTokens.call();

      assert.equal(lockedTokens, LockedTokens.address, "lockedTokens address is not set to " + LockedTokens.address);
  });

  return { THXTokenDAICOInstance, ReservationFundInstance, THXTokenInstance, PollManagedFundInstance, LockedTokensInstance };

};

contract('Configuration', run);
