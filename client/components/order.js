import React from 'react';
import { ERC20Abi, factoryABI,optionABI } from '../config';
import { factoryAddress, optionAddress } from '../../address';
import axios from 'axios';
const BigNumber = require('bignumber.js');
// const { parseLog } = require('ethereum-event-logs');


export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.handleFillOrder = this.handleFillOrder.bind(this);
        this.handleExerciseOrder = this.handleExerciseOrder.bind(this);
    }

    componentDidUpdate() {
        console.log("order.js", this.props.data);
    }

    pow(input) {
        return new BigNumber(input).times(new BigNumber(10).pow(18)).toString();
    }

    handleFillOrder(e) {
        e.preventDefault();
        var premium = this.pow(parseFloat(this.props.data.premium));
        var tokenContract = new this.props.web3.eth.Contract(ERC20Abi, this.props.data.quoteTokenAddress);
        var factoryContract = new this.props.web3.eth.Contract(factoryABI, factoryAddress);
        var taker = this.props.web3.givenProvider.selectedAddress;
        tokenContract.methods.approve(factoryAddress.toString(), premium)
            .send({ from: taker }, (err, data) => {
                if (err) {
                    console.log("err", err);
                    window.alert("Allowance needs to be provided for the quote token to pay premium amount");
                }
                else {
                    factoryContract.methods.createOption(
                        this.props.data.maker,
                        taker,
                        this.pow(this.props.data.qty),
                        this.pow(this.props.data.strikePrice),
                        this.props.data.baseTokenAddress,
                        this.props.data.quoteTokenAddress,
                        premium,
                        new BigNumber(this.props.data.expiry).toString()
                    ).send({
                        from: taker,
                        gas: 4000000
                    }).then(receipt => {
                        console.log(receipt);
                        var id = receipt.events['idEvent'].returnValues[0];
                        window.alert(`Token id is ${id}`);
                        var data = this.props.data;
                        var obj = {
                            _id: data._id,
                            taker: taker,
                            tokenId: id
                        }
                        console.log(obj);
                        axios.post('http://localhost:5000/updateOrder', obj)
                            .then(res => {
                                console.log(res);
                            })
                    }).catch(err=>{
                        console.log(err);
                    })
                }
            })
    }

    handleExerciseOrder(e){
        e.preventDefault();
        var qty = parseFloat(e.target.elements.quantity.value.trim());
        var amount = this.pow(qty * this.props.data.strikePrice);
        var quoteTokenContract = new this.props.web3.eth.Contract(ERC20Abi, this.props.data.quoteTokenAddress);
        var taker = this.props.web3.givenProvider.selectedAddress;
        var factoryContract = new this.props.web3.eth.Contract(factoryABI, factoryAddress);
        var optionTokenContract = new this.props.web3.eth.Contract(optionABI, optionAddress);
        var tokenId = new BigNumber(this.props.data.tokenId).toString();
        quoteTokenContract.methods.approve(factoryAddress.toString(),amount)
        .send({from:taker},(err,data)=>{
            if (err) {
                console.log("err", err);
                window.alert("Allowance needs to be provided for the quote token to exercise option");
            }
            else
            {
                optionTokenContract.methods.approve(factoryAddress.toString(),tokenId)
                .send({from:taker}, (err,data)=>{
                    if (err) {
                        console.log("err", err);
                        window.alert("Allowance needs to be provided for the option tokens to exercise option");
                    } 
                    else {
                        factoryContract.methods.exerciseOption(tokenId,this.pow(qty))
                        .send({from:taker},(err,data)=>{
                            if (err) {
                                console.log("err", err);
                            } 
                            else {
                                window.alert("success");
                            }
                        })
                    }
                })
            }
        })
    }

    render() {
        return (
            <div>
                <h2>Order</h2>
                <p>Base Token:{this.props.data && this.props.data.baseToken}</p>
                <p>Quote Token:{this.props.data && this.props.data.quoteToken}</p>
                <p>Premium: {this.props.data && this.props.data.premium}</p>
                <p>Strike Price: {this.props.data && this.props.data.strikePrice}</p>
                <p>Expiry: {this.props.data && this.props.data.expiryString}</p>
                <p>Quantity: {this.props.data && this.props.data.qty}</p>
                {this.props.data &&
                    this.props.data.taker != this.props.web3.givenProvider.selectedAddress &&
                    <button onClick={this.handleFillOrder} className="btn btn-primary">Fill Order</button>}
                {this.props.data &&
                    this.props.data.taker == this.props.web3.givenProvider.selectedAddress &&
                    <form onSubmit={this.handleExerciseOrder}>
                        <div className="form-group">
                            <label htmlFor="noOfTokens">Quantity</label>
                            <input type="number" step="0.01" className="form-control" required id="noOfTokens" name="quantity" placeholder="Quantity"></input>
                        </div>
                        <button type="submit" className="btn btn-primary">Exercise Order</button>
                    </form>}
                <link rel='stylesheet' href='https://widget.kyber.network/v0.7.2/widget.css' />
                <a href='https://widget.kyber.network/v0.7.2/?type=swap&mode=popup&lang=en&callback=https%3A%2F%2Fkyberpay-sample.knstats.com%2Fcallback&paramForwarding=true&network=ropsten&theme=theme-emerald'class='kyber-widget-button theme-emerald theme-supported' name='KyberWidget - Powered by KyberNetwork' title='Pay with tokens'target='_blank'>Swap tokens</a>
                <script async src='https://widget.kyber.network/v0.7.2/widget.js'></script>
            </div>
        )
    }
}
