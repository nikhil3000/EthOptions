pragma solidity 0.4.24;

import "https://github.com/smartcontractkit/chainlink/evm/contracts/ChainlinkClient.sol";


// MyContract inherits the ChainlinkClient contract to gain the
// functionality of creating Chainlink requests
contract Oracle is ChainlinkClient {
  // Helper constant for testnets: 1 request = 1 LINK
  uint256 constant private ORACLE_PAYMENT = 1 * LINK;
  // Helper constant for the Chainlink uint256 multiplier JobID
  bytes32 constant UINT256_MUL_JOB = bytes32("e6d74030e4a440898965157bc5a08abc");
address _oracle = 0xc99B3D447826532722E41bc36e644ba3479E4365;
  // Stores the answer from the Chainlink oracle
  uint256 public currentPriceKNC;
  uint256 public currentPriceLINK;
  uint256 public currentPriceSNX;
  uint256 public currentPriceEOS;
  address public owner;
  uint256 oraclePayment;

  constructor() public {
    // // Set the address for the LINK token for the network
    // setChainlinkToken(0x20fE562d797A42Dcb3399062AE9546cd06f63280);
    // // Set the address of the oracle to create requests to
    // setChainlinkOracle(0xc99B3D447826532722E41bc36e644ba3479E4365);
    setPublicChainlinkToken();
    //oraclePayment = _oraclePayment;
    owner = msg.sender;
  }

  // Creates a Chainlink request with the uint256 multiplier job
 function requestCoinMarketCapPriceKNC () 
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(UINT256_MUL_JOB, this, this.fulfillKNC.selector);
  req.add("sym", "KNC");
  req.add("convert", "USD");
  string[] memory path = new string[](5);
  path[0] = "data";
  path[1] = "KNC";
  path[2] = "quote";
  path[3] = "USD";
  path[4] = "price";
  req.addStringArray("copyPath", path);
  req.addInt("times", 100);
  sendChainlinkRequestTo(_oracle,req, ORACLE_PAYMENT);
}

  // fulfill receives a uint256 data type
  function fulfillKNC(bytes32 _requestId, uint256 _price)
    public
    // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
    recordChainlinkFulfillment(_requestId)
  {
    currentPriceKNC = _price;
  }
  
  
   function requestCoinMarketCapPriceLINK() 
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(UINT256_MUL_JOB, this, this.fulfillLINK.selector);
  req.add("sym", "LINK");
  req.add("convert", "USD");
  string[] memory path = new string[](5);
  path[0] = "data";
  path[1] = "LINK";
  path[2] = "quote";
  path[3] = "USD";
  path[4] = "price";
  req.addStringArray("copyPath", path);
  req.addInt("times", 100);
  sendChainlinkRequestTo(_oracle,req, ORACLE_PAYMENT);
}

  // fulfill receives a uint256 data type
  function fulfillLINK(bytes32 _requestId, uint256 _price)
    public
    // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
    recordChainlinkFulfillment(_requestId)
  {
    currentPriceLINK = _price;
  }
  
     function requestCoinMarketCapPriceSNX () 
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(UINT256_MUL_JOB, this, this.fulfillSNX.selector);
  req.add("sym", "SNX");
  req.add("convert", "USD");
  string[] memory path = new string[](5);
  path[0] = "data";
  path[1] = "SNX";
  path[2] = "quote";
  path[3] = "USD";
  path[4] = "price";
  req.addStringArray("copyPath", path);
  req.addInt("times", 100);
  sendChainlinkRequestTo(_oracle,req, ORACLE_PAYMENT);
}

  // fulfill receives a uint256 data type
  function fulfillSNX(bytes32 _requestId, uint256 _price)
    public
    // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
    recordChainlinkFulfillment(_requestId)
  {
    currentPriceSNX = _price;
  }
  
    
     function requestCoinMarketCapPriceEOS () 
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(UINT256_MUL_JOB, this, this.fulfillEOS.selector);
  req.add("sym", "EOS");
  req.add("convert", "USD");
  string[] memory path = new string[](5);
  path[0] = "data";
  path[1] = "EOS";
  path[2] = "quote";
  path[3] = "USD";
  path[4] = "price";
  req.addStringArray("copyPath", path);
  req.addInt("times", 100);
  sendChainlinkRequestTo(_oracle,req, ORACLE_PAYMENT);
}

  // fulfill receives a uint256 data type
  function fulfillEOS(bytes32 _requestId, uint256 _price)
    public
    // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
    recordChainlinkFulfillment(_requestId)
  {
    currentPriceEOS = _price;
  }
  
  // withdrawLink allows the owner to withdraw any extra LINK on the contract
  function withdrawLink()
    public
    onlyOwner
  {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }
  
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
}