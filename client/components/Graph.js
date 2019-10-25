import React, { Component, Fragment } from 'react';
import axios from 'axios';
import OrderTable from './OrderTable';
import Table from 'react-bootstrap/Table';
// import * as priceData from '../price.js';
import {baseURL} from '../config';
import CreatableSelect from 'react-select/creatable';
import { data } from '../data'


export default class Orderbook extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: undefined
        }
    }
    componentDidMount() {
    //    console.log(priceData);
       axios.get(baseURL + '/getPriceData')
       .then(res=>{
           console.log(res);
        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.paddingRight = 20;

        chart.dateFormatter.inputDateFormat = "YYYY-MM-dd";

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;

        var series = chart.series.push(new am4charts.OHLCSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "close";
        series.dataFields.openValueY = "open";
        series.dataFields.lowValueY = "low";
        series.dataFields.highValueY = "high";
        series.tooltipText = "Open:${openValueY.value}\nLow:${lowValueY.value}\nHigh:${highValueY.value}\nClose:${valueY.value}";
        series.strokeWidth = 2;

        chart.cursor = new am4charts.XYCursor();

        // a separate series for scrollbar
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.dataFields.dateX = "date";
        lineSeries.dataFields.valueY = "close";
        // need to set on default state, as initially series is "show"
        lineSeries.defaultState.properties.visible = false;

        // hide from legend too (in case there is one)
        lineSeries.hiddenInLegend = true;
        lineSeries.fillOpacity = 0.5;
        lineSeries.strokeOpacity = 0.5;

        var scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(lineSeries);
        chart.scrollbarX = scrollbarX;
        chart.data = res.data;
       })
       
        
        // chart.events.on("inited", function () {
        //     dateAxis.zoomToDates(new Date(2019, 9, 24), new Date(2019, 10, 24))
        // });
    }

    handleBaseTokenChange(baseTokenObject) {
        this.setState({ baseTokenObject: baseTokenObject });
    }
    render() {
        return (
            <div className="card card-box">
                <div className="card-head">
                    <header>Some Graph Here</header>
                    <div className="tools">
                        <a className="fa fa-repeat btn-color box-refresh" href="javascript:;"></a>
                        <a className="t-collapse btn-color fa fa-chevron-down" href="javascript:;"></a>
                        <a className="t-close btn-color fa fa-times" href="javascript:;"></a>
                    </div>
                </div>
                <div className="card-body no-padding height-9">
                    <div className="form-group">
                        <Fragment>
                            <CreatableSelect
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={''}
                                onChange={this.handleBaseTokenChange}
                                options={data}
                                placeholder="Base Token"
                            />
                        </Fragment>
                    </div>
                    <div id="chartdiv"></div>
                </div>
            </div>
        )
    }
}
