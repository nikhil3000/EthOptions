pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./interfaces/IERC20.sol";
 /**
  * @title Escrow
  * @dev Base escrow contract, holds ERC20 tokens designated from a payer.
  *
  * Intended usage: This contract (and derived escrow contracts) should be a
  * standalone contract, that only interacts with the contract that instantiated
  * it. That way, it is guaranteed that all tokens will be handled according to
  * the `Escrow` rules, and there is no need to check for payable functions or
  * transfers in the inheritance tree. The contract that uses the escrow as its
  * payment method should be its primary, and provide public methods redirecting
  * to the escrow's deposit and withdraw.
  */
contract Escrow is Ownable{
    using SafeMath for uint256;
    
    // event Deposited(address indexed payee, uint256 weiAmount);
    // event Withdrawn(address indexed payee, uint256 weiAmount);

    mapping(address => mapping(address => uint256)) public escrowBalance;

    function depositsOf(address payee, address token) public view returns (uint256) {
        return escrowBalance[payee][token];
    }

    /**
     * @dev Stores the sent amount as credit to be withdrawn.
     * @param payer The sender address of the funds.
     */
    function deposit(address payer,address token, uint256 amount) public payable onlyOwner {
        escrowBalance[payer][token] = escrowBalance[payer][token].add(amount);
        // emit Deposited(payer, amount);
    }

    /**
     * @dev Withdraw accumulated balance for a payee.
     * @param payee The address to which funds will be transferred to.
     */
    function withdraw(address payer, address payable payee,address token, uint256 amount) public onlyOwner{
        require(amount <= escrowBalance[payer][token], "Insufficient funds");
        require(IERC20(token).transfer(payee,amount));
        escrowBalance[payer][token] = escrowBalance[payer][token].sub(amount);
        // emit Withdrawn(payee, amount);
    }
}
