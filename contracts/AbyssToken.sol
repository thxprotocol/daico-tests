pragma solidity ^0.4.21;

import './token/TransferLimitedToken.sol';


contract ABYSS is TransferLimitedToken {
    uint256 public constant SALE_END_TIME = 1526904933; // 2018-05-20T09:08:18+02:00

    function ABYSS(address _listener, address[] _owners, address manager) public
        TransferLimitedToken(SALE_END_TIME, _listener, _owners, manager)
    {
        name = "ABYSS";
        symbol = "ABYSS";
        decimals = 18;
    }
}