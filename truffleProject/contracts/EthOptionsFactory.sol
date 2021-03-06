pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Escrow.sol";
// import "./interfaces/IEscrow.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IERC721.sol";
import "./interfaces/IOracle.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


/**
 * 
 * @title : EthOptionsFactory
 * @dev Contract to manage the creation of Options, excercising Options
 * 
 * 
 */
 contract EthOptionsFactory is Ownable {
     
     using SafeMath for uint256;
     address private EscrowAddress;
     uint256 private tokenID;
     address private optionTokenAddress; //erc721.sol
     address private priceOracleAddress;
     address public knc = 0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6;
     address public snx = 0x013AE307648f529aa72c5767A334DDd37aaB43c3;
     address public link = 0xb4f7332ed719Eb4839f091EDDB2A3bA309739521;
     address public eos = 0xd5b4218B950A53fF07985E2d88346925c335EAe7;
     
     event idEvent(uint256);
     event Price(uint256,uint256);
     struct option {
        //  uint256 tokenID;
         address maker;
         address taker;
         uint256 qty;
         uint256 strikePrice;
         address baseToken;
         address quoteToken;
         uint256 premium;
         uint256 expiry;
     } 
     
     //tokenid to object mapping
     mapping(uint256 => option) optionList;  
    
     constructor(address _optionAddressToken, address _priceOracleAddress) public{
         optionTokenAddress = _optionAddressToken;
         priceOracleAddress = _priceOracleAddress;
         EscrowAddress = address(new Escrow());
         tokenID = 1;
     }
     
     
    function createOption( address _maker, address _taker, uint256 _qty, uint256 _strikePrice, address _baseToken, address _quoteToken,uint256 _premium, uint256 _expiry) public returns(uint256){
        //tranfering base tokens to escrow
        require(_transferToEscrow(_baseToken,_qty,_maker),"Failed at _transferToEscrow"); //I am hoping that require inside the function will prevent it from proceeding. Needs to check this
        //transfering premium to maker
        require(_transferERC20(_quoteToken,_premium,_taker,_maker), "Failed at transfer of premium");
        //TODO: Create option token and transfer them to taker.
        IERC721(optionTokenAddress).mint(_taker, tokenID, _qty);
        option memory tempOption =  option(_maker,_taker,_qty,_strikePrice,_baseToken,_quoteToken,_premium,_expiry);
        optionList[tokenID] = tempOption;
        emit idEvent(tokenID);
        tokenID = tokenID.add(1);
    }
    
    function exerciseOption(uint256 _tokenId,uint256 _qty) public{
        option memory tempOption = optionList[_tokenId];
        require(_canBeExercised(_tokenId,_qty), "Option cannot be exercised");
        uint256 amount = tempOption.strikePrice.mul(_qty).div(10 ** 18);
        _checkAllowance(amount, tempOption.quoteToken, tempOption.taker);
        _checkEscrowBalance(tempOption.maker,tempOption.baseToken,_qty);
        _burnOptionTokens(_tokenId,_qty);
        require(IERC20(tempOption.quoteToken).transferFrom(tempOption.taker,tempOption.maker,amount),"Transfer of quote token failed");
        _transferFromEscrow(tempOption.baseToken, _qty, tempOption.taker, tempOption.maker);
        emit Price(1,amount);
        optionList[_tokenId].qty = optionList[_tokenId].qty.sub(_qty);
    }
    
    function getLatestTokenId() public view returns (uint256)
    {
        return tokenID;
    }
    // function getLatestTokenId() public returns(uint256){
    //     require(msg.sender == optionTokenAddress,"Non whitelisted address cannot update token ID");
    //     tokenID = tokenID.add(1);
    //     return tokenID;
    // }
    
    function getOptionDetails(uint256 tokenId) public view returns(address,address,uint256,uint256,address,address,uint256,uint256){
        option memory tempOption = optionList[tokenId];
        return (tempOption.maker,tempOption.taker,tempOption.qty,tempOption.strikePrice,tempOption.baseToken,tempOption.quoteToken,tempOption.premium,tempOption.expiry);
    }
    
    function getEscrowAddress() public view returns (address){
        return EscrowAddress;
    }
    
    function getPriceOracleAddress() public view returns(address){
        return priceOracleAddress;
    }
    
    function _checkEscrowBalance(address maker, address baseToken, uint256 qty) internal view{
        require(Escrow(EscrowAddress).depositsOf(maker,baseToken) >= qty, "Insufficient base tokens by maker in escrow account");
    }
    function _burnOptionTokens(uint256 tokenId,uint256 qty) internal{
        require(IERC721(optionTokenAddress).getApproved(tokenId) == address(this),"contract does not have allowance");
       IERC721(optionTokenAddress).burn(tokenId, qty);
    }
    
    function _checkAllowance(uint256 amount, address token , address owner) internal view
    {
        require(IERC20(token).allowance( owner,address(this)) >= amount,"Insufficient Allowance");
    }
    
    function _canBeExercised(uint256 _tokenId,uint256 _qty) public view returns (bool){
        option memory tempOption = optionList[_tokenId];
        require(_tokenId < tokenID && _tokenId > 0, "invalid tokenID");
        require(msg.sender == tempOption.taker, "Only taker can excercise the option");
        require(_qty <= tempOption.qty, "Option can't be exercised for quantity greater than it was issued for.");
        require(now < tempOption.expiry, "Option has already expired");
        require (_getPrice(tempOption.baseToken,tempOption.quoteToken) > tempOption.strikePrice,"Base Token price has still not crossed the strike price");
        // _getPrice(tempOption.baseToken,tempOption.quoteToken);
        return true;
    }
     
    function _getPrice(address baseToken, address quoteToken) public view returns(uint256)
    {
        require(priceOracleAddress != address(0),"Price Oracle Address is not set");
        uint256 basePrice;
        uint256 quotePrice;
        
        if(baseToken == knc)
        basePrice = IOracle(priceOracleAddress).currentPriceKNC();
        else if(baseToken == snx)
        basePrice = IOracle(priceOracleAddress).currentPriceSNX();
        else if(baseToken == link)
        basePrice = IOracle(priceOracleAddress).currentPriceLINK();
        else if(baseToken == eos)
        basePrice = IOracle(priceOracleAddress).currentPriceEOS();
        
        basePrice = basePrice.mul(10 ** 18); //to support decimals
        
        if(quoteToken == knc)
        quotePrice = IOracle(priceOracleAddress).currentPriceKNC();
        else if(quoteToken == snx)
        quotePrice = IOracle(priceOracleAddress).currentPriceSNX();
        else if(quoteToken == link)
        quotePrice = IOracle(priceOracleAddress).currentPriceLINK();
        else if(quoteToken == eos)
        quotePrice = IOracle(priceOracleAddress).currentPriceEOS();
       
        uint256 price = basePrice.div(quotePrice);
        return (price); 
    }
    
    function _transferFromEscrow(address token,uint256 amount, address payee, address maker) internal{
        require(Escrow(EscrowAddress).withdraw(maker,payee,token,amount), "transfer from escrow failed");
    }
    
    
    function _transferToEscrow(address token, uint256 amount, address payer) internal returns (bool){
         require(_transferERC20(token,amount,payer,EscrowAddress), "Transfer of tokens to escrow failed");
         Escrow(EscrowAddress).deposit(payer,token,amount);
         return true;
    }
     
     function _transferERC20(address token,uint256 amount,address _from, address _to) internal returns (bool){
         return IERC20(token).transferFrom(_from,_to,amount);
     }
 }