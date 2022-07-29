// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./OwnerManager.sol";

contract Factory {
    event ContractInstantiation(address sender, address instantiation);
    mapping(address => bool) public isInstantiation;
    mapping(address => address[]) public instantiations;

    function getInstantiationCount(address creator)
        public
        view
        returns (uint256)
    {
        return instantiations[creator].length;
    }

    function register(address instantiation) internal {
        isInstantiation[instantiation] = true;
        instantiations[msg.sender].push(instantiation);
        emit ContractInstantiation(msg.sender, instantiation);
    }

    function create(
        string memory contents,
        address[] memory _owners,
        bytes[] memory signatures,
        uint256 _threshold
    ) public returns (address) {
        OwnerManager ownerManager = new OwnerManager(
            contents,
            _owners,
            signatures,
            _threshold
        );
        register(address(ownerManager));
        return address(ownerManager);
    }
}
