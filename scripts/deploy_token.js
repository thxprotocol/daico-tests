var AbyssJSON = require('./build/contracts/ABYSS.json');

module.exports = function(callback) {
  const AbyssContract = web3.eth.contract(AbyssJSON.abi);
  const listener = web3.eth.accounts[0];
  const owners = [web3.eth.accounts[0]];
  const manager = web3.eth.accounts[0];

  AbyssContract.new(
    listener,
    owners,
    manager,
    {
      from: web3.eth.accounts[0],
      data: AbyssJSON.bytecode,
      gas: '4700000',
      gasPrice: '200000000000'
    }, function (e, contract) {
      console.log(e);
      if (typeof contract.address != 'undefined') {
        console.log('Abyss is successfully deployed!.\nContract Address: ' + contract.address + '\nTransaction Hash: ' + contract.transactionHash);
      }
    }
  );

}
