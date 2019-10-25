pragma solidity ^0.5.0;

contract IOracle {
    function requestCoinMarketCapPriceKNC () public;
    function requestCoinMarketCapPriceLINK () public;
    function requestCoinMarketCapPriceSNX () public;
    function requestCoinMarketCapPriceEOS () public;
    uint256 public currentPriceKNC;
  uint256 public currentPriceLINK;
  uint256 public currentPriceSNX;
  uint256 public currentPriceEOS;

}
