import React from 'react';

export default class OrderTable extends React.Component {
    constructor(props) {
        super(props);
        this.goToOrder = this.goToOrder.bind(this)

    }

    function goToOrder() {
          e.preventDefault();
          <Redirect to={{
            pathname: '/Order',
            state: { data: this.props.order }
        }}
/>
        }

    render() {
        return (
            <tr>
                <th scope="row">{this.props.index+1 }</th>
                <td>{this.props.record.order.baseToken}</td>
                <td>{this.props.record.order.quoteToken}</td>
                <td>{this.props.record.order.strikePrice}</td>
                <td>{this.props.record.order.expirationTimeSeconds}</td>
                <td>{this.props.record.order.numberOfBaseToken}</td>
                <td>{this.props.record.order.premium}</td>
                <td><Button variant="primary" onClick={goToOrder}>Fill Order</Button></td>
            </tr>
        )
    }
}