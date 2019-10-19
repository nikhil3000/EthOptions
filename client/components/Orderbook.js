import React from 'react';
import OrderTable from './OrderTable';

export default class Orderbook extends React.Component {
    render () {
        constructor(props) {
            super(props)
            this.state = {
                data: undefined
            }

            componentDidMount() {
                axios.get('http://localhost:5000/getOrder').then(response => {
                    console.log(response.data);
                    this.setState ({
                        data:response.data
                    })
                })
            }
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
                <th scope="col">Premium</th>
                </tr>
            </thead>
            <tbody>
            {
                this.state.data && this.state.data.records.map((record, index ) => (
                        <OrderTable key={index} record={record} index={index} />
                )
                )
            }
            </tbody>
                </Table>
            </div>
        )
    }
}