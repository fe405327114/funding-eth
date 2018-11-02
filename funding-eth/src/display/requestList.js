import React from 'react'
import {Table, Button} from 'semantic-ui-react'

const RequestList = (props) => {
    let {requests, supportersCount, tabKey, onApproveClick, onFinalizeClick} = props
    //requests是一个数组，我们要使用map遍历它，然后每一个reqest生成一个Table.Row
    let finalTableRow = requests.map((request, index) => {
        console.log("xxxxxxxxx","index :", index,  typeof onApproveClick)
        //return (req.purpose, req.cost, req.seller, isVoted, req.approveCount, uint(req.status));
        let {0:purpose, 1:cost, 2:seller, 3:isVoted, 4:approveCount, 5:status} = request
        //status : 0-> 投票中 1-> 已批准 2-> 已完成

        let isCompleted = false
        let showStatus

        if (status == 2) {
            isCompleted = true;
            showStatus = '已完成!';
        } else if (supportersCount > approveCount * 2 ) {
            showStatus = '投票中...';
        } else {
            //待解决，传递一个investor总量过来
            showStatus = '已批准!';
        }


        return (
            <Table.Row key={index}>
                <Table.Cell>{purpose}</Table.Cell>
                <Table.Cell>{cost}</Table.Cell>
                <Table.Cell>{seller}</Table.Cell>
                <Table.Cell>{approveCount}</Table.Cell>
                <Table.Cell>{showStatus}</Table.Cell>
                <Table.Cell>
                    {
                        (tabKey == 2) ? (
                            <Button disabled={approveCount * 2 < supportersCount ||isCompleted} onClick={() => onFinalizeClick(index)}>支付</Button>
                        ) : (
                            <Button disabled={isVoted || isCompleted} onClick={() => onApproveClick(index)}>批准</Button>
                        )
                    }
                </Table.Cell>
            </Table.Row>
        )
    })

    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>花费详情</Table.HeaderCell>
                    <Table.HeaderCell>花费金额</Table.HeaderCell>
                    <Table.HeaderCell>消费商家</Table.HeaderCell>
                    <Table.HeaderCell>当前批准人数</Table.HeaderCell>
                    <Table.HeaderCell>当前状态</Table.HeaderCell>
                    <Table.HeaderCell>操作</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    finalTableRow
                }
            </Table.Body>
        </Table>
    )
}

export default RequestList
