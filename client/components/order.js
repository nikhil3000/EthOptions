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
                <link rel='stylesheet' href='https://widget.kyber.network/v0.7.2/widget.css' />
                <a href='https://widget.kyber.network/v0.7.2/?type=swap&mode=popup&lang=en&callback=https%3A%2F%2Fkyberpay-sample.knstats.com%2Fcallback&paramForwarding=true&network=ropsten&theme=theme-emerald'class='kyber-widget-button theme-emerald theme-supported' name='KyberWidget - Powered by KyberNetwork' title='Pay with tokens'target='_blank'>Swap tokens</a>
                <script async src='https://widget.kyber.network/v0.7.2/widget.js'></script>
            </div>
        )
    }
}
