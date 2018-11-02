import React, { Component } from 'react';
import web3 from './utils/getWeb3'
import {fundingFactoryContract} from './eth/contracts'
import TabExampleBasic from "./display/centerTab";

class App extends Component {
    constructor() {
        super()

        this.state= {
            platformManager : '',
            currentAccount : '',
        }
    }

    async componentDidMount() {
        let accounts = await  web3.eth.getAccounts()
        let platformManager = await fundingFactoryContract.methods.platformManager().call({
            from : accounts[0]
        })

        this.setState({
            currentAccount : accounts[0],
            platformManager,
        })

    }




  render() {
        let {platformManager, currentAccount, allFundings} = this.state
    return (
      <div className="App">
          <p>平台管理员地址: {platformManager}</p>
          <p>当前账户地址: {currentAccount}</p>
          <p>当前所有合约地址: {allFundings}</p>
          <TabExampleBasic/>
      </div>
    );
  }
}

export default App;
