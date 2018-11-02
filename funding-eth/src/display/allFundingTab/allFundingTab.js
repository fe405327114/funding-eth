import React, {Component} from 'react';
import {getFundingDetailArrayByTabId, supportFunding} from "../../eth/interaction";
import CardList from '../CardList'
import {Dimmer, Form, Label, Loader, Segment} from 'semantic-ui-react'

class AllFundingTab extends Component {
    constructor() {
        super()

        this.state = {
            allFundings: [],
            selectedFundingDetail: '',
            active: false,
        }
    }

    async componentDidMount() {
        try {
            let allFundings = await getFundingDetailArrayByTabId(1)
            this.setState({
                allFundings,
            })
        } catch (e) {
            console.log(e)
        }

    }

    //1. 在主界面传递一个回调函数onItemClick给CardList，用于返回用户点击的合约的详情
    //2. 在CardList中传给MyCard
    //3. 在MyCard中，当触发onClick的时候，调用这个onItemClick，返回相应的detail

    handleSupport = async () => {
        try {
            this.setState({active: true});
            const {0: fundingAddress, 1: projectName, 2: supportMoney} = this.state.selectedFundingDetail;
            console.log('funding :', fundingAddress);
            // const {selectedFunding} = this.state;
            let result = await supportFunding(fundingAddress, supportMoney);
            this.setState({active: false});
            alert(`参与众筹成功\n项目名称：${projectName}\n项目地址：${fundingAddress}\n支持金额：${supportMoney}`);
            console.log('invest successfully:\n', result);
        } catch (e) {
            this.setState({active: false});
            console.log(e);
        }
    }


    render() {
        let {allFundings, selectedFundingDetail} = this.state
        let {0: fundingAddress, 1: projectName, 2: supportMoney, 3: targetMoney, 4: balance, 5: supporters, 6: leftTime, 7: supportersCount} = selectedFundingDetail
        return (
            <div className="App">
                <CardList details={allFundings} onItemClick={(detail) => {
                    console.log(detail)
                    this.setState({selectedFundingDetail: detail})
                }}/>

                <h2>参与众筹</h2>
                {
                    selectedFundingDetail && (
                        <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
                            <Dimmer active={this.state.active} inverted>
                                <Loader>支持中</Loader>
                            </Dimmer>
                            <Form onSubmit={this.handleSupport}>
                                <Form.Input type='text' value={projectName} label='项目名称:'/>
                                <Form.Input type='text' value={fundingAddress} label='项目地址:'/>
                                <Form.Input type='text' value={supportMoney} label='支持金额:'
                                            labelPosition='left'>
                                    <Label basic>￥</Label>
                                    <input/>
                                </Form.Input>

                                <Form.Button primary content='参与众筹'/>
                            </Form>
                        </Dimmer.Dimmable>

                    )
                }
            </div>
        );
    }
}

export default AllFundingTab;
