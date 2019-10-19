import React from 'react';
import { Redirect } from 'react-router-dom'

export default class OrderTable extends React.Component {
    constructor(props) {
        super(props);
        this.goToOrder = this.goToOrder.bind(this)

    }

    componentDidMount() {
        // console.log(this.props);
    }
    goToOrder(e) {
        e.preventDefault();
        console.log("go to order");
        this.props.history.push(`/order/${this.props.index + 1}`);
    
        // <Redirect to={{
        //     pathname: '/Order',
        //     state: { data: this.props.order }
        // }}
        // />
    }

    render() {
        return (
            <tr>
                <th scope="row">{this.props.index + 1}</th>
                <td>{this.props.record.baseToken}</td>
                <td>{this.props.record.quoteToken}</td>
                <td>{this.props.record.strikePrice}</td>
                <td>{this.props.record.expirationTimeSeconds}</td>
                <td>{this.props.record.numberOfBaseToken}</td>
                <td>{this.props.record.premium}</td>
                <td><button variant="primary" onClick={this.goToOrder}>Fill Order</button></td>
            </tr>
        )
    }
}