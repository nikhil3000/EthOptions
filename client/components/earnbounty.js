import React from 'react';
import axios from 'axios';
import Bounty from './bounty_desc';
export default class Earn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: undefined
        }
    }

    UNSAFE_componentWillMount() {
        var account = localStorage.getItem('AlgorandAccount');
        if (!account)
            this.props.history.push('/login');
        console.log(JSON.parse(account).addr);
        
    }

    componentDidMount() {
        var obj = [];
        axios.get('http://localhost:5000/getGig')
            .then(res => {
                console.log(res.data);
                this.setState({ data:res.data});
            })
            .catch(er => {
                console.log(er);
            })
    }

    render() {
        return (
            <div className="gig_body">
                <span className="page_header">Earn Bounty</span>
                <div>
                    {this.state.data && this.state.data.map((data, key) => (
                        <Bounty key={key} data={data} val={key}/>
                    ))}
                </div>

            </div>
        )
    }
}