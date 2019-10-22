import React from 'react';
import axios from 'axios';
import algosdk from 'algosdk';
import {pureStakeKey} from '../config';

export default class Bounty extends React.Component {
    constructor(props) {
        super(props);
        this.handleAssignTask = this.handleAssignTask.bind(this);
        this.handleRelease = this.handleRelease.bind(this);
        this.state = {
            account : undefined
        }
    }

    async handleRelease() {
        if(!this.props.data.taskPerformer)
        {
            window.alert("Performer Not yet assigned");
        }
        console.log("release");
        var account = JSON.parse(localStorage.getItem('AlgorandAccount'));
        var str = account.sk;
        console.log("sk 19", str);
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        console.log("secret key", bufView);
        const baseServer = "https://testnet-algorand.api.purestake.io/ps1"
        const port = "";
        const token = {
            'X-API-Key': pureStakeKey
        }
        const algodclient = new algosdk.Algod(token, baseServer, port);
        let params = await algodclient.getTransactionParams();
        let endRound = params.lastRound + parseInt(1000);
        console.log("escrow",this.props.data.escrow);
        let txn = {
            "from": this.props.data.escrow,
            "to": this.props.data.taskPerformer,
            "fee": 1000,
            "amount": parseInt(this.props.data.bounty)*1000000,
            "firstRound": params.lastRound,
            "lastRound": endRound,
            "genesisID": params.genesisID,
            "genesisHash": params.genesishashb64,
            "note": new Uint8Array(0),
        };
        const mparams = {
            version: 1,
            threshold: 2,
            addrs: [
                this.props.data.verifier,
                '43M7SC3TA3BXUGKTUJAJJW4ILFTOA55ISWPEXD37R2G5LTFJGLMSASXPD4',
            ],
        };
        let rawSignedTxn = algosdk.signMultisigTransaction(txn, mparams, bufView).blob;
        var obj = {
            gig : this.props.data.gig,
            rawSignedTxn
        }

        axios.post("http://localhost:5000/releaseFunds",obj)
        .then(res=>{
            console.log(res);
        })
    }

    async handleAssignTask(){
        var performer = $("#address"+this.props.val)[0].value;
        var obj = {
            taskPerformer: performer,
            user: this.state.account.addr,
            desc: this.props.data.gig
        }
        axios.post("http://localhost:5000/assignTask",obj)
        .then(res=>{
            console.log(res.data);
            if(res.data == 'alloted')
            {
                window.alert("saved");
            }
            else
            {
                window.alert("error");
            }
        })
    }

    UNSAFE_componentWillMount() {
        var account = JSON.parse(localStorage.getItem('AlgorandAccount'));
        this.setState({account:account});
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="gig">
                <div className="gig_row_1">
                    <span>{this.props.data.gig}</span>
                    <span>{this.props.data.bounty}tz</span>
                </div>
                <div className="gig_row_2">
                    {this.props.data.owner == this.state.account.addr && <input type="text" placeholder="Address of task performer" id={"address"+this.props.val}></input>}
                    {this.props.data.owner == this.state.account.addr && <button className="assign_button" onClick={this.handleAssignTask}>Assign Task</button>}
                    {this.props.data.verifier == this.state.account.addr && <button className="release_button assign_button" onClick={this.handleRelease}>Release Funds</button>}
                </div>
            </div>
        )
    }
}