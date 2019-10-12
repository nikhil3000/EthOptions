import React from 'react';
import axios from 'axios';
import algosdk from 'algosdk';
import {pureStakeKey} from '../config';

//my account  var acc = `{"addr":"Z2ZYIJNMRGTGHWCCKP3RHM555B6V22JYV5UZN2LNA353RIU7U736NJWZFY","sk":{"0":187,"1":222,"2":46,"3":100,"4":61,"5":202,"6":28,"7":196,"8":184,"9":212,"10":247,"11":66,"12":126,"13":226,"14":208,"15":5,"16":175,"17":160,"18":231,"19":240,"20":240,"21":187,"22":240,"23":226,"24":64,"25":224,"26":169,"27":53,"28":84,"29":93,"30":153,"31":72,"32":206,"33":179,"34":132,"35":37,"36":172,"37":137,"38":166,"39":99,"40":216,"41":66,"42":83,"43":247,"44":19,"45":179,"46":189,"47":232,"48":125,"49":93,"50":105,"51":56,"52":175,"53":105,"54":150,"55":233,"56":109,"57":6,"58":251,"59":184,"60":162,"61":159,"62":167,"63":247}}`;
//    verifier account = {"addr":"2UE34S3IH5KSBBBGLWTIYIMLPYCJP2KWZMMZH2XCY4P7OIBE3E7T45CJTE","sk":{"0":112,"1":126,"2":114,"3":44,"4":173,"5":8,"6":32,"7":220,"8":70,"9":249,"10":191,"11":102,"12":172,"13":91,"14":66,"15":16,"16":80,"17":199,"18":20,"19":242,"20":96,"21":146,"22":215,"23":204,"24":43,"25":130,"26":84,"27":103,"28":240,"29":114,"30":233,"31":246,"32":213,"33":9,"34":190,"35":75,"36":104,"37":63,"38":85,"39":32,"40":132,"41":38,"42":93,"43":166,"44":140,"45":33,"46":139,"47":126,"48":4,"49":151,"50":233,"51":86,"52":203,"53":25,"54":147,"55":234,"56":226,"57":199,"58":31,"59":247,"60":32,"61":36,"62":217,"63":63}}
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
        var account = JSON.parse(localStorage.getItem('AlgorandAccount'));
        var str = account.sk;
        console.log("sk", str);
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        console.log("secret key", bufView);
        const mparams = {
            version: 1,
            threshold: 2,
            addrs: [
                verifier,
                '43M7SC3TA3BXUGKTUJAJJW4ILFTOA55ISWPEXD37R2G5LTFJGLMSASXPD4',
            ],
        };

        var multsigaddr = algosdk.multisigAddress(mparams);
        console.log(multsigaddr);

        const baseServer = "https://testnet-algorand.api.purestake.io/ps1"
        const port = "";
        const token = {
            'X-API-Key': pureStakeKey
        }
        const post_txn_token = {
            'X-API-Key': pureStakeKey,
            'content-type': 'application/x-binary'
        }
        // var obj = {
        //     headers: {
        //         'X-API-Key': pureStakeKey,
        //         'content-type': 'application/x-binary'
        //     }
        // }
        const algodclient = new algosdk.Algod(token, baseServer, port);
        const post_algodclient = new algosdk.Algod(post_txn_token, baseServer, port);

        let params = await algodclient.getTransactionParams();
        let endRound = params.lastRound + parseInt(1000);
        let txn = {
            "from": account.addr,
            "to": multsigaddr,
            "fee": 1000,
            "amount": parseInt(amount)*1000000,
            "firstRound": params.lastRound,
            "lastRound": endRound,
            "genesisID": params.genesisID,
            "genesisHash": params.genesishashb64,
            "note": new Uint8Array(0),
        };
        console.log("txn", txn);
        //sign the transaction
        let signedTxn = algosdk.signTransaction(txn, bufView);
        console.log(signedTxn);
      
        try {
            let tx = (await post_algodclient.sendRawTransaction(signedTxn.blob));
            console.log("Transaction : ");
            if(tx)
            console.log("tx successful");
            else
            throw "tx failed";

        }
        catch (e) {
            console.log("error");
            console.log(e);
        }

        var Gigbody = {
            owner: account.addr,
            verifier: verifier,
            desc: desc,
            amount: amount,
            escrow: multsigaddr
        }

        axios.post('http://localhost:5000/postGig', Gigbody)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    }
    componentWillMount() {
        var account = localStorage.getItem('AlgorandAccount');
        if (!account)
            this.props.history.push('/login');
        console.log(JSON.parse(account).addr);
        
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