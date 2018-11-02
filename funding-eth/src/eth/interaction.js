//interaction 交互
import {fundingFactoryContract, newFundingContract} from "./contracts";
import web3 from "../utils/getWeb3";

//index = 1， 代表第一个页面，获取所有的合约
//index = 2， 代表第二个页面，获取创建者的合约
//index = 3， 代表第三个页面，获取参与的合约
let getFundingDetailArrayByTabId = (index) => {
    //自定义一个promise，封装自己的业务逻辑
    return new Promise((async (resolve, reject) => {

        try {
            let accounts = await web3.eth.getAccounts()

            let fundings = []
            //众筹合约的地址集合：飞机， 航母
            if (index === 1) {
                fundings = await fundingFactoryContract.methods.getAllFundings().call({
                    from: accounts[0]
                })

            } else if (index === 2) {
                fundings = await fundingFactoryContract.methods.getCreatorFundings().call({
                    from: accounts[0]
                })


            } else if (index === 3) {
                fundings = await fundingFactoryContract.methods.getSupporterFundings().call({
                    from: accounts[0]
                })

            } else {
                reject("输入错误")
            }

            // let fundingDetails = [] //所有合约的详细信息的集合
            //这种使用for循环的方式不高效， 因为渲染获取数据是顺序的
            // for (let i = 0 ; i< creatorFundings.length; i++ ) {
            //     let fundingDetail = await getFundingDetail(creatorFundings[i])
            //     fundingDetails.push(fundingDetail)
            // }
            //map里面是一个函数，有两个参数，第一个是遍历的数据，第二个是索引值

            // creatorFundings = [1,2,3,4]
            // let rest = creatorFundings.map((value, i) => {return value + 1})
            // rest = [2,3,4,5]


            //返回一个detail promise的集合
            let detailsArray = fundings.map(creatorFunding => getFundingDetail(creatorFunding))
            //这个方法，将所有的promise转换为一个promise
            let fundingDetailsRes = Promise.all(detailsArray)

            // console.table(fundingDetails)
            // let a = typeof fundingDetails
            // console.log(`${a}`)

            //成功时调用resolve，返回正确数据
            resolve(fundingDetailsRes)
        } catch (e) {
            //失败时调用reject，返回错误信息
            reject(e)
        }
    }))
}


let getFundingDetail = (fundingAddress) => {
    return new Promise(async (resolve, reject) => {
        //众筹合约的地址
        //这个fundingContract已经完整，可以调用了
        try {
            //这个fundingContract全局唯一，在进行map处理的时候，后面的合约地址将前面的给覆盖了，导致返回总是最后一个合约的数据
            // fundingContract.options.address = fundingAddress

            //解决办法：每一个合约都创建一个新的fundingContract
            let fundingContractNew = newFundingContract()
            // console.log('new :', fundingContractNew)
            fundingContractNew.options.address = fundingAddress

            let accounts = await web3.eth.getAccounts()
            //根据合约的实例，获取这个合约的详细信息
            //合约里面的public修饰的状态变量（成员）会默认的生成一个访问函数（Getter Function）
            let manager = await fundingContractNew.methods.manager().call({from: accounts[0]})
            let projectName = await fundingContractNew.methods.projectName().call({from: accounts[0]})
            let supportMoney = await fundingContractNew.methods.supportMoney().call({from: accounts[0]})
            let targetMoney = await fundingContractNew.methods.targetMoney().call({from: accounts[0]})
            let balance = await fundingContractNew.methods.getBalance().call({from: accounts[0]})
            let supporters = await fundingContractNew.methods.getSupporters().call({from: accounts[0]})
            let leftTime = await fundingContractNew.methods.getLeftTime().call({from: accounts[0]})
            let supportersCount = await fundingContractNew.methods.getSupportersCount().call({from: accounts[0]})

            // console.log('111111 manager :', manager)
            // resolve({manager, projectName, supportMoney, targetMoney, balance, supporters})
            resolve([fundingAddress, projectName, supportMoney, targetMoney, balance, supporters, leftTime, supportersCount])
            // console.table(fundingDetails)
        } catch (e) {
            reject(e)
        }
    })
}


const createFunding = (projectName, supportMoney, targetMoney, durationTime) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts();
            let result = await fundingFactoryContract.methods.createFunding(projectName, supportMoney, targetMoney, durationTime).send({
                from: accounts[0]
            });
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

const supportFunding = (funding, supportMoney) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts();
            //创建新的合约实例，将点击的众筹项目地址传递进去，然后才能发起参与
            let fundingContract = newFundingContract();
            fundingContract.options.address = funding;
            let result = await fundingContract.methods.support().send({
                from: accounts[0],
                //参与要传递相应的金额
                value: supportMoney,
            });
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

const createRequest = (fundingAddress, purpose, cost, seller) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts();
            let fundingContract = newFundingContract();
            fundingContract.options.address = fundingAddress;
            let result = await fundingContract.methods.createRequest(purpose, seller, cost).send({
                from: accounts[0],
            });
            console.log(result)
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}


const getAllRequests = (fundingAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts();
            let fundingContract = newFundingContract();
            fundingContract.options.address = fundingAddress;
            //拿到请求的数量: 3
            let requestCount = await fundingContract.methods.getRequestCount().call({
                from: accounts[0],
            });

            let requestDetails = [];
            for (let i = 0; i < requestCount; i++) {
                let requestDetail = await fundingContract.methods.getRequestByIndex(i).call({
                    from: accounts[0],
                });

                requestDetails.push(requestDetail);
            }
            resolve(requestDetails);
        } catch (e) {
            reject(e);
        }
    })
}

const approveRequest = (address, index) => {
    return new Promise(async (resolve, reject) => {
        try {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            console.log(`account: ${account}`);
            console.log(`funding: ${address}`);
            console.log(`index: ${index}`);
            const contract = newFundingContract();
            contract.options.address = address;
            const result = await contract.methods.approveRequest(index).send({
                from: account,
            });
            console.log('result :', result);

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
};

const finalizeRequest = (address, index) => {
    return new Promise(async (resolve, reject) => {
        try {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            console.log(`account: ${account}`);
            console.log(`funding: ${address}`);
            console.log(`index: ${index}`);
            const contract = newFundingContract();
            contract.options.address = address;
            const result = await contract.methods.finalizeReqeust(index).send({
                from: account,
            });
            console.log('result :', result);

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
};



export {
    getFundingDetailArrayByTabId,
    createFunding,
    supportFunding,
    createRequest,
    getAllRequests,
    approveRequest,
    finalizeRequest,
}
