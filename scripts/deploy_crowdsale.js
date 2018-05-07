var TheAbyssDAICOJSON = require('./build/contracts/TheAbyssDAICO.json');

module.exports = function(callback){
  const TheAbyssDAICOContract = web3.eth.contract(TheAbyssDAICOJSON.abi);
  const bnbTokenAddress = '0xb8c77482e45f1f44de1745f52c74426c631bdd52'; // Only available on mainnet
  // const tokenAddress = '0xd2cc7cda8a859e229673a2399bc03e390b625b5c'; // GETH
  const tokenAddress = '0x88438fc441b10a5fd1053da1a3f61575c2be11bb';
  // const fundAddress = '0x1afbb2a9b7f33dea2e5923dc2f5a74cd41b28196'; // GETH
  const fundAddress = '0x89a39167c6c94c731838301cdde61e6d4a655382';
  // const reservationFundAddress = '0xe882c25a9903f844a7b2fce416757178a8fa7a5c'; // GETH
  const reservationFundAddress = '0x15ef2dc7612d3a860487f18e94d42069e8ecf0f4';
  const bnbTokenWallet = web3.eth.accounts[8];
  const referralTokenWallet = web3.eth.accounts[2];
  const foundationTokenWallet = web3.eth.accounts[3];
  const advisorsTokenWallet = web3.eth.accounts[7];
  const companyTokenWallet = web3.eth.accounts[4];
  const reserveTokenWallet = web3.eth.accounts[5];
  const bountyTokenWallet = web3.eth.accounts[6];
  const owner = web3.eth.accounts[0];

  TheAbyssDAICOContract.new(
    bnbTokenAddress,
    tokenAddress,
    fundAddress,
    reservationFundAddress,
    bnbTokenWallet,
    referralTokenWallet,
    foundationTokenWallet,
    advisorsTokenWallet,
    companyTokenWallet,
    reserveTokenWallet,
    bountyTokenWallet,
    owner,
    {
      from: web3.eth.accounts[0],
      data: TheAbyssDAICOJSON.bytecode,
      gas: '8500000',
      gasPrice: '200000000000'
    }, function(e, contract) {
      console.log(e);
      if (typeof contract.address != 'undefined') {
        console.log('TheAbyssDAICO is successfully deployed!\nContract Address: ' + contract.address + '\nTransaction Hash: ' + contract.transactionHash);
      }
    }
  );

    // Deployed at 0x074aba9c8319f18bcf5e17d1e04163e4f49d2011 // GET
    // Depoployed at 0xb31ba2d2fc075b5d23b94cf73b04e756f7262395
}
