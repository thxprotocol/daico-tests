var ABYSS = artifacts.require("ABYSS");
var ReservationFund = artifacts.require("ReservationFund");
var PollManagedFund= artifacts.require("PollManagedFund");
var TheAbyssDAICO = artifacts.require("TheAbyssDAICO");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(ABYSS,
        _listener = accounts[0],
        _owners = [accounts[0]],
        manager = accounts[0]
    )
    .then(function(){
        return deployer.deploy(ReservationFund,
            _owner = accounts[0]
        );
    })
    .then(function(){
        return deployer.deploy(PollManagedFund,
            _teamWallet = accounts[1],
            _referralTokenWallet = accounts[2],
            _foundationTokenWallet = accounts[3],
            _companyTokenWallet = accounts[4],
            _reserveTokenWallet = accounts[5],
            _bountyTokenWallet = accounts[6],
            _advisorTokenWallet = accounts[7],
            _refundManager = accounts[0],
            _owners = [],
            {
                from: accounts[0]
            }
        );
    })
    .then(function() {
        return deployer.deploy(TheAbyssDAICO,
            bnbTokenAddress = '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
            tokenAddress = ABYSS.address,
            fundAddress = PollManagedFund.address,
            reservationFundAddress = ReservationFund.address,
            _bnbTokenWallet = accounts[8],
            _referralTokenWallet = accounts[2],
            _foundationTokenWallet = accounts[3],
            _advisorsTokenWallet = accounts[7],
            _companyTokenWallet = accounts[4],
            _reserveTokenWallet = accounts[5],
            _bountyTokenWallet = accounts[6],
            _owner = accounts[0]
        );
    });
};
