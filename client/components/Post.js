import React, { Component, Fragment } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import DatePicker from "react-datepicker";
import { data } from '../data'
import "react-datepicker/dist/react-datepicker.css";
import {ERC20Abi} from '../config';
import { factoryAddress } from '../../address';
const BigNumber = require('bignumber.js');



export default class Post extends React.Component {

    constructor(props) {
        super(props);
        this.handlePostFormSubmit = this.handlePostFormSubmit.bind(this);
        this.handleBaseTokenChange = this.handleBaseTokenChange.bind(this);
        this.handleQuoteTokenChange = this.handleQuoteTokenChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.state = {
            baseTokenObject: undefined,
            quoteTokenObject: undefined,
            expiryDate: undefined
        }
    }

    componentDidMount() {
        if(!this.props.web3.givenProvider.selectedAddress)
        {
            console.log("Metamask address not available, please refresh");
        }
        console.log(this.props.web3.givenProvider.selectedAddress);
        console.log(factoryAddress);
        // console.log(ERC20Abi)
    }

    pow(input) {
        return new BigNumber(input).times(new BigNumber(10).pow(18));
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
            tokenContract.methods.approve(factoryAddress.toString(), this.pow(quantity).toString())
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
                        axios.post('http://localhost:5000/postOrder', order)
                            .then(res => {
                                if(res.data == "orderSaved")
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

    render() {
        return (
            <div className="post_body">
                <span>Create Option</span>
                <div>
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

            </div>
        )
    }

}