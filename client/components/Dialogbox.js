import React from 'react';

export default class Dialogbox extends React.Component {

    constructor(props) {
        super(props)
    }
    componentDidMount() {
        console.log("Dialog");
    }

    render() {
        return (
            <div class="MuiPaper-root MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiPaper-rounded" role="dialog">
                <div class="MuiDialogTitle-root" id="alert-dialog-title">
                    <h2 class="MuiTypography-root MuiTypography-h6">{this.props.heading}</h2>
                </div>
                <div class="MuiDialogContent-root">
                    <p class="MuiTypography-root MuiDialogContentText-root MuiTypography-body1 MuiTypography-colorTextSecondary" id="alert-dialog-description">{this.props.description}</p>
                </div>
                <div class="MuiDialogActions-root MuiDialogActions-spacing">
                    {/* <button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary" tabindex="0" type="button"><span class="MuiButton-label">Okay</span><span class="MuiTouchRipple-root"></span></button> */}
                    {/* <button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary" tabindex="0" type="button"><span class="MuiButton-label">Agree</span><span class="MuiTouchRipple-root"></span></button> */}
                </div>
            </div>
        )
    }
}