import React from 'react';
import OrderTable from './OrderTable';
import Table from 'react-bootstrap/Table';
import Orderbook from './Orderbook';
import SideBar from './SideBar';
import Post from './Post';
import Graph from './Graph';
import NavBar from './NavBar';

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
            <div className="container-responsive">
                
                <div className="page-content">
                
                    <div className="row">
                        <NavBar />
                    </div>
                    <div class="row">
                        <div className="col-md-3">
                            <div className='card-box' style={{marginBottom:'10%'}}>
                                <div className='info-card bg-green'>
                                    <div className='contents'>
                                        <div className='header'>
                                            Total Revenue
                                        </div>
                                        <div className='info'>
                                            3.1457 Eth
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className='card-box' style={{marginBottom:'10%'}}>
                                <div className='info-card bg-red'>
                                    <div className='contents'>
                                        <div className='header'>
                                            Total Revenue
                                        </div>
                                        <div className='info'>
                                            3.1457 Eth
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className='card-box' style={{marginBottom:'10%'}}>
                                <div className='info-card bg-purple'>
                                    <div className='contents'>
                                        <div className='header'>
                                            Total Revenue
                                        </div>
                                        <div className='info'>
                                            3.1457 Eth
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className='card-box' style={{marginBottom:'10%'}}>
                                <div className='info-card bg-blue'>
                                    <div className='contents'>
                                        <div className='header'>
                                            Total Revenue
                                        </div>
                                        <div className='info'>
                                            3.1457 Eth
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                        
                    </div>
                    <div class="row">
                        <div className="col-sm-12">
                            <Graph />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8 col-sm-12">
                            <Orderbook history={this.props.history} data={this.props.data}/>
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <Post history={this.props.history} web3={this.props.web3}/>    
                        </div>
                        
                    </div>
                </div>
            </div>
            
        )
    }
}