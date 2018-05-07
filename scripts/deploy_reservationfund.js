var ReservationFundJSON = require('./build/contracts/ReservationFund.json');

module.exports = function(callback){
  const ReservationFundContract = web3.eth.contract(ReservationFundJSON.abi);
  const owner = web3.eth.accounts[0];

  ReservationFundContract.new(
    owner,
    {
      from: web3.eth.accounts[0],
      data: ReservationFundJSON.bytecode,
      gas: '4700000',
      gasPrice: '200000000000'
    }, function(e, contract) {
      console.log(e);
      if (typeof contract.address != 'undefined') {
        console.log('ReservationFund is successfully deployed!\nContract Address: ' + contract.address + '\nTransaction Hash: ' + contract.transactionHash);
      }
    }
  );


}
