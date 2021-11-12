// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

// store & retrieve value in a variable

contract Storage {
    uint256 number;
    mapping(string => bytes32) private relationship;

    function store(uint256 num) public {
        number = num;
    }

    function retrieve() public view returns (uint256) {
        return number;
    }

    function push(string memory _address) public {
        relationship[_address] = keccak256(abi.encodePacked(block.timestamp));
    }
}
