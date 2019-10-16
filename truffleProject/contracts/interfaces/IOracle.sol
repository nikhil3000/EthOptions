pragma solidity ^0.5.0;

contract IOracle {
    
    function getPrice(address base, uint256 timestamp) public returns(uint256);
}
