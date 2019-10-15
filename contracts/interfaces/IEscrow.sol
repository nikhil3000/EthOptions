pragma solidity ^0.5.0;

/// Escrow contract for Token Interface 
contract IEscrow {
    mapping(address => mapping(address => uint256)) public escrowBalance;
    function depositsOf(address payee, address token) public view returns (uint256);
    function deposit(address payer,address token, uint256 amount) public;
    function withdraw(address payer, address payable payee,address token, uint256 amount) public;
}