import React from 'react';

export default class Order extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        console.log("order.js",this.props.data);
    }
    render() {
        return (
            <div>
                <h2>Order</h2>
                <p>Maker:{this.props.data && this.props.data.maker}</p>
                <p>Base Token:{this.props.data && this.props.data.baseToken}</p>
                <p>Quote Token:{this.props.data && this.props.data.quoteToken}</p>
                <p>Maker : {this.props.data && this.props.data.maker}</p>
                <p>Premium: {this.props.data && this.props.data.premium}</p>
                <p>Strike Price: {this.props.data && this.props.data.strikePrice}</p>
                <p>Expiry: {this.props.data && this.props.data.expiryString}</p>
            </div>
        )
    }
}
