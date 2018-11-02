import React from 'react'
import { Card, Image, Icon, Progress, List } from 'semantic-ui-react'

const CardList = (props) => {
    let {details, onItemClick} = props
    console.table(details)
    //根据details数组的个数，返回响应Card
    let finalCards = details.map((detail, index) => {

        return <MyCard key={index} detail={detail} onItemClick={onItemClick}/>

    })



    return (
        <Card.Group itemsPerRow={4}>
            {
                finalCards
            }
        </Card.Group>
    )
}


let MyCard = (props) => {

    // resolve([fundingAddress, projectName, supportMoney, targetMoney, balance, supporters, leftTime, supportersCount])
    let {0:fundingAddress, 1:projectName, 2:supportMoney, 3:targetMoney, 4:balance, 5:supporters, 6:leftTime, 7:supportersCount} = props.detail
    console.log(fundingAddress, projectName, supportMoney, targetMoney, balance, supporters)

    return (
        <Card onClick={()=> props.onItemClick(props.detail)}>
            <Image src='/images/logo.jpg'/>
            <Card.Content>
                <Card.Header>{projectName}</Card.Header>
                <Card.Meta>
                    <span>剩余时间:{leftTime}秒</span>
                    <Progress indicating percent={balance / targetMoney * 100} size='small' progress/>
                </Card.Meta>
                <Card.Description>不容错过</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <List divided horizontal style={{display: 'flex', justifyContent: 'space-around'}}>
                    <List.Item>
                        <List.Content>
                            <List.Header>已筹</List.Header>
                            <List.Description>{balance}wei</List.Description>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>已达</List.Header>
                            <List.Description>{balance / targetMoney * 100}%</List.Description>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>参与人数</List.Header>
                            <List.Description>{supportersCount}人</List.Description>
                        </List.Content>
                    </List.Item>
                </List>
            </Card.Content>
        </Card>
    )
}

export default CardList
