// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Escrow {
    address public client;
    address public freelancer;
    mapping (address => bool) public isArbiter;
    uint noOfArbiters;
    uint public amount; 
    string public terms;
    enum State {Initiated, InDispute, Cancelled, Completed}
    State public state;
    mapping(address => bool) public hasVoted;
    uint approvedVotes;
    uint totalVotes;

    event Initiated();
    event DisputeRaised(address);
    event DisputeResolved();
    event Completed();
    event Cancelled();
    event Voted(address);

    constructor(address _freelancer, address[] memory _arbiters, uint _amount, string memory _terms) payable{
        client = msg.sender;
        freelancer = _freelancer;
        amount = _amount;
        terms = _terms;
        state = State.Initiated;
        noOfArbiters = _arbiters.length;
        for (uint i = 0; i < _arbiters.length; i++) {
            isArbiter[_arbiters[i]] = true;
        }
        require(msg.value >= amount, "Transfer amount is less than contract amount");
        emit Initiated();
    } 

    function vote(bool approve) external onlyArbiter{
        hasVoted[msg.sender] = true;
        emit Voted(msg.sender);
        totalVotes++;
        if(approve) approvedVotes++;
        if(totalVotes == noOfArbiters) resolveDispute();
    }

    modifier onlyArbiter(){
        require(isArbiter[msg.sender], "Only arbiters can vote");
        _;
    }

    function clientApproval() public onlyClient{
        processPayment();
    }

    modifier onlyClient() {
        require(msg.sender == client, "Only client can process instantly");
        _;
    }

    function processPayment() internal{
        (bool sent,) = freelancer.call{ value: amount }("");
        require(sent, "Failed to send ether");
        state = State.Completed;
        emit Completed();
    }

    function raiseDispute() external onlyClientOrFreelancer{
        require(state == State.Initiated, "Dispute can't be raised after completion or cancellation");
        state = State.InDispute;
        emit DisputeRaised(msg.sender);
    }

    modifier onlyClientOrFreelancer() {
        require(msg.sender == client || msg.sender == freelancer, "Only client or freelancer can raise dispute");
        _;
    }

    function resolveDispute() internal{
        if(approvedVotes > noOfArbiters/2){
            processPayment();
        }else{
            processRefund();
        }
        emit DisputeResolved();
    }

    function processRefund() internal{
        (bool sent,) = client.call{ value: address(this).balance }("");
        require(sent, "Failed to send ether");
        state = State.Cancelled;
        emit Cancelled();
    }
}
