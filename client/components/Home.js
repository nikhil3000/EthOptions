import React from 'react';
import OrderTable from './OrderTable';
import Table from 'react-bootstrap/Table';
import Orderbook from './Orderbook';
import SideBar from './SideBar';
import Post from './Post';
import Graph from './Graph';

export default class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: undefined
        }
    }
    componentDidMount() {
        console.log("orderbook");
        console.log(process.env.atlasUser);
    }
    render() {
        return (
            <div>
                
                <div className="page-content">
                    <div class="row">
                        <div className="col-md-8 col-sm-12">
                            <Graph />
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <Post history={this.props.history} web3={this.props.web3}/>    
                        </div>
                    </div>
                    <div class="row">
                        <Orderbook history={this.props.history} data={this.props.data}/>
                    </div>
                </div>
            </div>
            
        )
    }
}