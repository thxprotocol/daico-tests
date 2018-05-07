var AbyssJSON = require('../build/contracts/ABYSS.json');
var ReservationFundJSON = require('../build/contracts/ReservationFund.json');

module.exports = function(callback) {
  //
  // Deployin Abyss Token contract
  const AbyssContract = web3.eth.contract(AbyssJSON.abi);
  const TheAbyssDAICOContract = web3.eth.contract(TheAbyssDAICOJSON.abi);
  const ReservationFundContract = web3.eth.contract(ReservationFundJSON.abi);
  const PollManagedFundContract = web3.eth.contract(PollManagedFundABI);

  var Token = AbyssContract.new(
    '0x0',
    [web3.eth.accounts[0]],
    web3.eth.accounts[0],
    {
      from: web3.eth.accounts[0],
      data: AbyssJSON.bytecode,
      gas: '8500000',
      gasPrice: '200000000000'
    }, function (e, ABYSS) {
      console.log(e);
      if (typeof contract.address != 'undefined') {
        console.log('Contract successfully mined!.\nContract address: ' + contract.address + '\nTransactionHash: ' + contract.transactionHash);
      }
    }
  );

  var Crowdsale = TheAbyssDAICOContract.new(
    '0x0',
    '0x98E51484DC5495bBD02b5828479AaadbD4c59510',
    '0xf10e830d1f81137af0014621e7ba5f59f581fb4d',
    '0xdab518daa10406cfbc2642ab33277f2472abb981',
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    {
      from: web3.eth.accounts[0],
      data: TheAbyssDAICOJSON.bytecode,
      gas: '8500000',
      gasPrice: '200000000000'
    }, function(e, contract) {
      console.log(e);
      if (typeof contract.address != 'undefined') {
        console.log('Contract successfully mined!.\nContract address: ' + contract.address + '\nTransactionHash: ' + contract.transactionHash);
      }
    }
  );

  //
  // Deployin ReservationFund contract
  ReservationFundContract.new(
    web3.eth.accounts[0],
    {
      from: web3.eth.accounts[0],
      data: ReservationFundJSON.bytecode,
      gas: '8500000',
      gasPrice: '200000000000'
    }, function(e, contract) {
      console.log(e);
      if (typeof contract.address != 'undefined') {
        console.log('Contract successfully mined!.\nContract address: ' + contract.address + '\nTransactionHash: ' + contract.transactionHash);
      }
    }
  );

  //
  // Deployin PollManagedFund contract
  PollManagedFundContract.new(
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    web3.eth.accounts[0],
    [],
    {
      from: web3.eth.accounts[0],
      data: PollManagedFundBIN,
      gas: '8500000',
      gasPrice: '200000000000'
    }, function(e, contract) {
      console.log(e);
      if (typeof contract.address != 'undefined') {
        console.log('Contract successfully mined!.\nContract address: ' + contract.address + '\nTransactionHash: ' + contract.transactionHash);
      }
    }
  );

}
