import React from 'react';
import { Route, Switch } from "react-router-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import Post from './Post'
import Login from './login';
import Landing from './landing';
import Earn from './earnbounty';
import Algo from './algo';
import NavBar from './NavBar';
export const history = createBrowserHistory();


export default class Routers extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavBar />
                <Router history={history}>
                    <Switch>
                        <Route path="/login" exact={true} component={Login}/>
                        <Route path="/home" exact={true} component={Landing}/>
                        <Route path="/post" exact={true} component={Post}/>
                        <Route path="/gig" exact={true} component={Earn}/>
                        <Route path="/algo" exact={true} component={Algo}/>                        
                        <Route component={Landing} />

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