const OpenSocialCoin = artifacts.require("OpenSocialCoin");
const ReservationFund = artifacts.require("ReservationFund");
const PollManagedFund= artifacts.require("PollManagedFund");
const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(OpenSocialCoin,
        _listener = accounts[0],
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
            _referralTokenWallet = accounts[2],
            _foundationTokenWallet = accounts[3],
            _companyTokenWallet = accounts[4],
            _reserveTokenWallet = accounts[5],
            _bountyTokenWallet = accounts[6],
            _advisorTokenWallet = accounts[7],
            _refundManager = accounts[0],
            _owners = []
        );
    })
    .then(function() {
        return deployer.deploy(OpenSocialDAICO,
            bnbTokenAddress = '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
            tokenAddress = OpenSocialCoin.address,
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
