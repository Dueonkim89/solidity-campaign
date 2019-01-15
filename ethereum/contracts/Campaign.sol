pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint amount) public {
        address newCampaign = new Campaign(amount, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;

    //count the number of contributors
    uint public approversCount;

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    function Campaign (uint amount, address user) public{
        manager = user;
        minimumContribution = amount;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount ++;
    }

    function createRequest(string description, uint value, address recipient) public managerOnly {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        //storage variable because we want to change the data sitting in storage
         Request storage request = requests[index];

        //make sure legitimate contributor
        require(approvers[msg.sender]);
        // make sure has not voted before
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount ++;
    }

    function finalizeRequest(uint index) public managerOnly {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

}
