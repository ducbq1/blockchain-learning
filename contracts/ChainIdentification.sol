// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "./ERC20.sol";
import "./ClaimVerifier.sol";
import "./ClaimHolder.sol";
import "./Identity.sol";
import "./KeyHolder.sol";

contract ChainIdentification is ERC20 {
    address private _address;

    constructor() ERC20("CrossChainIdentification", ">_<", 1000) {
        _address = address(this);
    }

    // xác thực thông tin thông qua chữ ký và địa chỉ
    function verify(
        bytes32 message,
        bytes memory sig,
        address _addr
    ) public pure returns (bool) {
        return getRecoveredAddress(sig, message) == _addr;
    }

    // xác thực thông tin của gói thông tin
    function verifyPayload(
        uint64 timestamp,
        uint256 count,
        bytes[] memory _data,
        bytes[] memory _sign,
        bytes32 root_hash
    ) public view returns (bool) {
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
        return true;
    }

    // lấy thông tin của địa chỉ ứng với chữ ký và dữ liệu đã ký
    function getRecoveredAddress(bytes memory sig, bytes32 dataHash)
        public
        pure
        returns (address addr)
    {
        bytes32 ra;
        bytes32 sa;
        uint8 va;

        // Check the signature length
        if (sig.length != 65) {
            return (address(0));
        }

        // Divide the signature in r, s and v variables
        assembly {
            ra := mload(add(sig, 32))
            sa := mload(add(sig, 64))
            va := byte(0, mload(add(sig, 96)))
        }

        if (va < 27) {
            va += 27;
        }

        if (va != 27 && va != 28) {
            return (address(0));
        } else {
            return ecrecover(dataHash, va, ra, sa);
        }
    }
}
