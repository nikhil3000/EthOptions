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
    getFormattedDate(timestamp) {
        var date = new Date();
        date = new Date(timestamp*1000 + date.getTimezoneOffset());
    
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
    
        month = (month < 10 ? "0" : "") + month;
        day = (day < 10 ? "0" : "") + day;
        hour = (hour < 10 ? "0" : "") + hour;
        min = (min < 10 ? "0" : "") + min;
        sec = (sec < 10 ? "0" : "") + sec;
    
        var str = day + "/" + month + '/' + date.getFullYear() + "";
    
        return str;
    }
    render() {
        return (

            <tr>
                <th scope="row">{this.props.index + 1}</th>
                <td>{this.props.record.baseToken}</td>
                <td style={{color:"#2079f2"}}>{this.props.record.quoteToken}</td>
                <td>{this.props.record.strikePrice}</td>
                <td>{this.getFormattedDate(this.props.record.expiry)}</td>
                <td>{this.props.record.qty}</td>
                <td>{this.props.record.premium}</td>
                {this.state.orderbook && <td><button className="btn button-cust" variant="primary" onClick={this.goToOrder}>Fill Order</button></td>}
                {!this.state.orderbook && <td><button className="btn button-cust" variant="primary" onClick={this.goToOrder}>Exercise</button></td>}
            </tr>
        )
    }
}