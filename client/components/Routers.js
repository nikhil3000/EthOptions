import React from 'react';
import { Route, Switch } from "react-router-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import Post from './Post';
import NavBar from './NavBar';
import Web3 from 'web3';
import {rpcURL} from '../config';
import Orderbook from './Orderbook';
import Order from './order';
import axios from 'axios';
import MyOrder from './myOrder';

export const history = createBrowserHistory();


export default class Routers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            web3 : undefined,
            data : undefined
        }
    }

    componentWillMount() {

        axios.get('http://localhost:5000/getOrder').then(response => {
            console.log(response.data);
            for(var i=0;i<response.data.length;i++) {
                var date = new Date(response.data[i].expiry * 1000).toString();
                response.data[i].expiryString = date; 
            };
            
            this.setState({
                data: response.data
            })
        })
        let web3js;
        if (window.ethereum) {
          // metamask is available
          if(!web3.currentProvider.selectedAddress)
          window.ethereum.enable();    
          web3js = new Web3(window.web3.currentProvider);
        } else {
          //user is not running metamask
          // create provider through infura
          const provider = new Web3.providers.HttpProvider(rpcURL);
          web3js = new Web3(provider);
        }
        // web3js = new Web3(web3.currentProvider || provider);
        console.log(web3js);
        this.setState({ web3: web3js });
        // const factoryContractUport = new web3js.eth.Contract(JSON.parse(config.abi.factoryABI), config.contractAddresses.voterFactoryAddress);
        // this.setState({ factoryContractUport: factoryContractUport });
    }

    render() {
        return (
            <div>
                <NavBar />
                <Router history={history}>
                    <Switch>

                        <Route path="/post" render={()=> <Post web3={this.state.web3}/>}></Route>
                        <Route path="/orderbook" render={()=> <Orderbook history={history} data={this.state.data}/>}></Route>
                         <Route path="/order/:id" render={(props) => <Order history={history} data={this.state.data && this.state.data[props.match.params.id]} id={props.match.params.id} web3={this.state.web3}/>} />
                         <Route path="/myorders" render={()=> <MyOrder history={history} data={this.state.data} web3={this.state.web3}/>}></Route>
                        {/*<Route path="/" exact={true} render={() => <QuestionsList history={history} factoryContractUport={this.state.factoryContractUport} web3={this.state.web3} />} />
                        <Route path="/poll/:address" render={(props) => <Poll history={history} web3={this.state.web3} address={props.match.params.address} />} />
                        <Route path="/register" render={() => <Register history={history} factoryContractUport={this.state.factoryContractUport} />} />
                        <Route path="/submitVote/:data" render={(props) => <SubmitVote history={history} web3={this.state.web3} data={props.match.params.data} />} />
                        <Route path="/questionslist" render={() => <QuestionsList history={history} factoryContractUport={this.state.factoryContractUport} web3={this.state.web3} />} />
                        <Route component={PageNotFound} /> */}
                    </Switch>
                </Router>
            </div>
        );

    }
}