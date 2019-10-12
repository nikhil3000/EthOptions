import React from 'react';
import algosdk from 'algosdk';


export default class Login extends React.Component {
    
    constructor(props)
    {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleGenerateAccount = this.handleGenerateAccount.bind(this);
        this.state = {
           mnemonic : undefined
        }
    }
    
    handleFormSubmit(e){
        e.preventDefault();
        var mnemonic = e.target.mnemonic.value.trim();
        var account = algosdk.mnemonicToSecretKey(mnemonic);
        var privateKeyString = String.fromCharCode.apply(null, new Uint8Array(account.sk));
       account.sk = privateKeyString;
       console.log("account",account);
       localStorage.setItem('AlgorandAccount',JSON.stringify(account));
       window.alert("account imported in your local sotrage");
       this.props.history.push('/home');
    }

    handleGenerateAccount()
    {
        var account = algosdk.generateAccount();
       console.log("account",account);
        var mnemonic = algosdk.secretKeyToMnemonic(account.sk);
        this.setState({mnemonic:mnemonic});
        var privateKeyString = String.fromCharCode.apply(null, new Uint8Array(account.sk));
       account.sk = privateKeyString;
       localStorage.setItem('AlgorandAccount',JSON.stringify(account));
      
       

    }


    componentWillMount()
    {
        var user = localStorage.getItem('AlgorandAccount');
        if(user)
        this.props.history.push('/home');
    }

    render()
    {
        return (
            <div>
               <form onSubmit = {this.handleFormSubmit}>
                   <input type="text" placeholder="Enter your mnemonic" name="mnemonic"></input>
                   <input type="submit"></input>
               </form>
               OR
               <br></br>
               <button className="btn btn-primary" onClick={this.handleGenerateAccount}>Generate new account</button>
                {this.state.mnemonic && <p>your mnemonic is "{this.state.mnemonic}" , Please store it securely, this is the only way to resotre your account.</p>}
            </div>
        )
    }
}