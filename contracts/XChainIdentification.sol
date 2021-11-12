// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "./ERC20.sol";
import "./Storage.sol";

contract CrossChainIdentification is Storage, ERC20 {
    address private _address;

    constructor() ERC20("ERC20", "$") {
        _address = address(this);
    }

    function verify(
        bytes32 message,
        bytes memory sig,
        address _addr
    ) public pure returns (bool) {
        // bytes32 message = 0x185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969;
        // bytes memory sig = hex"9d6abbea880168c53bcb5ee665894078616ed7e9c97ed8fbc08a5eab6055c8c803b7b739a436d5cb23583bac7a95e66d5f08582a668ec3bac040687194da006e";
        // address addr = 0x999471bb43b9c9789050386f90c1ad63dca89106;

        return recover(message, sig) == _addr;
    }

    function test() public pure returns (address) {
        bytes
            memory message = hex"5647185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969";
        address _test;
        assembly {
            _test := mload(add(message, 22))
        }
        return _test;
    }

    function verifyPayload(
        bytes8 name,
        uint64 timestamp,
        uint256 count,
        bytes[] memory _data,
        bytes[] memory _sign,
        bytes32 root_hash
    ) private view returns (bool) {
        if (timestamp <= block.timestamp) return false;
        for (uint256 i = 0; i < count; i++) {
            address addr;
            bytes memory data = _data[i];
            assembly {
                addr := mload(add(data, 22))
            }
            if (!verify(root_hash, _sign[i], addr)) {
                return false;
            }
        }
        // abi.encodePacked(string_address, string(abi.encodePacked(addr)))
        return true;
    }

    function getRecoveredAddress(bytes32 hash, bytes memory sig)
        internal
        pure
        returns (address)
    {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (sig.length != 65) {
            return (address(0));
        }

        // Divide the signature in r, s and v variables
        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            return ecrecover(hash, v, r, s);
        }
    }
}
