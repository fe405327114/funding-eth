import React, { Component } from 'react';
import {createFunding, createRequest, getFundingDetailArrayByTabId, getAllRequests, finalizeRequest} from "../../eth/interaction";
import CardList from "../CardList";
import {Dimmer, Form, Label, Segment, Loader, Button} from 'semantic-ui-react'
import RequestList from "../requestList";

class CreatorFundingTab extends Component {
    constructor() {
        super()


        this.state = {
            creatorFundings : [],
            active: false,
            projectName: '',
            supportMoney : '',
            targetMoney : '',
            durationTime : '',
            selectedFundingDetail :'',
            cost : '',
            seller: '',
            purpose:'',
            requests: [],

        }
    }

    async componentDidMount() {
        try {
            let creatorFundings = await getFundingDetailArrayByTabId(2)
            this.setState({
                creatorFundings,
            })
        } catch (e) {
            console.log(e)
        }

    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleCeateFunding = async () => {
        console.log('创建众筹中!')
        let {projectName, supportMoney, targetMoney, durationTime} = this.state
        console.log('项目名称:',projectName, "支持金额:", supportMoney, "目标金额:", targetMoney, "持续时间:", durationTime)
        try {
            await createFunding(projectName, supportMoney, targetMoney, durationTime)
            alert("创建众筹成功!")
            window.location.reload(true)
        } catch (e) {
            alert("创建众筹失败!")
            console.log(e)
        }

    }

    handleCreateRequest = async () => {
        //通过表单取到的数据
        let {purpose, cost, seller} = this.state;
        //点击取到的数据
        let {0:fundingAddress} = this.state.selectedFundingDetail

        console.log(purpose, cost, seller, fundingAddress)

        try {
            let result = await createRequest(fundingAddress, purpose, cost, seller);
            console.log(result);
            alert(`创建支付申请成功！`);
        } catch (e) {
            console.log(e);
        }
    }

    getRequests = async () => {
        let {0:fundingAddress} = this.state.selectedFundingDetail
        try {
            let requests = await getAllRequests(fundingAddress)
            this.setState({requests})
            console.log('requests 2222222222', requests)
        } catch (e) {
            console.log(e)
        }
    }

    onFinalizeClickFunc = async (index) => {
        try {
            console.log('click index :', index);
            let {0:fundingAddress} = this.state.selectedFundingDetail

            await finalizeRequest(fundingAddress, index);
        } catch (e) {
            console.log(e)
        }
    }


    render() {
        let {creatorFundings, active, durationTime, supportMoney,
            targetMoney, projectName, selectedFundingDetail, purpose, cost, seller,
            requests,
        } = this.state

        let {7:supportersCount} = selectedFundingDetail

        console.table(creatorFundings)
        return (
            <div className="App">
                <p>{creatorFundings}</p>
                <CardList details={creatorFundings} onItemClick={(detail) => {
                    console.log(detail)
                    this.setState({selectedFundingDetail: detail})
                }}/>

                <div>
                    <Dimmer.Dimmable as={Segment} dimmed={active}>
                        <Dimmer active={active} inverted>
                            <Loader>Loading</Loader>
                        </Dimmer>
                        <Form onSubmit={this.handleCeateFunding}>
                            <Form.Input required type='text' placeholder='项目名称' name='projectName'
                                        value={projectName} label='项目名称:'
                                        onChange={this.handleChange}/>
                            <Form.Input required type='text' placeholder='支持金额' name='supportMoney'
                                        value={supportMoney} label='支持金额:'
                                        labelPosition='left'
                                        onChange={this.handleChange}>
                                <Label basic>￥</Label>
                                <input/>
                            </Form.Input>

                            <Form.Input required type='text' placeholder='目标金额' name='targetMoney' value={targetMoney}
                                        label='目标金额:'
                                        labelPosition='left'
                                        onChange={this.handleChange}>
                                <Label basic>￥</Label>
                                <input/>
                            </Form.Input>
                            <Form.Input required type='text' placeholder='目标金额' name='durationTime' value={durationTime}
                                        label='众筹时间:'
                                        labelPosition='left'
                                        onChange={this.handleChange}>
                                <Label basic>S</Label>
                                <input/>
                            </Form.Input>
                            <Form.Button primary content='创建众筹'/>
                        </Form>
                    </Dimmer.Dimmable>
                </div>

                {
                    selectedFundingDetail && (
                        <div>
                            <br/>
                            <h3>发起付款请求</h3>

                            <Segment>
                                <h4>当前项目:{selectedFundingDetail.projectName},
                                    地址: {selectedFundingDetail.fundingAddress}</h4>
                                <Form onSubmit={this.handleCreateRequest}>
                                    <Form.Input type='text' name='purpose' required value={purpose}
                                                label='请求描述' placeholder='请求描述' onChange={this.handleChange}/>

                                    <Form.Input type='text' name='cost' required value={cost}
                                                label='付款金额' labelPosition='left' placeholder='付款金额'
                                                onChange={this.handleChange}>
                                        <Label basic>￥</Label>
                                        <input/>
                                    </Form.Input>

                                    <Form.Input type='text' name='seller' required value={seller}
                                                label='商家收款地址' labelPosition='left' placeholder='商家地址'
                                                onChange={this.handleChange}>
                                        <Label basic><span role='img' aria-label='location'>📍</span></Label>
                                        <input/>
                                    </Form.Input>

                                    <Form.Button primary content='开始请求'/>
                                </Form>
                            </Segment>
                        </div>)
                }

                {
                    selectedFundingDetail && (
                        <div>
                            <Button onClick={this.getRequests}>申请详情</Button>
                            <RequestList requests={requests}
                                         supportersCount={supportersCount}
                                         onFinalizeClick={this.onFinalizeClickFunc}
                                         tabKey={2}
                            />
                        </div>
                    )

                }

            </div>



        );
    }
}

export default CreatorFundingTab;
