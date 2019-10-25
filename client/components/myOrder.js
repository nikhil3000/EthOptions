import React from 'react';
import OrderTable from './OrderTable';
import Modal from 'react-modal';


Modal.setAppElement('#app');
const customStyles = { content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } };



export default class MyOrder extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: undefined,
            kyberAmount : undefined,
            assetSybmol: undefined,
            modalIsOpen: false
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.goToKyber = this.goToKyber.bind(this);
        this.triggerModal = this.triggerModal.bind(this);
        this.checkCount = this.checkCount.bind(this);
    }
    componentDidMount() {
        console.log(this.props.web3.givenProvider.selectedAddress);
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
       console.log(url); window.open(url,'_blank');
    }

    triggerModal(assetSybmol, kyberAmount){
        console.log("trigget modal");
        this.setState({kyberAmount : kyberAmount, assetSybmol : assetSybmol});
        this.openModal();

    }

    checkCount(){
        var count = 0;
        this.props.data && this.props.data.map((record, index) => {
            if(this.props.web3.givenProvider.selectedAddress==record.taker){
                count++;
            }
        })

        return count>0;
    }
    render() {
        return (      
            <div className="card card-box">
                <div className="card-head">
                    <header>Your Orders</header>
                    <div className="tools">
                        <a className="fa fa-repeat btn-color box-refresh" href="javascript:;"></a>
                        <a className="t-collapse btn-color fa fa-chevron-up" href="javascript:;"></a>
                        <a className="t-close btn-color fa fa-times" href="javascript:;"></a>
                    </div>
                </div>
                <div className="card-body ">
                    {this.checkCount() && 
                        <div className="table-wrap">
                            <div className="table-responsive">
                                <table className="table display product-overview mb-30" id="support_table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Id</th>
                                            <th scope="col">Base Token</th>
                                            <th scope="col">Quote Token</th>
                                            <th scope="col">Strike Price</th>
                                            <th scope="col">Expiry Date</th>
                                            <th scope="col">No. of Base Tokens</th>
                                            <th scope="col">Premium</th>
                                            <th scope="col">Qty</th>
                                            <th scope="col">Buy Order</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {   
                                            this.props.data && this.props.data.map((record, index) => (
                                                this.props.web3.givenProvider.selectedAddress==record.taker && 
                                                <OrderTable key={index} data={record} index={index} history={this.props.history} orderbook={this.props.orderbook} 
                                                triggerModal={this.triggerModal}  web3={this.props.web3}/>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }{
                        !this.checkCount() && <div style={{textAlign:'left', fontSize:'1.5em', paddingLeft:'2%'}}>No orders found :(</div>
                    }
                    </div>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        contentLabel="Insufficient Tokens"
                        style={customStyles}
                    >

                        <h2 ref={subtitle => this.subtitle = subtitle}>You don't have enough tokens for this order</h2>
                        <button onClick={this.closeModal}>Cancel this order</button>
                        <button onClick={this.goToKyber}>Get Tokens</button>
                    </Modal>
                    
            </div>
        )
    }
}
