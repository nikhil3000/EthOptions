import React from 'react';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="navbar-cust">
                
                <div className="center-heading">EthOptions</div>

                <div className="top-menu">
                    <span>Hello, Siddharth Bhalla <i className="fa fa-angle-down"></i></span>
				</div>

            </div>
        )
    }
}