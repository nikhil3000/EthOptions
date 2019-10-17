pragma solidity ^0.5.0;

contract PriceOracle {
    mapping(address => uint256) list; //contract address to price wei mapping
    uint256 queryTime; //useless xD 
    
    function setPrice(address token, uint256 price) public
    {
        list[token] = price;
    }
    
    function getPrice(address token,uint256) public view returns(uint256) {
        return list[token];
    }
}