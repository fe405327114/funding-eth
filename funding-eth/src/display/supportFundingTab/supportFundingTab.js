import React, { Component } from 'react';
import {getAllRequests, getFundingDetailArrayByTabId, approveRequest} from "../../eth/interaction";
import CardList from '../CardList'
import {Button} from 'semantic-ui-react'
import RequestList from "../requestList";


class SupportFundingTab extends Component {
    constructor() {
        super()

        this.state = {
            supporterFundings: [],
            selectedFundingDetail : '',
            requests : [],
        }
    }

    async componentDidMount() {
        try {
            let supporterFundings = await getFundingDetailArrayByTabId(3)
            this.setState({
                supporterFundings,
            })
        } catch (e) {
            console.log(e)
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

    onApproveClickFunc= async (index) => {
        try {
            console.log('click index :', index);
            let {0:fundingAddress} = this.state.selectedFundingDetail
            await approveRequest(fundingAddress, index);
        } catch (e) {
            console.log(e)
        }
    }



    render() {
        let {supporterFundings, selectedFundingDetail, requests} = this.state
        let {7:supportersCount} = selectedFundingDetail

        return (
            <div className="App">
                <CardList details={supporterFundings} onItemClick={(detail) => {
                    console.log(detail)
                    this.setState({selectedFundingDetail: detail})
                }}/>

                {
                    selectedFundingDetail && (
                        <div>
                            <Button onClick={this.getRequests}>申请详情</Button>
                            <RequestList requests={requests}
                                         supportersCount={supportersCount}
                                         tabKey={3}
                                         onApproveClick={this.onApproveClickFunc}
                            />
                        </div>
                    )

                }
            </div>
        );
    }
}

export default SupportFundingTab;
