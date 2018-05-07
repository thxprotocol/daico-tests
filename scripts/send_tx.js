var sender = web3.eth.accounts[9]; // Peter Polman
var receiver = "0xb31ba2d2fc075b5d23b94cf73b04e756f7262395"; // Peter Polman

web3.eth.getBalance(sender);
web3.eth.getBalance(receiver);

var amount = web3.toWei(1, "ether");

web3.eth.sendTransaction({from: sender, to: receiver, value: amount});
