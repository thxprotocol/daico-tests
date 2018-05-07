var ABYSS = artifacts.require("ABYSS");
var ReservationFund = artifacts.require("ReservationFund");
var PollManagedFund= artifacts.require("PollManagedFund");
var TheAbyssDAICO = artifacts.require("TheAbyssDAICO");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(ABYSS,
        _listener = '0x0',
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
            _teamWallet = accounts[0],
            _referralTokenWallet = accounts[0],
            _foundationTokenWallet = accounts[0],
            _companyTokenWallet = accounts[0],
            _reserveTokenWallet = accounts[0],
            _bountyTokenWallet = accounts[0],
            _advisorTokenWallet = accounts[0],
            _refundManager = accounts[0],
            _owners = [accounts[0]],
            {
                from: accounts[0],
                gas: '8500000',
                gasPrice: '200000000000'
            }
        );
    })
    .then(function() {
        return deployer.deploy(TheAbyssDAICO,
            bnbTokenAddress = '0x0',
            tokenAddress = ABYSS.address,
            fundAddress = PollManagedFund.address,
            reservationFundAddress = ReservationFund.address,
            _bnbTokenWallet = accounts[0],
            _referralTokenWallet = accounts[0],
            _foundationTokenWallet = accounts[0],
            _advisorsTokenWallet = accounts[0],
            _companyTokenWallet = accounts[0],
            _reserveTokenWallet = accounts[0],
            _bountyTokenWallet = accounts[0],
            _owner = accounts[0]
        );
    });

};
