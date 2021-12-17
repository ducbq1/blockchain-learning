// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "./ERC20.sol";

contract ChainIdentification is ERC20 {
    // mỗi một tài khoản gồm thông tin địa chỉ, tình trạng đã ký hay chưa, và thông tin id để truy vấn mapping
    struct Account {
        string _name;
        string _type;
        address _address;
        uint8 _status;
        uint256 _id;
    }

    // sự kiện xác thực chuỗi chéo thành công
    event TransactionComplete(address indexed from, bool isTrue);
    event VerifyComplete(address indexed from, address indexed to);

    // khai báo mapping các chain của các mạng thông dụng
    mapping(uint8 => string) public infuralNetworks;

    // khai báo địa chỉ của hợp đồng
    address private _address;
    // khai báo biến mapping giữa một id ngẫu nhiên với mảng các địa chỉ được định danh cùng nhau
    mapping(uint256 => Account[]) private account;

    constructor() ERC20("Identity Token", "IT", 10E26) {
        _address = address(this);
        infuralNetworks[0x01] = "mainnet";
        infuralNetworks[0x03] = "ropsten";
        infuralNetworks[0x04] = "rinkeby";
        infuralNetworks[0x05] = "goerli";
        infuralNetworks[0x2a] = "kovan";
    }

    // xác thực thông tin thông qua chữ ký và địa chỉ
    function verify(
        bytes32 message,
        bytes memory sig,
        address _addr
    ) public returns (bool) {
        if (getRecoveredAddress(sig, message) == _addr) {
            emit VerifyComplete(_address, _addr);
            return true;
        }
        return false;
    }

    // xác thực thông tin của gói thông tin
    function verifyPayload(
        // thời gian gói tin bắt đầu được gửi đi
        uint64 timestamp,
        uint256 count,
        // _data bao gồm thông tin chainId và địa chỉ của người dùng
        bytes[] memory _data,
        // _sign bao gồm chữ ký của root_hash ứng với từng khóa riêng tương ứng
        bytes[] memory _sign,
        // root_hash là dữ liệu đã bị mã hóa
        bytes32 root_hash
    ) public returns (bool) {
        // nếu thời gian gửi gói tin đi lại lớn hơn thời gian của block hình thành ở contract thì không hợp lệ
        // if (timestamp >= block.timestamp) return false;
        if (timestamp < 0) return false;

        // khởi tạo một giá trị ngẫu nhiên làm id cho nhóm account cần xác thực
        uint256 random = randomize();
        for (uint256 i = 0; i < count; i++) {
            address addr;
            bytes memory data = _data[i];
            uint8 type_account = uint8(bytes1(data));

            assembly {
                addr := mload(add(data, 21))
            }
            // khởi tạo thông tin account
            Account memory temp;
            // gồm thông tin đỉa chỉ
            temp._address = addr;
            // thông tin của mạng tham gia
            temp._type = infuralNetworks[type_account];
            // thông tin id của nhóm account chung người dùng
            temp._id = random;
            // tình trạng xác thực trong nhóm account
            temp._status = 0;

            account[random].push(temp);
        }
        for (uint256 i = 0; i < count; i++) {
            address addr;
            bytes memory data = _data[i];
            assembly {
                addr := mload(add(data, 21))
            }
            if (!verify(root_hash, _sign[i], addr)) {
                return false;
            }
        }
        for (uint256 i = 0; i < count; i++) {
            account[random][i]._status = 1;
        }

        emit TransactionComplete(_address, true);

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

    // hàm lấy ra một giá trị ngẫu nhiên
    function randomize() private view returns (uint256) {
        uint256 randomHash = uint256(
            keccak256(abi.encodePacked(block.difficulty, block.timestamp))
        );
        return randomHash % 1000;
    }
}
