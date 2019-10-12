import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Select from 'react-select';
import {data} from '../data'

import { pureStakeKey } from '../config';


const colourOptions = [
    { value: 'abc', label: 'chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

export default class Post extends React.Component {

    constructor(props) {
        super(props);
        this.handlePostFormSubmit = this.handlePostFormSubmit.bind(this);
    }
    componentDidMount() {
        console.log(data.length);
    }

    async handlePostFormSubmit(e) {

        e.preventDefault();
        const verifier = e.target.elements.verifier.value.trim();
        const desc = e.target.elements.desc.value.trim();
        const amount = e.target.elements.amount.value.trim();

        var Gigbody = {

        }

        axios.post('http://localhost:5000/postGig', Gigbody)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            <div className="post_body">
                <span>Create Option</span>
                <div>
                    <form className="container">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
                            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
                            <label class="form-check-label" for="exampleCheck1">Check me out</label>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                        <Fragment>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={''}
                                // isDisabled={isDisabled}
                                // isLoading={isLoading}
                                // isClearable={isClearable}
                                // isRtl={isRtl}
                                isSearchable={true}
                                name="token"
                                options={data}
                            />
                        </Fragment>
                    </form>
                </div>

                </div>
                )
            }
        
}