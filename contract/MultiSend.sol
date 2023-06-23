// SPDX-License-Identifier: CC-BY-SA-4.0
pragma solidity ^0.8;


contract MultiSend{

    struct Payee{
        address payable addr;
        uint256 amount;
    }

    function sendEther(Payee[] memory payees) public payable{
        uint256 totalAmount = 0;
        for(uint256 i = 0; i < payees.length; i++){
            totalAmount += payees[i].amount;
        }

        require(totalAmount <= msg.value, "Insufficient Funds");

        for(uint256 i = 0; i < payees.length; i++){
            payees[i].addr.transfer(payees[i].amount);
        }

        payable(msg.sender).transfer(address(this).balance);
    }

    
}