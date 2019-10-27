import React, { Fragment } from 'react';
const BigNumber = require('bignumber.js');
import { ERC20Abi, factoryABI, optionABI, baseURL } from '../config';
import { factoryAddress, optionAddress } from '../../address';
import axios from 'axios';

export default class OrderTable extends React.Component {
    constructor(props) {
        super(props);
        // this.goToOrder = this.goToOrder.bind(this)
        this.state = {
            orderbook: true
        }
        this.handleFillOrder = this.handleFillOrder.bind(this);
        this.handleExerciseOrder = this.handleExerciseOrder.bind(this);

    }

    componentDidMount() {
        // console.log(this.props.history);
        if (!this.props.orderbook)
            this.setState({ orderbook: false });
    }
    // goToOrder(e) {
    //     e.preventDefault();
    //     console.log("go to order");
    //     this.props.history.push(`/order/${this.props.index}`);
    // }

    pow(input) {
        return new BigNumber(input).times(new BigNumber(10).pow(18)).toString();
    }

    handleFillOrder(e) {
        e.preventDefault();
        console.log("fill order");
        var premium = this.pow(parseFloat(this.props.data.premium));
        var tokenContract = new this.props.web3.eth.Contract(ERC20Abi, this.props.data.quoteTokenAddress.toString());
        var factoryContract = new this.props.web3.eth.Contract(factoryABI, factoryAddress);
        var taker = this.props.web3.givenProvider.selectedAddress;
        tokenContract.methods.balanceOf(taker.toString()).call().then(balance => {
            console.log("balance");
            if (balance - premium >= 0) {
                tokenContract.methods.approve(factoryAddress.toString(), premium)
                    .send({ from: taker })
                    .on('transactionHash', hash => {
                        this.props.toggleLoadingModal(true);
                    })
                    .on('receipt', receipt => {
                        this.props.toggleLoadingModal(false);
                        var obj = {
                            maker: this.props.data.maker,
                            taker,
                            qty : this.pow(this.props.data.qty),
                            strikePrice: this.pow(this.props.data.strikePrice),
                            baseTokenAddress: this.props.data.baseTokenAddress,
                            quoteTokenAddress: this.props.data.quoteTokenAddress,
                            premium,
                            expiry: new BigNumber(this.props.data.expiry).toString()
                        }
                        console.log(obj);
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
                        }).on('transactionHash', hash => {
                            this.props.toggleLoadingModal(true);
                        }).on('receipt', receipt => {
                            this.props.toggleLoadingModal(false);
                            console.log(receipt);
                            var id = receipt.events['idEvent'].returnValues[0];
                            // TODO : Change it to dialog or modal
                            window.alert(`Token id is ${id}`);
                            var data = this.props.data;
                            var obj = {
                                _id: data._id,
                                taker: taker,
                                tokenId: id
                            }
                            console.log(obj);
                            axios.post(baseURL + '/updateOrder', obj)
                                .then(res => {
                                    console.log(res);
                                })
                        }).on('error', err => {
                            this.props.toggleLoadingModal(false);
                            window.alert('Transaction failed');
                            console.log(err);
                        })
                    })
                    .on('error', err => {
                        this.props.toggleLoadingModal(false);
                        console.log("err", err);
                        window.alert("Allowance needs to be provided for the quote token to pay premium amount");
                    })
            }
            else {
                console.log("insufficient balance", balance);
                console.log("premium", premium);
                this.props.triggerModal(this.props.data.quoteToken, (premium - balance) * 10 ** -18);
            }
        })
            .catch(err => {
                console.log(err);
            });

    }

    handleExerciseOrder(e) {
        e.preventDefault();
        var qty = parseFloat(e.target.elements.quantity.value.trim());
        var amount = this.pow(qty * this.props.data.strikePrice);
        var quoteTokenContract = new this.props.web3.eth.Contract(ERC20Abi, this.props.data.quoteTokenAddress);
        var taker = this.props.web3.givenProvider.selectedAddress;
        var factoryContract = new this.props.web3.eth.Contract(factoryABI, factoryAddress);
        var optionTokenContract = new this.props.web3.eth.Contract(optionABI, optionAddress);
        var tokenId = new BigNumber(this.props.data.tokenId).toString();

        quoteTokenContract.methods.balanceOf(taker.toString()).call().then(balance => {
            if (balance - amount >= 0) {
                quoteTokenContract.methods.approve(factoryAddress.toString(), amount)
                    .send({ from: taker })
                    .on('transactionHash', hash => {
                        this.props.toggleLoadingModal(true);
                    })
                    .on('receipt', receipt => {
                        this.props.toggleLoadingModal(false);
                        optionTokenContract.methods.approve(factoryAddress.toString(), tokenId)
                            .send({ from: taker })
                            .on('transactionHash', hash => {
                                this.props.toggleLoadingModal(true);
                            })
                            .on('receipt', receipt => {
                                this.props.toggleLoadingModal(false);
                                factoryContract.methods.exerciseOption(tokenId, this.pow(qty))
                                    .send({ from: taker })
                                    .on('transactionHash', hash => {
                                        this.props.toggleLoadingModal(true);
                                    })
                                    .on('receipt', data => {
                                        this.props.toggleLoadingModal(false);
                                        var data = this.props.data;
                                        var obj = {
                                            _id: data._id,
                                            _qty :qty
                                        }
                                        axios.post(baseURL + '/updateQty',obj)
                                        .then(res=>{
                                            window.alert("success");
                                        })
                                    }).on('error', err => {
                                        this.props.toggleLoadingModal(false);
                                        console.log(err);
                                    })
                            })
                            .on('error', err => {
                                console.log("err", err);
                                this.props.toggleLoadingModal(false);
                                window.alert("Allowance needs to be provided for the option tokens to exercise option");
                            })
                    })
                    .on('error', err => {
                        console.log("err", err);
                        this.props.toggleLoadingModal(false);
                        window.alert("Allowance needs to be provided for the quote token to exercise option");
                    })
            }
            else {
                console.log("insufficient balance");
                this.props.triggerModal(this.props.data.quoteToken, (amount - balance) * 10 ** -18);
            }
        })
            .catch(err => {
                console.log("error in fetching balance", err);
            })

    }
    getFormattedDate(timestamp) {
        var date = new Date();
        date = new Date(timestamp * 1000 + date.getTimezoneOffset());

        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        month = (month < 10 ? "0" : "") + month;
        day = (day < 10 ? "0" : "") + day;
        hour = (hour < 10 ? "0" : "") + hour;
        min = (min < 10 ? "0" : "") + min;
        sec = (sec < 10 ? "0" : "") + sec;

        var str = day + "/" + month + '/' + date.getFullYear() + "";

        return str;
    }



    render() {
        return (
            <tr>
                {/* {this.state.orderbook && <th scope="row"> {this.props.index + 1} </th>} */}
                {!this.state.orderbook && <th scope="row"> {this.props.data.tokenId} </th>}
                {/* <th scope="row">{!this.state.orderbook && this.props.data.tokenId}</th> */}
                <td>{this.props.data.baseToken}</td>
                <td style={{ color: "#2079f2" }}>{this.props.data.quoteToken}</td>
                <td>{this.props.data.strikePrice}</td>
                <td>{this.getFormattedDate(this.props.data.expiry)}</td>
                <td>{this.props.data.qty}</td>
                <td>{this.props.data.premium}</td>
                {this.state.orderbook && <td><button className="button-cust btn" variant="primary" onClick={this.handleFillOrder}>Fill Order</button></td>}
                {/* {!this.state.orderbook && <td><button className="btn button-cust" variant="primary" onClick={this.handleExerciseOrder}>Exercise</button></td>} */}
                {!this.state.orderbook &&
                    <td>
                        <form onSubmit={this.handleExerciseOrder}>
                            <input type="number" step="0.01" className="form-control" required id="noOfTokens" name="quantity" placeholder="Quantity"></input>
                            <button type="submit" className="btn btn-primary">Exercise Order</button>
                        </form>
                    </td>}
            </tr>
        )
    }
}