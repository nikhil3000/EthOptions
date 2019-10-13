import React, { Component, Fragment } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import DatePicker from "react-datepicker";
import { data } from '../data'
import "react-datepicker/dist/react-datepicker.css";



const colourOptions = [
    { value: 'abc', label: 'chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

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
            expiryDate:undefined
        }
    }

    handlePostFormSubmit(e) {

        e.preventDefault();
        const quantity = e.target.elements.quantity.value.trim();
        const strikePrice = e.target.elements.strikePrice.value.trim();
        if(this.state.baseTokenObject && this.state.quoteTokenObject && this.state.expiryDate)
        {
            console.log(quantity);
            console.log(strikePrice);
            console.log(this.state.baseTokenObject);
            console.log(this.state.quoteTokenObject);
            console.log(this.state.expiryDate);

            // axios.post('http://localhost:5000/postGig', Gigbody)
            // .then(res => {
            //     console.log(res);
            // })
            // .catch(err => {
            //     console.log(err);
            // })
        }
        else{
            window.alert("Choose some value for all the fields.");
        }   
    }

    handleBaseTokenChange(baseTokenObject) {
        this.setState({ baseTokenObject: baseTokenObject});
    }

    handleQuoteTokenChange(quoteTokenObject) {
        this.setState({ quoteTokenObject: quoteTokenObject});
    }


    handleDateChange(date) {
        this.setState({expiryDate:date});
    }

    render() {
        return (
            <div className="post_body">
                <span>Create Option</span>
                <div>
                    <form className="container" onSubmit={this.handlePostFormSubmit}>
                        <div className="form-group">
                            <label for="exampleInputEmail1">Base Token</label>
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
                            <label for="exampleInputEmail1">Quote Token</label>
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
                            <label for="noOfTokens">Number of Tokens</label>
                            <input type="number" className="form-control" required id="noOfTokens" name="quantity" placeholder="Quantity"></input>
                        </div>
                        <div className="form-group">
                            <label for="strikePrice">Strike price per base token in quote token</label>
                            <input type="number" className="form-control" required id="strikePrice" name="strikePrice" placeholder="Strike prices"></input>
                        </div>

                        <div className="form-group">
                            <label for="date">Expiry Date</label><br></br>
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