import React from 'react';
import OrderTable from './OrderTable';
import Table from 'react-bootstrap/Table';
import Orderbook from './Orderbook';
import SideBar from './SideBar';
import Post from './Post';
import Graph from './Graph';
import NavBar from './NavBar';
import MyOrder from './myOrder';
import Modal from 'react-modal';
Modal.setAppElement('#app');
const customStyles = { content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } };
import Dialogbox from'./Dialogbox'

export default class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            modalIsOpen: false,
            data: undefined
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    componentDidMount() {
        console.log("orderbook");
        console.log(process.env.atlasUser);
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
                <div className="page-content">
                
                    <div className="row">
                        <NavBar />
                    </div>
                    <div className="row">
                        <div className="col-sm-3 col-6">
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
                        <div className="col-sm-3 col-6">
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
                        <div className="col-sm-3 col-6">
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
                        <div className="col-sm-3 col-6">
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
                    <div className="row">
                        <div className="col-sm-12">
                            <Graph />
                        </div>
                    </div>
                    
                    <Dialogbox heading="Use Google's location service?" description="Lorem Ipsum Dolor Sit Amet" button1="Agree" button2="Disagree"/>

                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <Orderbook history={this.props.history} data={this.props.data} orderbook={true} web3={this.props.web3}/>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <MyOrder history={this.props.history} data={this.props.data} web3={this.props.web3} orderbook={false}/>
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
                    <Post history={this.props.history} web3={this.props.web3} closeModal={this.closeModal}/>
                </Modal>
            </div>
            
        )
    }
}