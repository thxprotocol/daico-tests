# Remove old Geth data
rm -rf ./datadir;

# Init the Geth blockchain with the genesis block
geth --datadir=./datadir/ init ./genesis.json

# Start the blockchain with usefull API's
geth --datadir=./datadir/ --rpc --rpcport 7545 --rpccorsdomain "*" --rpcaddr 127.0.0.1 --rpcapi "eth,net,web3,debug"

# Start the Geth Console
geth attach ipc://Users/peterpolman/Sites/daico/datadir/geth.ipc

# Generate 10 accounts and unlock all availanle accounts
for (var i = 0; i < 10; i++) personal.newAccount("");
for (var i = 0; i < personal.listAccounts.length; i++) personal.unlockAccount(personal.listAccounts[i], "", 15000)

# Open MIST connected to the Geth RPC
open -a /Applications/Mist.app --args --rpc /Users/peterpolman/Sites/daico/datadir/geth.ipc

# Clear all Token contracts and Custom contracts from mist
# $ CustomContracts.find().fetch().map(function(m) { CustomContracts.remove(m._id)})
# $ Tokens.find().fetch().map((m) => { Tokens.remove(m._id) } )

# Stop Geth and restart with --mine parameter
geth --datadir=./datadir/ --rpc --rpcport 7545 --rpccorsdomain "*" --rpcaddr 127.0.0.1 --rpcapi "eth,net,web3,debug" --mine

# Start remix and deploy contracts
remixd -s /Users/peterpolman/Sites/daico/contracts

# AbyssToken.sol
"0x7c01221159921ad8563c6badf63d3cf28968fb68", ["0x2253c376611cfcf48712b5333cbbe3bdf3366fa2"], "0x51062f254ef77f54d82c86de8daaa37d83b1ede2"
Estimated fee consumption 0.06416501 ether (3,564,723 gas)
INFO [04-21|11:44:03] Submitted contract creation
fullhash=0xd92e131cd41cc1e1cec31e51739d026f15f265058c47e385e5ebc58ba7d67cc6
contract=0x10611a26C907C5A21D3558dB2c1Da6cCE40C7F91
# GANACHE
'0xbf9e9645478ebdd55707c6e8b4c66fd583c6d12d', ['0xc52852d09affa66b84bb9e271ca792833c1c9a0a'], '0xdcce5c64f20727c75ac834a0e2c76443368a6f96'

# ReservationFund.sol
"0x2253c376611cfcf48712b5333cbbe3bdf3366fa2"
Estimated fee consumption 0.02626565 ether (1,459,203 gas)
INFO [04-21|11:47:29] Submitted contract creation
fullhash=0x2a76aa02d30b3d4a70ba04529e054a124f1418a826f25e08c1c3acc93485ebda
contract=0x268B709D98801b6348a3bb5253f618E4081E94EB
#GANACHE
'0xc52852d09affa66b84bb9e271ca792833c1c9a0a'

# PollManagedFund.sol
"0xb3ad2897b2d876c3a75c7b64f7e52c7e620aa5f4", "0x8780a6ff049e59d14bdaffa5e74b85b267f0018e", "0x35284e0f713c25cb932445b27a84a919a4787eef", "0x28d26801ac5b23e17bd9dc61f355ffb30f51d2f6", "0x4818608a0a7f4847ce196cd5a2a7075e5bd3d983", "0x6a59bf66e2ed930387ef6d812537f026a1d70f1b", "0xc3e11798872c479ac6880bb105e4245f2a5a6bd0", "0x51062f254ef77f54d82c86de8daaa37d83b1ede2", ["0x2253c376611cfcf48712b5333cbbe3bdf3366fa2"]
Estimated fee consumption We couldn't estimate the gas.
# GANACHE:
'0x6440eaaa8029d967974fad5fbd32efc958ba12db', '0x20fb966106860717f76c9d5a3cedd985d4e1d99e', '0xcdff1b28851b94ef76ebd9810bebdb0085ff5101', '0x30793e062e712b2fd59ff474fb3193c159e571ac', '0x40840a567daa58a6b969f1e3b4bde6245be7b1f8', '0xd1cdbfd2e7fc12ae6e5cf804bb84554155f7b0d8', '0xff74dbadc4d1702e95e4ab2a02356a37e78a45b9', '0xdcce5c64f20727c75ac834a0e2c76443368a6f96', ['0xc52852d09affa66b84bb9e271ca792833c1c9a0a']

