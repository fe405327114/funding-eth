import React from 'react'
import { Tab } from 'semantic-ui-react'
import AllFundingTab from './allFundingTab/allFundingTab'
import CreatorFundingTab from './creatorFundingTab/creatorFundingTab'
import SupportFundingTab from './supportFundingTab/supportFundingTab'

const panes = [
    { menuItem: '所有的', render: () => <Tab.Pane><AllFundingTab/></Tab.Pane> },
    { menuItem: '我发起的', render: () => <Tab.Pane><CreatorFundingTab/></Tab.Pane> },
    { menuItem: '我参与的', render: () => <Tab.Pane><SupportFundingTab/></Tab.Pane> },
]

const TabExampleBasic = () => <Tab panes={panes} />

export default TabExampleBasic
