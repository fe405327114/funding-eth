pragma solidity^0.4.24;

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

//crow-funding
contract Funding {

    address public manager;
    // 1. 名字：魔鬼电动牙刷
    string public projectName;
    // 2. 需要每个投资人投多少钱：38元
    uint256 public supportMoney;
    // 3. 总共要集资多少钱：100000
    uint256 public targetMoney;
    // 4. 众筹截止时间：30天 //2592000s
    uint256 endTime;
    mapping(address=> bool) supporterExistMap;
    SupporterFunding supporterFunding;

    // constructor(string _projectName, uint256 _supportMoney, uint256 _targetMoney,
    // uint256 _durationTime, address _creator,  mapping(address => address[]) _supportFundingsArray) public {

    constructor(string _projectName, uint256 _supportMoney, uint256 _targetMoney,
        uint256 _durationTime, address _creator, SupporterFunding _supporterFunding) public {



        // manager = msg.sender;
        manager = _creator; //把项目发起人的地址传递过来，否则就是合约工厂的地址了
        projectName = _projectName;
        supportMoney = _supportMoney;
        targetMoney = _targetMoney;
        endTime = now + _durationTime;  //传递进来众筹持续的时间，单位为秒，now 加上这个值，就能算出项目截止时间
        supporterFunding = _supporterFunding;

    }

    address[] supporters; //记录投资人的地址集合

    //投资人投钱，记录投资的地址
    function support() public payable {
        require(msg.value == supportMoney); //wei
        supporters.push(msg.sender);
        //每次赞助之后，都使用一个map来记录投资人，便于后续快速检查
        supporterExistMap[msg.sender] = true;
        //supportFundingsArray[msgr]

        //对传递过来的SupportFunding的结构进行赋值
        supporterFunding.joinFunding(msg.sender, this);
    }

    //退款
    function refund() onlyManager public {
        for (uint256 i = 0; i< supporters.length; i ++) {
            supporters[i].transfer(supportMoney);
        }
        //delete supporters;
    }

    enum RequestStatus { Voting, Approved, Completed}
    //modifier


    struct Request {
        // 1. 要做什么：买电池
        string purpose;
        // 2. 卖家地址：0x1234xxx
        address seller;
        // 3. 多少钱：10元
        uint256 cost;
        // 4. 当前赞成的票数：10票
        uint256 approveCount;
        // 5. 有一个集合，记录投资人投票的状态：投过票，true，未投：false
        mapping(address => bool) voteStatus;  //每个地址智能support一次   //没有make(map[uint]string)
        //voteStatus[0x111] = true
        RequestStatus status;
    }

    //项目方可以创建多个请求，需要一个数组记录
    Request[] public requests;
    function createRequest(string _purpose, address _seller, uint256 _cost) onlyManager public {
        Request memory req = Request({purpose: _purpose, seller: _seller, cost: _cost, approveCount: 0, status : RequestStatus.Voting});
        requests.push(req);
    }

    //投资人批准：默认不投票：no，主动投票：yes
    function approveRequest(uint256 index) public {
        // 投资者调用approveRequest
        // 1. 找到这个请求
        // 限定:只有投资人才可以投票
        // 2. 检查自己没有投过票
        // 3. 投票
        // 4. 标志自己已经投过票了
        //bool flag = false;

        // Flag 来记录遍历数组的结果，
        // True表示：是投资人
        // False表示：非投资人，直接退出

        // require(supporterExistMap[msg.sender] == true);
        require(supporterExistMap[msg.sender]);

        Request storage req = requests[index];

        //检查，如果不是投票状态（Compete或者Approved），就不用投票了
        require(req.status == RequestStatus.Voting);

        //这种使用for遍历的方式一定要小心， 尽量不要使用，消耗gas非常多
        // for (uint i = 0 ; i < supporters.length; i++) {
        //     if (supporters[i] == msg.sender) {
        //         flag = true;
        //         break;
        //     }
        //     // break;
        // }

        // require(flag);

        require(req.voteStatus[msg.sender] ==  false);
        req.approveCount++;
        req.voteStatus[msg.sender] =  true;
    }


    //项目方可以花费这笔钱。
    function finalizeReqeust(uint256 index) onlyManager public {
        Request storage req = requests[index];

        // 1. 检查当前余额是否满足支付
        require(address(this).balance >= req.cost);

        // 2. 检查赞成人数是否过半
        require(req.approveCount *2  > supporters.length);

        // 3. 向卖家转账
        req.seller.transfer(req.cost);

        // 4. 改变这个request的状态为Completed
        req.status  = RequestStatus.Completed;
    }

    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function getSupporters() public view returns(address[]) {
        return supporters;
    }


    function getSupportersCount() public view returns(uint256) {
        return supporters.length;
    }

    function getLeftTime() public view returns(uint256) {
        return endTime - now;
    }

    //返回花费请求的数量
    function getRequestCount() public view returns(uint256) {
        return requests.length;
    }

    //返回指定请求的详细信息
    function getRequestByIndex(uint256 index) public view returns(string, uint256, address, bool, uint256, uint256) {
        require(index < requests.length);

        Request storage req = requests[index];

        bool isVoted = req.voteStatus[msg.sender];
        return (req.purpose, req.cost, req.seller, isVoted, req.approveCount, uint(req.status));
    }
}
