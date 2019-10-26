import React from 'react';
import OrderTable from './OrderTable';
import Modal from 'react-modal';
import ErrorImg from './error-01.jpg';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';


Modal.setAppElement('#app');
const customStyles = { content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } };



export default class Orderbook extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: undefined,
            kyberAmount: undefined,
            assetSybmol: undefined,
            modalIsOpen: false,
            waitForKyber: false,
            loading:false
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.goToKyber = this.goToKyber.bind(this);
        this.triggerModal = this.triggerModal.bind(this);
        this.checkCount = this.checkCount.bind(this);
        this.closWaitForKyber = this.closWaitForKyber.bind(this);
        this.toggleLoadingModal = this.toggleLoadingModal.bind(this);
    }
    componentDidMount() {
        // console.log(this.props.web3.givenProvider.selectedAddress);
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    goToKyber() {
        var url =
            `https://widget.kyber.network/v0.7.2/?type=buy&mode=tab&receiveToken=${this.state.assetSybmol}&receiveAmount=${this.state.kyberAmount}&callback=https://localhost:8080/${this.props.history.location.pathname}&network=ropsten`
        console.log(url); window.open(url, '_blank');
        this.closeModal();
        this.setState({ waitForKyber: true })
    }

    closWaitForKyber() {
        this.setState({ waitForKyber: false });
    }

    triggerModal(assetSybmol, kyberAmount) {
        console.log("trigget modal");
        this.setState({ kyberAmount: kyberAmount, assetSybmol: assetSybmol });
        this.openModal();
    }

    toggleLoadingModal(val){
        this.setState({loading : val});
    }

    checkCount() {
        var count = 0;
        this.props.data && this.props.data.map((record, index) => {
            if (this.props.web3 && this.props.web3.givenProvider.selectedAddress == record.taker) {
                count++;
            }
        })
        return count > 0;
    }
    render() {
        return (
            <div className="card card-box">
                <div className="card-head">
                    {this.props.orderbook && <header>Order Book</header>}
                    {!this.props.orderbook && <header>Your Orders</header>}
                    <div className="tools">
                        <a className="fa fa-repeat btn-color box-refresh" href="javascript:;"></a>
                        <a className="t-collapse btn-color fa fa-chevron-up" href="javascript:;"></a>
                        <a className="t-close btn-color fa fa-times" href="javascript:;"></a>
                    </div>
                </div>
                <div className="card-body ">
                    {/* {!this.props.orderbook && this.checkCount() && */}
                        <div className="table-wrap">
                            <div className="table-responsive">
                                <table className="table display product-overview mb-30" id="support_table">
                                    <thead>
                                        <tr>
                                            {!this.props.orderbook && <th scope="col">Id</th>}
                                            <th scope="col">Base Token</th>
                                            <th scope="col">Quote Token</th>
                                            <th scope="col">Strike Price</th>
                                            <th scope="col">Expiry Date</th>
                                            <th scope="col">No. of Base Tokens</th>
                                            <th scope="col">Premium</th>
                                            {!this.props.orderbook && <th scope="col">Qty</th>}
                                            <th scope="col">Buy Order</th>
                                        </tr>
                                    </thead>
                                    {!this.props.orderbook &&
                                        <tbody>
                                            {
                                                this.props.data && this.props.data.map((record, index) => (
                                                    this.props.web3 && this.props.web3.givenProvider.selectedAddress == record.taker &&
                                                    <OrderTable key={index} data={record} index={index} history={this.props.history} orderbook={this.props.orderbook}
                                                        triggerModal={this.triggerModal} web3={this.props.web3} toggleLoadingModal={this.toggleLoadingModal}/>
                                                ))
                                            }
                                        </tbody>
                                    }
                                    {this.props.orderbook &&
                                        <tbody>
                                            {
                                                this.props.data && this.props.data.map((record, index) => (
                                                    !record.taker &&
                                                    <OrderTable key={index} data={record} index={index} history={this.props.history} orderbook={this.props.orderbook}
                                                        triggerModal={this.triggerModal} web3={this.props.web3} toggleLoadingModal={this.toggleLoadingModal}/>
                                                ))
                                            }
                                        </tbody>
                                    }
                                </table>
                            </div>
                        </div>
                    {
                        !this.checkCount() && !this.props.orderbook && <div style={{ textAlign: 'left', fontSize: '1.5em', paddingLeft: '2%' }}>No orders found :(</div>
                    }
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Insufficient Tokens"
                    style={customStyles}
                >
                    <div className="container-responsive token-less-error text-center">
                        <div style={{ width: '80%', margin: '0 auto' }}>
                            <div className="image-container">
                                <img src={ErrorImg}></img>
                            </div>
                            <div className="message">
                                <span ref={subtitle => this.subtitle = subtitle}>You don't have enough tokens for this order</span>
                            </div>
                            <div className="get-tokens">
                                <button onClick={this.goToKyber}>Get Tokens</button>
                            </div>
                            <div className="cancel-order">
                                <button onClick={this.closeModal}>Cancel this order</button>
                            </div>
                        </div>

                    </div>
                </Modal>
                <Modal
                    isOpen={this.state.waitForKyber}
                    onRequestClose={this.closWaitForKyber}
                    contentLabel="Wait for Kyber"
                    style={customStyles}
                >
                    <span ref={subtitle => this.subtitle = subtitle}>Please complete your transaction on Kyber and wait for it to mine.</span>
                </Modal>
                <Modal
                    isOpen={this.state.loading}
                    contentLabel="Loading"
                    style={customStyles}
                >
                    <Spinner animation="border"/>
                    <span ref={subtitle => this.subtitle = subtitle}>Waiting for transaction to mine</span>
                </Modal>


            </div>
        )
    }
}
