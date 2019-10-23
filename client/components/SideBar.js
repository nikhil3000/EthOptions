import React from 'react';


export default class OrderTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="sidenav">
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Clients</a>
            <a href="#">Contact</a>
            </div>
        )
    }
}