# Crowdsale.sol
'', '', '', '', '0x6c8bff03c24f56a03fbef26bb67685c5852ce38b', '0x20fb966106860717f76c9d5a3cedd985d4e1d99e', '0xcdff1b28851b94ef76ebd9810bebdb0085ff5101', '0xff74dbadc4d1702e95e4ab2a02356a37e78a45b9', '0x30793e062e712b2fd59ff474fb3193c159e571ac', '0x40840a567daa58a6b969f1e3b4bde6245be7b1f8', '0xd1cdbfd2e7fc12ae6e5cf804bb84554155f7b0d8', '0xc52852d09affa66b84bb9e271ca792833c1c9a0a'

# ==================================================================
# Remove contract json files and migrate to geth network
rm -rf build; truffle migrate --network geth;
rm -rf build; truffle migrate --network ganache;

# Mist logs are stored here
/Users/peterpolman/Library/Application Support/Mist/logs/all.log

# SETUP IN DOCKER
https://ethereum.gitbooks.io/frontier-guide/content/using_docker.html

# This worked with Fund.sol
deployer.deploy(PollManagedFund, accounts[2], accounts[2], accounts[2], accounts[1], accounts[0], accounts[0], accounts[0], accounts[3], [], {from: accounts[0], gas: '20000000'});

# This worked with the external script through truffle console
[1:04:57 PM]   Transaction: 0x7d9331f11893ee3b2f71c4547a823e4bb27dfeed6f2150a1666f19d92ac8535b
[1:04:57 PM]   Contract created: 0x89a39167c6c94c731838301cdde61e6d4a655382
[1:04:57 PM]   Gas usage: 5738173
[1:04:57 PM]   Block Number: 3
[1:04:57 PM]   Block Time: Sat Apr 28 2018 13:04:57 GMT+0200 (CEST)

# ========================================
# ===== AFTER DEPLOYING ON GANACHE =======

# First: Set the tokenprice through the crowdsale contract
# @param _tokenPriceNum
# @param _tokenPriceDenom
TheAbyssDAICO.at("0xb31ba2d2fc075b5d23b94cf73b04e756f7262395").setTokenPrice(30000,1);

# Second: Add the sender address to the lists
# @param test accounts
# @param isInWhiteList
# @param isInPrivilegedList
# @param isInLimitedList
# @param hasAdditionalBonus
TheAbyssDAICO.at("0xb31ba2d2fc075b5d23b94cf73b04e756f7262395").addToLists(web3.eth.accounts[9], true, true, true, true);

# Third: If there is a revert() on this line:
# require(msg.sender == limitedWalletsManager || ownerByAddress[msg.sender]);
#
# Probably add the correct manager or add more owners
# Set more owners on the token (coinbase, tokencontract, reservationfundcontract)
# @param coinbase
# @param †oken.address
# @param reservationFund.address
ABYSS.at("0x88438fc441b10a5fd1053da1a3f61575c2be11bb").setOwners([web3.eth.accounts[0], "0x88438fc441b10a5fd1053da1a3f61575c2be11bb", "0x15ef2dc7612d3a860487f18e94d42069e8ecf0f4"]);

# Forth: Set the crowdsale address as owner in the rervationfund so it can call txs
ReservationFund.at("0x15ef2dc7612d3a860487f18e94d42069e8ecf0f4").setCrowdsaleAddress("0xb31ba2d2fc075b5d23b94cf73b04e756f7262395");

# Fifth: Send money from account 2 to crowdsale address
web3.eth.sendTransaction({from: web3.eth.accounts[9], to: "0xb31ba2d2fc075b5d23b94cf73b04e756f7262395", value: web3.toWei(1, "ether")});


web3.eth.sendTransaction({from: web3.eth.accounts[0], to: web3.eth.accounts[1], value: web3.toWei(10, "ether")});


# !Wondering: Are processReservationContribution() and processReservationFundContribution() duplicates?

# ===========================
# === GOT STUCK HERE! =======
ReservationFund.sol:

69:         contributions[contributor] = safeAdd(contributions[contributor], msg.value);
70:         tokensToIssue[contributor] = safeAdd(tokensToIssue[contributor], _tokensToIssue);
71:         bonusTokensToIssue[contributor] = safeAdd(bonusTokensToIssue[contributor], _bonusTokensToIssue);
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

debug(ganache:0x1587aa21...)>

ReservationFund.sol:

69:         contributions[contributor] = safeAdd(contributions[contributor], msg.value);
70:         tokensToIssue[contributor] = safeAdd(tokensToIssue[contributor], _tokensToIssue);
71:         bonusTokensToIssue[contributor] = safeAdd(bonusTokensToIssue[contributor], _bonusTokensToIssue);
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

debug(ganache:0x1587aa21...)>

Transaction halted with a RUNTIME ERROR.

This is likely due to an intentional halting expression, like assert(), require() or revert(). It can also be due to out-of-gas exceptions. Please inspect your transaction parameters and contract code to determine the meaning of this error.
"0xff74dbadc4d1702e95e4ab2a02356a37e78a45b9"
