import React from 'react';
import { ERC20Abi, factoryABI } from '../config';
import { factoryAddress } from '../../address';
import axios from 'axios';
const BigNumber = require('bignumber.js');
// const { parseLog } = require('ethereum-event-logs');


export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.handleBuyOrder = this.handleBuyOrder.bind(this);
    }

    componentDidUpdate() {
        console.log("order.js", this.props.data);
    }

    pow(input) {
        return new BigNumber(input).times(new BigNumber(10).pow(18)).toString();
    }

    handleBuyOrder(e) {
        e.preventDefault();
        const orderQuantity = e.target.elements.orderQuantity.value.trim();
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
                        this.pow(orderQuantity),
                        this.pow(this.props.data.strikePrice),
                        this.props.data.baseTokenAddress,
                        this.props.data.quoteTokenAddress,
                        premium,
                        new BigNumber(this.props.data.expiry).toString()
                    ).send({
                        from: taker,
                        gas: 4000000
                    }).then(receipt=> {
                            console.log(receipt);
                            var id = receipt.events['idEvent'].returnValues[0];
                            window.alert(`Token id is ${id}`);
                            var data = this.props.data;
                            var obj = {
                                _id : data._id,
                                taker : taker,
                                tokenId : id
                            }
                            console.log(obj);
                            axios.post('http://localhost:5000/updateOption',obj)
                            .then(res=>{
                                console.log(res);
                            })

                    })
                }
            })


    }
    render() {
        return (
            <div>
                <h2>Order</h2>
                <p>Maker:{this.props.data && this.props.data.maker}</p>
                <p>Base Token:{this.props.data && this.props.data.baseToken}</p>
                <p>Quote Token:{this.props.data && this.props.data.quoteToken}</p>
                <p>Maker : {this.props.data && this.props.data.maker}</p>
                <p>Premium: {this.props.data && this.props.data.premium}</p>
                <p>Strike Price: {this.props.data && this.props.data.strikePrice}</p>
                <p>Expiry: {this.props.data && this.props.data.expiryString}</p>
                <form onSubmit={this.handleBuyOrder}>
                    <div className="form-group">
                        <label htmlFor="orderQuantity">Order Quantity</label>
                        <input type="number" step="0.01" className="form-control" required id="orderQuantity" name="orderQuantity" placeholder="No. of option tokens you want to buy"></input>
                    </div>
                    <button type="submit" className="btn btn-primary">Buy Order</button>
                </form>
            </div>
        )
    }
}
