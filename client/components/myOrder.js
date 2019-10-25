import React from 'react';
import OrderTable from './OrderTable';


export default class MyOrder extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: undefined
        }
    }
    componentDidMount() {
        console.log(this.props.web3.givenProvider.selectedAddress);
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
                                            <th scope="col">#</th>
                                            <th scope="col">Base Token</th>
                                            <th scope="col">Quote Token</th>
                                            <th scope="col">Strike Price</th>
                                            <th scope="col">Expiry Date</th>
                                            <th scope="col">No. of Base Tokens</th>
                                            <th scope="col">Premium</th>
                                            <th scope="col">Buy Order</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {   
                                            this.props.data && this.props.data.map((record, index) => (
                                                this.props.web3.givenProvider.selectedAddress==record.taker && <OrderTable key={index} record={record} index={index} history={this.props.history}/>
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
                    
            </div>
        )
    }
}
