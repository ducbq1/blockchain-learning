// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library Cryptography {
    function toEthereumSignedMessageHash(bytes memory s)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n",
                    toString(s.length),
                    s
                )
            );
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function recover(bytes32 hash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        bytes32 ra;
        bytes32 sa;
        uint8 va;

        if (signature.length != 65) {
            return address(0);
        }

        assembly {
            ra := mload(add(signature, 0x20))
            sa := mload(add(signature, 0x40))
            va := byte(0, mload(add(signature, 0x60)))
        }

        if (va < 27) {
            va += 27;
        }

        if (va != 27 && va != 28) {
            return address(0);
        } else {
            return ecrecover(hash, va, ra, sa);
        }
    }
}
