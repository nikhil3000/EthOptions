pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Escrow.sol";
// import "./interfaces/IEscrow.sol";
import "./interfaces/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


/**
 * 
 * @title : EthOptionsFactory
 * @dev Contract to manage the creation of Options, excercising Options
 * 
 * 
 */
 
 contract EthOptionsFactory {
     
     using SafeMath for uint256;
     address public EscrowAddress;
     uint256 tokenID;
     
     struct option {
        //  uint256 tokenID;
         address maker;
         address taker;
         uint256 qty;
         uint256 strikePrice;
         address baseToken;
         address quoteToken;
         uint256 expiry;
     } 
     
     mapping(uint256 => option) optionList;  //tokenid to object mapping

     constructor() public{
         EscrowAddress = address(new Escrow());
         tokenID = 0;
     }
     
      function createOption( address _maker, address _taker, uint256 _qty, uint256 _strikePrice, address _baseToken, address _quoteToken,uint256 _expiry) public{
        //tranfering base tokens to escrow
        transferToEscrow(_baseToken,_qty,_maker); //I am hoping that require inside the function will prevent it from proceeding. Needs to check this
        //transfering premium to maker
        require(transferERC20(_quoteToken,_qty,_taker,_maker), "Failed at transfer of premium");
        //TODO: Create option token and transfer them to taker.
        
        option memory tempOption =  option(_maker,_taker,_qty,_strikePrice,_baseToken,_quoteToken,_expiry);
        optionList[tokenID] = tempOption;
        tokenID = tokenID.add(1);
    }
     
     
     function transferToEscrow(address token, uint256 amount, address payer) internal{
         require(transferERC20(token,amount,payer,EscrowAddress), "Transfer of tokens to escrow failed");
         Escrow(EscrowAddress).deposit(payer,token,amount);
     }
     
     function transferERC20(address token,uint256 amount,address _from, address _to) internal returns (bool){
         return IERC20(token).transferFrom(_from,_to,amount);
     }
     
 }