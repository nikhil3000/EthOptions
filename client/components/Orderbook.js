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
    }
    render() {
        return (
            <div>
                <Table striped bordered hover >
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
                </Table>
            </div>
        )
    }
}
