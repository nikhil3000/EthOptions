import React from 'react';
import OrderTable from './OrderTable';
import Table from 'react-bootstrap/Table';
// import Orderbook from './Orderbook-legacy';
import SideBar from './SideBar';
import Post from './Post';
import Graph from './Graph';
import NavBar from './NavBar';
import Orderbook from './Orderbook';
import Modal from 'react-modal';
import {rpcURL,baseURL} from '../config';
import { createBrowserHistory } from 'history';
import Web3 from 'web3';
import axios from 'axios';
export const history = createBrowserHistory();

Modal.setAppElement('#app');
const customStyles = { content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } };
import Dialogbox from './Dialogbox'

export default class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            modalIsOpen: false,
            data: undefined,
            web3 : undefined,
            flashMessage : undefined
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    componentDidMount() {
        console.log("orderbook");
        axios.get(baseURL+'/getOrder').then(response => {
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

          if(!window.web3.currentProvider)
          { 
            this.setState({flashMessage:'Please unlock Metamask'});
          }
          web3js = new Web3(window.web3.currentProvider);
        } else {
          //user is not running metamask
          // create provider through infura
          this.setState({flashMessage:'Web3 disabled. Please install Metamask'});
        //   const provider = new Web3.providers.HttpProvider(rpcURL);
        //   web3js = new Web3(provider);
        }
        // web3js = new Web3(web3.currentProvider || provider);
        console.log(web3js);
        this.setState({ web3: web3js });
        // const factoryContractUport = new web3js.eth.Contract(JSON.parse(config.abi.factoryABI), config.contractAddresses.voterFactoryAddress);
        // this.setState({ factoryContractUport: factoryContractUport });
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        return (


            <div className="container-responsive">
                <div className='blue-half'>
                   {this.state.flashMessage && <div className="flashMessage">{this.state.flashMessage}</div>}
                </div>
                <div className="page-content">

                    <div className="row">
                        <NavBar />
                    </div>
                    <div className="row">
                        <div className="col-sm-3 col-6">
                            <div className='card-box' style={{ marginBottom: '10%' }}>
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
                        <div className="col-sm-3 col-6">
                            <div className='card-box' style={{ marginBottom: '10%' }}>
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
                        <div className="col-sm-3 col-6">
                            <div className='card-box' style={{ marginBottom: '10%' }}>
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
                        <div className="col-sm-3 col-6">
                            <div className='card-box' style={{ marginBottom: '10%' }}>
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
                    <div className="row">
                        <div className="col-sm-12">
                            <Graph />
                        </div>
                    </div>

                    {/* <Dialogbox heading="Use Google's location service?" description="Lorem Ipsum Dolor Sit Amet" button1="Agree" button2="Disagree"/> */}

                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <Orderbook history={history} data={this.state.data} orderbook={true} web3={this.state.web3} />
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <Orderbook history={history} data={this.state.data} orderbook={false} web3={this.state.web3}  />
                        </div>
                    </div>
                    <div className="fab">
                        <a href="#" className="fab-button" data-title="Post a New Order" onClick={this.openModal}>
                            <i className="material-icons pmd-sm">add</i>
                        </a>
                    </div>
                </div>

                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Post a New Order"
                    style={customStyles}
                >
                    <Post history={history} web3={this.state.web3} closeModal={this.closeModal} />
                </Modal>
            </div>

        )
    }
}