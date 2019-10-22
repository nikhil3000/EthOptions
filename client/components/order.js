import React from 'react';
import { ERC20Abi, factoryABI, optionABI } from '../config';
import { factoryAddress, optionAddress } from '../../address';
import axios from 'axios';
const BigNumber = require('bignumber.js');
// import KyberModal from './kyberRedirectModal';
import Modal from 'react-modal';
// const { parseLog } = require('ethereum-event-logs');
Modal.setAppElement('#app');
const customStyles = { content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } };

export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            kyberAmount : undefined,
            assetSybmol: undefined
        }
        this.handleFillOrder = this.handleFillOrder.bind(this);
        this.handleExerciseOrder = this.handleExerciseOrder.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.goToKyber = this.goToKyber.bind(this);
    }

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
            if (balance >= premium) {
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
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    })
                }
            else {
                console.log("insufficient balance");
                this.setState(
                    {
                        kyberAmount: (premium-balance) * 10** -18,
                        assetSybmol:this.props.data.quoteToken
                    });
                this.openModal();
            }

        })
        .catch(err=>{
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

        quoteTokenContract.methods.balanceOf(taker.toString()).call().then(balance=>{
            if(balance >= amount)
            {
                quoteTokenContract.methods.approve(factoryAddress.toString(), amount)
                .send({ from: taker }, (err, data) => {
                    if (err) {
                        console.log("err", err);
                        window.alert("Allowance needs to be provided for the quote token to exercise option");
                    }
                    else {
                        optionTokenContract.methods.approve(factoryAddress.toString(), tokenId)
                            .send({ from: taker }, (err, data) => {
                                if (err) {
                                    console.log("err", err);
                                    window.alert("Allowance needs to be provided for the option tokens to exercise option");
                                }
                                else {
                                    factoryContract.methods.exerciseOption(tokenId, this.pow(qty))
                                        .send({ from: taker }, (err, data) => {
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
            else
            {
            console.log("insufficient balance");
            this.setState(
                {
                    kyberAmount: (amount-balance) * 10** -18,
                    assetSybmol:this.props.data.quoteToken
                });
            this.openModal();

            }
        })
        .catch(err=>{
            console.log("error in fetching balance" ,err);
        })
        
    }
    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    goToKyber() {
        var url = 
        `https://widget.kyber.network/v0.7.2/?type=buy&mode=tab&receiveToken=${this.state.assetSybmol}&receiveAmount=${this.state.kyberAmount}&callback=https://localhost:8080/${this.props.history.location.pathname}&network=ropsten`
       console.log(url); window.open(url,'_blank');
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
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Insufficient Tokens"
                    style={customStyles}
                >

                    <h2 ref={subtitle => this.subtitle = subtitle}>You don't have enough tokens for this order</h2>
                    <button onClick={this.closeModal}>Cancel this order</button>
                    <button onClick={this.goToKyber}>Get Tokens</button>
                </Modal>
            </div>
        )
    }
}
