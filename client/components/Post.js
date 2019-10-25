import React, { Component, Fragment } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import DatePicker from "react-datepicker";
import { data } from '../data'
import "react-datepicker/dist/react-datepicker.css";
import { ERC20Abi, baseURL } from '../config';
import { factoryAddress } from '../../address';
const BigNumber = require('bignumber.js');
import Modal from 'react-modal';
Modal.setAppElement('#app');
const customStyles = { content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } };



export default class Post extends React.Component {

    constructor(props) {
        super(props);
        this.handlePostFormSubmit = this.handlePostFormSubmit.bind(this);
        this.handleBaseTokenChange = this.handleBaseTokenChange.bind(this);
        this.handleQuoteTokenChange = this.handleQuoteTokenChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.goToKyber = this.goToKyber.bind(this);
        this.state = {
            baseTokenObject: undefined,
            quoteTokenObject: undefined,
            expiryDate: undefined
        }
    }

    componentDidMount() {
        if (!this.props.web3.givenProvider.selectedAddress) {
            console.log("Metamask address not available, please refresh");
        }
        console.log(this.props.web3.givenProvider.selectedAddress);
        console.log(factoryAddress);
        // console.log(ERC20Abi)
    }

    pow(input) {
        return new BigNumber(input).times(new BigNumber(10).pow(18)).toString();
    }
    handlePostFormSubmit(e) {
        e.preventDefault();
        const quantity = e.target.elements.quantity.value.trim();
        const strikePrice = e.target.elements.strikePrice.value.trim();
        const premium = e.target.elements.premium.value.trim();
        if (this.state.baseTokenObject && this.state.quoteTokenObject && this.state.expiryDate) {
            console.log("inside if");
            var baseTokenLabel = this.state.baseTokenObject.label;
            var quoteTokenLabel = this.state.quoteTokenObject.label;
            var baseTokenAddress = this.state.baseTokenObject.value;
            var quoteTokenAddress = this.state.quoteTokenObject.value;
            var expiryDateTimestamp = this.state.expiryDate.setHours(17, 0, 0, 0) / 1000;
            var tokenContract = new this.props.web3.eth.Contract(ERC20Abi, baseTokenAddress);
            var maker = this.props.web3.givenProvider.selectedAddress;

            tokenContract.methods.balanceOf(maker.toString()).call().then(balance => {
                console.log("balance");
                if (balance - this.pow(quantity)>= 0) {
                    tokenContract.methods.approve(factoryAddress.toString(), this.pow(quantity))
                        .send({ from: maker }, (err, data) => {
                            if (err) {
                                console.log("err", err);
                                window.alert("Allowance needs to be provided for the base token to create order");
                            }
                            else {
                                console.log("data", data);
                                var order = {
                                    maker,
                                    quantity,
                                    strikePrice,
                                    baseTokenAddress,
                                    quoteTokenAddress,
                                    baseTokenLabel,
                                    quoteTokenLabel,
                                    premium,
                                    expiryDateTimestamp
                                }
                                axios.post(baseURL+'/postOrder', order)
                                    .then(res => {
                                        if (res.data == "orderSaved")
                                            window.alert("Order saved");
                                        else
                                            window.alert("failed to save order");
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })

                            }
                        })
                }
                else{
                    console.log("insufficient balance",balance);
                    console.log("quantity",this.pow(quantity));
                this.setState(
                    {
                        kyberAmount: quantity- balance* 10 ** -18,
                        assetSybmol:baseTokenLabel
                    });
                this.openModal();
                }
            })

        }
        else {
            window.alert("Choose some value for all the fields.");
        }
    }

    handleBaseTokenChange(baseTokenObject) {
        this.setState({ baseTokenObject: baseTokenObject });
    }

    handleQuoteTokenChange(quoteTokenObject) {
        this.setState({ quoteTokenObject: quoteTokenObject });
    }


    handleDateChange(date) {
        this.setState({ expiryDate: date });
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
       console.log(url);
        window.open(url,'_blank');
    }

    render() {
        return (
            <div className="post_body">
                <div className="card-head">
                    <header>Create Option</header>
                    <div className="tools">
                        <a className="fa fa-repeat btn-color box-refresh" href="javascript:;"></a>
                        <a className="t-collapse btn-color fa fa-chevron-up" href="javascript:;"></a>
                        <a className="t-close btn-color fa fa-times" href="#" ></a>
                    </div>
                </div>
                <div className="card-body">
                    <form className="container" onSubmit={this.handlePostFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Base Token</label>
                            <Fragment>
                                <CreatableSelect
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={''}
                                    onChange={this.handleBaseTokenChange}
                                    options={data}
                                />
                            </Fragment>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Quote Token</label>
                            <Fragment>
                                <CreatableSelect
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={''}
                                    onChange={this.handleQuoteTokenChange}
                                    options={data}
                                />
                            </Fragment>
                        </div>
                        <div className="form-group">
                            <label htmlFor="noOfTokens">Number of Tokens</label>
                            <input type="number" step="0.01" className="form-control" required id="noOfTokens" name="quantity" placeholder="Quantity"></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="strikePrice">Strike price per base token in quote token</label>
                            <input type="number" step="0.01" className="form-control" required id="strikePrice" name="strikePrice" placeholder="Strike prices"></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="premiumAmount">Premium To be paid by taker</label>
                            <input type="number" step="0.01" className="form-control" required id="premiumAmount" name="premium" placeholder="Premium Amount"></input>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Expiry Date : Time has been fixed to 5pm(IST)</label><br></br>
                            <DatePicker
                                selected={this.state.expiryDate || new Date()}
                                onChange={this.handleDateChange}
                                id="date"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
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