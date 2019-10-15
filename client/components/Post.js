import React, { Component, Fragment } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import DatePicker from "react-datepicker";
import { data } from '../data'
import "react-datepicker/dist/react-datepicker.css";
import { faucetABI, faucetAddress } from '../config'


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
        console.log(this.props.web3.givenProvider.selectedAddress);
    }

    handlePostFormSubmit(e) {

        e.preventDefault();
        const quantity = e.target.elements.quantity.value.trim();
        const strikePrice = e.target.elements.strikePrice.value.trim();
        if (this.state.baseTokenObject && this.state.quoteTokenObject && this.state.expiryDate) {
            var baseTokenAddress = this.state.baseTokenObject.value;
            var quoteTokenAddress = this.state.quoteTokenObject.value;
            var expiryDateTimestamp = this.state.expiryDate.setHours(17, 0, 0, 0)/1000;
            var metamaskAccount2 = "0x0456A48AcBD784A586B9A29D425f6D444e2063ad";    //will be replaced by options contract address
            //faucet address should be replaced by base token address, currently faucer is acting as the base token 
            const faucetContract = new this.props.web3.eth.Contract(JSON.parse(faucetABI), faucetAddress);
            faucetContract.methods.approve(metamaskAccount2, quantity)
                .send({ from: this.props.web3.givenProvider.selectedAddress }, (err, data) => {
                    if (err) {
                        console.log("err", err);
                        window.alert("Allowance needs to be provided for the base token to create order");
                    }
                    else {
                        console.log("data", data);
                        var order = {
                            quantity,
                            strikePrice,
                            baseTokenAddress,
                            quoteTokenAddress,
                            expiryDateTimestamp
                        }
                        axios.post('http://localhost:5000/postOrder', order)
                        .then(res => {
                            console.log(res);
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
                            <input type="number" className="form-control" required id="noOfTokens" name="quantity" placeholder="Quantity"></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="strikePrice">Strike price per base token in quote token</label>
                            <input type="number" className="form-control" required id="strikePrice" name="strikePrice" placeholder="Strike prices"></input>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Expiry Date</label><br></br>
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