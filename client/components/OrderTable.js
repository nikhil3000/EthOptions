import React from 'react';


export default class OrderTable extends React.Component {
    constructor(props) {
        super(props);
        this.goToOrder = this.goToOrder.bind(this)
        this.state = {
            orderbook : true
        }

    }

    componentDidMount() {
        console.log(this.props.history.location.pathname);
        if(this.props.history.location.pathname != '/orderbook')
        this.setState({orderbook:false});
    }
    goToOrder(e) {
        e.preventDefault();
        console.log("go to order");
        this.props.history.push(`/order/${this.props.index}`);
    }

    render() {
        return (
            <tr>
                <th scope="row">{this.props.index + 1}</th>
                <td>{this.props.record.baseToken}</td>
                <td>{this.props.record.quoteToken}</td>
                <td>{this.props.record.strikePrice}</td>
                <td>{this.props.record.expiryString}</td>
                <td>{this.props.record.qty}</td>
                <td>{this.props.record.premium}</td>
                {this.state.orderbook && <td><button variant="primary" onClick={this.goToOrder}>Fill Order</button></td>}
                {!this.state.orderbook && <td><button variant="primary" onClick={this.goToOrder}>Exercise</button></td>}
            </tr>
        )
    }
}