const THXToken = artifacts.require("THXToken");
const ReservationFund = artifacts.require("ReservationFund");
const PollManagedFund= artifacts.require("PollManagedFund");
const THXTokenDAICO = artifacts.require("THXTokenDAICO");
const LockedTokens = artifacts.require("LockedTokens");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(THXToken,
        _listener = '',
        _owners = [],
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
            _crowdsaleTokenWallet = accounts[2],
            _grantsTokenWallet = accounts[3],
            _companyTokenWallet = accounts[4],
            _reserveTokenWallet = accounts[5],
            _bountyTokenWallet = accounts[6],
            _advisorTokenWallet = accounts[7],
            _refundManager = accounts[0],
            _owners = [accounts[0]]
        );
    })
    .then(function() {
        return deployer.deploy(THXTokenDAICO,
            bnbTokenAddress = '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
            tokenAddress = THXToken.address,
            fundAddress = PollManagedFund.address,
            reservationFundAddress = ReservationFund.address,
            _bnbTokenWallet = accounts[8],
            _crowdsaleTokenWallet = accounts[2],
            _grantsTokenWallet = accounts[3],
            _advisorsTokenWallet = accounts[7],
            _companyTokenWallet = accounts[4],
            _reserveTokenWallet = accounts[5],
            _bountyTokenWallet = accounts[6],
            _teamWallet = accounts[1],
            _owner = accounts[0]
        );
    })
    .then(function() {
        return deployer.deploy(LockedTokens,
            THXToken.address,
            THXTokenDAICO.address
        );
    });
};
