import React from 'react';
import axios from 'axios';
import {pureStakeKey} from '../config';

export default class Post extends React.Component {

    constructor(props) {
        super(props);
        this.handlePostFormSubmit = this.handlePostFormSubmit.bind(this);
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
                <span className="page_header">Post Your Problem</span>
                <div>
                    <form onSubmit={this.handlePostFormSubmit}>
                        <textarea className="input_details" name="desc" placeholder="Describe your problem" rows="10" required></textarea>
                        <input type="text" className="input_title" name="verifier" placeholder="Address of verifier" required></input>
                        <input type="text" className="input_amount" name="amount" placeholder="Bounty Amount" required></input>
                        <button type="submit" className="post_button"> Post</button>
                    </form>
                </div>

            </div>
        )
    }

}