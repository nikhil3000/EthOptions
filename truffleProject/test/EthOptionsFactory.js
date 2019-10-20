// import { duration, ensureException } from './helpers/utils.js';
// import { latestTime, latestBlock } from './helpers/latest.js';
// import should from 'should';

const BigNumber = require('bignumber.js');
const ERC721 = artifacts.require('./ERC721.sol');
const PriceOracle = artifacts.require('./PriceOracle.sol');
const EthOptionsFactoryContract = artifacts.require('./EthOptionsFactory.sol');
const TokenA = artifacts.require('./TokenA');
const TokenB = artifacts.require('./TokenB.sol');
const { parseLog } = require('ethereum-event-logs');
const { abi } = require('../build/contracts/ETHOptionsFactory.json');



function pow(input)
{
    return new BigNumber(input).times(new BigNumber(10).pow(18));
}
contract('EthOptionsFactory', accounts => {
    let baseToken;
    let quoteToken;
    

    // accounts
    const owner = accounts[0]
    const maker = accounts[1];
    const taker = accounts[2];
    
    //New Option
    const strikePrice = pow(40);
    let expiry = (new Date()).setHours(17,0,0,0)/1000 + 86400;
    let expiryDate = new BigNumber(expiry);
    console.log("expiry date",expiryDate);


    before(async() => {
        baseToken = await TokenA.new();
        quoteToken = await TokenB.new();
       
        oracle = await PriceOracle.new();
        oracle.setPrice(baseToken.address,pow(340));
        oracle.setPrice(quoteToken.address,pow(5));
        optionToken = await ERC721.new();
        baseToken._mint(maker,pow(40));
        quoteToken._mint(taker,pow(1010));
        EthOptionsFactory = await EthOptionsFactoryContract.new(optionToken.address);
        await EthOptionsFactory.setPriceOracleAddress(oracle.address);
        console.log(`Test address: Factory: ${EthOptionsFactory.address} \n
        baseToken : ${baseToken.address} \n
        quoteToken : ${quoteToken.address}\n
        optionToken : ${optionToken.address}`);
    });

    beforeEach(async () => {

    }); 

    // quote = 5000000000000000000
    // base, = 340000000000000000000


    describe('Test Cases for the createNewOption function', async () => {

        it('createNewOption: Should successfully create the new option', async () => {
            const eventAbi = abi.find(({ name }) => name === 'idEvent');
            
           let qty = pow(25);
            let premium = pow(5);
            baseToken.approve(EthOptionsFactory.address,qty,{from : maker, gas : 4000000});
            quoteToken.approve(EthOptionsFactory.address,premium,{from :taker,gas:4000000});
            await optionToken.setFactory(EthOptionsFactory.address, {from:owner, gas : 4000000});
            let txReturn = await EthOptionsFactory.createOption( 
                maker, 
                taker, 
                qty,
                strikePrice, 
                baseToken.address, 
                quoteToken.address,
                premium,
                expiryDate,
                {
                    from: maker,
                    gas : 4000000
                }) 
            // const events = parseLog(txReturn.receipt.rawLogs, [ eventAbi ])
            // console.log(events);            
        });
              
        describe('Exercise Option', async () => {
            it('_canBeExercised: Should be success', async () => {
                
                var qty = pow(20);
                const eventAbi = abi.find(({ name }) => name === 'Price');
                // quoteToken.approve(EthOptionsFactory.address,amount,{from :taker,gas:4000000});
                let tx = await EthOptionsFactory._canBeExercised(new BigNumber(1),qty, {from:taker, gas:4000000});
                // const events = parseLog(tx.receipt.rawLogs, [ eventAbi ])
                // console.log(events);   
            });
            it('exerciseOption : with partial quantity, should pass', async () =>{
                var amount = pow(20*40); 
                var qty = pow(20);
                await quoteToken.approve(EthOptionsFactory.address,amount,{from :taker,gas:4000000});
                await optionToken.approve(EthOptionsFactory.address,new BigNumber(1),{from :taker,gas:4000000});
                let tx = await EthOptionsFactory.exerciseOption(new BigNumber(1),qty,{from:taker,gas:4000000});
                const eventAbi = abi.find(({ name }) => name === 'Price');                
                const events = parseLog(tx.receipt.rawLogs, [ eventAbi ])
                console.log(events);
                // console.log(events.args);
            });
            it('exerciseOption : with left-over partial quantity, should pass', async () =>{
                var amount = pow(5*40);
                var qty = pow(5);
                await quoteToken.approve(EthOptionsFactory.address,amount,{from :taker,gas:4000000});
                await optionToken.approve(EthOptionsFactory.address,new BigNumber(1),{from :taker,gas:4000000});
                let tx = await EthOptionsFactory.exerciseOption(new BigNumber(1),qty,{from:taker,gas:4000000});
                const eventAbi = abi.find(({ name }) => name === 'Price');                
                const events = parseLog(tx.receipt.rawLogs, [ eventAbi ])
                console.log(events);
                // console.log(events.name);
                // console.log(events.args);
            });
        });
         // it('createNewOption: Should create the new option -- fail because of zero address', async () => {
        //     await quoteToken.getTokens(new BigNumber(1000).times(new BigNumber(10).pow(18)), buyer);
        //     await quoteToken.approve(derivativeFactory.address, new BigNumber(100).times(new BigNumber(10).pow(18)), { from : buyer });
            
        //     let allowedAmount = await quoteToken.allowance(buyer, derivativeFactory.address);
        //     assert.equal(allowedAmount.dividedBy(new BigNumber(10).pow(18)).toNumber(), 100);
            
        //     let data = await derivativeFactory.getOptionFee();
        //     assert.equal(data.dividedBy(new BigNumber(10).pow(18)).toNumber(), 100);
            
        //     try {
        //         let txReturn = await derivativeFactory.createNewOption(
        //             0x0,
        //             0x0,
        //             strikePrice,
        //             {
        //                 from : buyer,
        //                 gas : 4000000
        //             }
        //         );
        //     } catch(error) {
        //         ensureException(error);
        //     }
        // });

        // it('createNewOption: Should create the new option -- fail because of strike price is 0', async () => {
        //     await quoteToken.getTokens(new BigNumber(1000).times(new BigNumber(10).pow(18)), buyer);
        //     await quoteToken.approve(derivativeFactory.address, new BigNumber(100).times(new BigNumber(10).pow(18)), { from : buyer });
            
        //     let allowedAmount = await quoteToken.allowance(buyer, derivativeFactory.address);
        //     assert.equal(allowedAmount.dividedBy(new BigNumber(10).pow(18)).toNumber(), 100);
            
        //     let data = await derivativeFactory.getOptionFee();
        //     assert.equal(data.dividedBy(new BigNumber(10).pow(18)).toNumber(), 100);
            
        //     try {
        //         let txReturn = await derivativeFactory.createNewOption(
        //             baseToken.address,
        //             quoteToken.address,
        //             0,
        //             {
        //                 from : buyer,
        //                 gas : 4000000
        //             }
        //         );
        //     } catch(error) {
        //         ensureException(error);
        //     }
        // }); 
        // describe('setOrgAddress', async() => {
        //     it('setOrgAddress: should change the organisation address', async () => {
        //         await derivativeFactory.setOrgAccount(tempAccount, {
        //             from: owner
        //         });
        //         assert.equal(await derivativeFactory.getOrgAccount(), tempAccount);
        //     });
        //     it('setOrgAddress: should change the organisation address --fail msg.sender is not owner', async () => {
        //         try {
        //             await derivativeFactory.setOrgAccount(tempAccount, {
        //                 from: accounts[8]
        //             });
        //         } catch(error) {
        //             ensureException(error);
        //         } 
        //     });
        // });
            
    });
});