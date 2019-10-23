import React from 'react';
import OrderTable from './OrderTable';
import Table from 'react-bootstrap/Table';


export default class Orderbook extends React.Component {

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
            <div class="col-md-12 col-sm-12">
                <div class="card card-box">
                    <div class="card-head">
                        <header>Order Book</header>
                        <div class="tools">
                            <a class="fa fa-repeat btn-color box-refresh" href="javascript:;"></a>
                            <a class="t-collapse btn-color fa fa-chevron-up" href="javascript:;"></a>
                            <a class="t-close btn-color fa fa-times" href="javascript:;"></a>
                        </div>
                    </div>
                    <div class="card-body ">
                        <div class="table-wrap">
                            <div class="table-responsive">
                                <table class="table display product-overview mb-30" id="support_table">
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
                                                <OrderTable key={index} record={record} index={index} history={this.props.history}/>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
