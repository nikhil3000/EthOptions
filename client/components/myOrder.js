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
    render() {
        return (
            <div>
                <table striped bordered hover >
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
        )
    }
}
