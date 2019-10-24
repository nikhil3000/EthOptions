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
        console.log(process.env.atlasUser);
    }
    render() {
        return (
            <div class="card card-box">
                <div class="card-head">
                    <header>Some Graph Here</header>
                    <div class="tools">
                        <a class="fa fa-repeat btn-color box-refresh" href="javascript:;"></a>
                        <a class="t-collapse btn-color fa fa-chevron-down" href="javascript:;"></a>
                        <a class="t-close btn-color fa fa-times" href="javascript:;"></a>
                    </div>
                </div>
                <div class="card-body no-padding height-9">
                    <div class="row"><iframe class="chartjs-hidden-iframe" tabindex="-1" style={{display: 'block', overflow: 'hidden', border: '0px', margin: '0px', top: '0px', left: '0px', bottom: '0px', right: '0px', height: '100%', width: '100%', position: 'absolute', pointerEvents: 'none', zIndex: '-1'}}></iframe>
                        <canvas id="chartjs_line" width="984"  style={{display: 'block', height: '246px', width:'492px'}}></canvas>
                    </div>
                </div>
            </div>
        )
    }
}
