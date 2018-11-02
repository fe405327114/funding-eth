pragma solidity^0.4.24;
import './funding-eth.sol';


contract FundingFactory {
    
    address public platformManager; //平台的管理员
    address[] fundingsAarry; //存储所有已经创建好的合约地址
    
    mapping(address => address[]) creatorFundingsArray; //找到项目方所创建的所有众筹项目：
    //mapping(address => address[]) supportFundingsArray; //找到所有自己参与过的合约项目
    
    SupporterFunding supporterFunding; //地址是零，一定要实例化
    
    constructor() {
        platformManager = msg.sender;
        supporterFunding = new SupporterFunding();//一定要实例化
    }
    
    //提过一个创建合约的方法
    function createFunding(string _projectName, uint256 _supportMoney, uint256 _targetMoney, uint256 _durationTime) {
        address funding = new Funding(_projectName, _supportMoney, _targetMoney, 
        _durationTime, msg.sender, supporterFunding);
        
        
        fundingsAarry.push(funding);
        creatorFundingsArray[msg.sender].push(funding); //维护项目发起人的所有众筹集合
    }
    
    function getAllFundings() public view returns(address[]) {
        return fundingsAarry;
    }
    
    
    function getCreatorFundings() public view returns(address[]) {
        return creatorFundingsArray[msg.sender];
    }
    
    function getSupporterFundings() public view returns(address[]) {
        return supporterFunding.getFunding(msg.sender);
    }
}


contract SupporterFunding {
    
    mapping(address => address[]) supportFundingsArray; ////找到所有自己参与过的合约项目
    //提供一个添加方法， //--> 在support时候调用
    function joinFunding(address addr, address funding) {
        supportFundingsArray[addr].push(funding);
    }   
    //提供一个读取方法, 
    
    function getFunding(address addr) public returns (address[]) {
        return supportFundingsArray[addr];
    }
}