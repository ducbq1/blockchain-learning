pragma solidity >=0.4.22 <0.9.0;
import "./ERC20.sol";

contract IdentificationManager is ERC20 {
    uint8 constant ACTIVE = 1;
    uint8 constant REJECTED = 0;

    struct Account {
        address _address;
        string _type;
        uint8 _status;
    }

    event TransactionComplete(address indexed from, uint256 key);
    event VerifyComplete(address indexed from, address indexed to);

    mapping(uint256 => Account[]) private _accounts;
    mapping(uint8 => string) public infuralNetworks;

    address private _addressContract;

    constructor() ERC20("Identify Token", "IT", 10E3) {
        _addressContract = address(this);
        infuralNetworks[0x01] = "mainnet";
        infuralNetworks[0x03] = "ropsten";
        infuralNetworks[0x04] = "rinkeby";
        infuralNetworks[0x05] = "goerli";
        infuralNetworks[0x2a] = "kovan";
    }

    function addressContract() public view returns (address) {
        return _addressContract;
    }

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

    function randomize() private view returns (uint256) {
        uint256 randomHash = uint256(
            keccak256(abi.encodePacked(block.difficulty, block.timestamp))
        );
        return randomHash % 1000;
    }

    function verify(
        bytes32 message,
        bytes memory sig,
        address _addr
    ) public returns (bool) {
        if (getRecoveredAddress(sig, message) == _addr) {
            emit VerifyComplete(_addressContract, _addr);
            return true;
        }
        return false;
    }

    function insertPayloadVerify(
        uint64 timestamp,
        bytes[] memory _data,
        bytes[] memory _signature,
        bytes32 message,
        uint256 key,
        address[] memory _addressOld,
        bytes[] memory _signatureOld
    ) public returns (bool) {
        if (timestamp > block.timestamp) return false;
        if (_addressOld.length != _signatureOld.length) return false;
        if (_accounts[key].length != _addressOld.length) return false;

        uint256 count = _data.length;
        uint256 countExist = _addressOld.length;

        for (uint256 i = 0; i < countExist; i++) {
            if (!verify(message, _signatureOld[i], _addressOld[i])) {
                return false;
            }
        }

        for (uint256 i = 0; i < countExist; i++) {
            // if (_accounts[key][i]._address == )
        }

        for (uint256 i = 0; i < count; i++) {
            address addr;
            bytes memory data = _data[i];
            assembly {
                addr := mload(add(data, 21))
            }
            if (!verify(message, _signature[i], addr)) {
                return false;
            }
        }

        for (uint256 i = 0; i < count; i++) {
            address addr;
            bytes memory data = _data[i];
            uint8 type_account = uint8(bytes1(data));

            assembly {
                addr := mload(add(data, 21))
            }

            uint256 existCount = _accounts[key].length;
            bool exist = false;

            for (uint256 j = 0; j < existCount; j++) {
                if (_accounts[key][j]._address == addr) {
                    exist = true;
                    break;
                }
            }

            if (exist) {
                continue;
            } else {
                Account memory temp;
                temp._address = addr;
                temp._type = infuralNetworks[type_account];
                temp._status = ACTIVE;
                _accounts[key].push(temp);
            }
        }

        emit TransactionComplete(_addressContract, key);
        return true;
    }

    function insertPayload(
        uint64 timestamp,
        bytes[] memory _data,
        bytes[] memory _signature,
        bytes32 message,
        uint256 key
    ) public returns (bool) {
        if (timestamp > block.timestamp) return false;
        uint256 count = _data.length;

        for (uint256 i = 0; i < count; i++) {
            address addr;
            bytes memory data = _data[i];
            assembly {
                addr := mload(add(data, 21))
            }
            if (!verify(message, _signature[i], addr)) {
                return false;
            }
        }

        for (uint256 i = 0; i < count; i++) {
            address addr;
            bytes memory data = _data[i];
            uint8 type_account = uint8(bytes1(data));

            assembly {
                addr := mload(add(data, 21))
            }

            uint256 existCount = _accounts[key].length;
            bool exist = false;

            for (uint256 j = 0; j < existCount; j++) {
                if (_accounts[key][j]._address == addr) {
                    exist = true;
                    break;
                }
            }

            if (exist) {
                continue;
            } else {
                Account memory temp;
                temp._address = addr;
                temp._type = infuralNetworks[type_account];
                temp._status = ACTIVE;
                _accounts[key].push(temp);
            }
        }

        emit TransactionComplete(_addressContract, key);
        return true;
    }

    function verifyPayload(
        uint64 timestamp,
        bytes[] memory _data,
        bytes[] memory _signature,
        bytes32 message
    ) public returns (bool) {
        if (timestamp > block.timestamp) return false;
        uint256 key = randomize();
        while (_accounts[key].length > 0) {
            key = randomize();
        }
        uint256 count = _data.length;

        for (uint256 i = 0; i < count; i++) {
            address addr;
            bytes memory data = _data[i];

            assembly {
                addr := mload(add(data, 21))
            }

            if (!verify(message, _signature[i], addr)) {
                return false;
            }
        }

        for (uint256 i = 0; i < count; i++) {
            address addr;
            bytes memory data = _data[i];
            uint8 type_account = uint8(bytes1(data));

            assembly {
                addr := mload(add(data, 21))
            }

            Account memory temp;
            temp._address = addr;
            temp._type = infuralNetworks[type_account];
            temp._status = ACTIVE;
            _accounts[key].push(temp);
        }

        emit TransactionComplete(_addressContract, key);
        return true;
    }

    function rejectAddress(
        address _address,
        bytes memory _signature,
        bytes32 message,
        uint256 key
    ) public virtual returns (bool) {
        if (!verify(message, _signature, _address)) return false;
        uint256 count = _accounts[key].length;
        for (uint256 i = 0; i < count; i++) {
            if (_accounts[key][i]._address == _address) {
                _accounts[key][i]._status = REJECTED;
                return true;
            }
        }
        return false;
    }

    function recoverAddress(
        address _address,
        bytes memory _signature,
        bytes32 message,
        uint256 key
    ) public virtual returns (bool) {
        if (!verify(message, _signature, _address)) return false;
        uint256 count = _accounts[key].length;
        for (uint256 i = 0; i < count; i++) {
            if (_accounts[key][i]._address == _address) {
                _accounts[key][i]._status = ACTIVE;
                return true;
            }
        }
        return false;
    }

    function getInfo(uint256 key) public view returns (Account[] memory) {
        return _accounts[key];
    }

    function removeGroup(
        address _address,
        bytes memory _signature,
        bytes32 message,
        uint256 key
    ) public virtual returns (bool) {
        if (!verify(message, _signature, _address)) return false;
        uint256 count = _accounts[key].length;
        for (uint256 i = 0; i < count; i++) {
            if (_accounts[key][i]._address == _address) {
                delete _accounts[key];
                return true;
            }
        }
        return false;
    }

    function sumBalance(uint256 key) public view returns (uint256) {
        uint256 sum = 0;
        uint256 count = _accounts[key].length;
        for (uint256 i = 0; i < count; i++) {
            if (_accounts[key][i]._status == ACTIVE) {
                sum += balanceOf(_accounts[key][i]._address);
            }
        }
        return sum;
    }
}
