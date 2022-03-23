// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Cryptography.sol";

contract OwnerManager {
    string public constant NAME = "EIP712";
    string public constant VERSION = "1.0.1";
    uint256 constant MAX_OWNER_COUNT = 50;
    bytes32 constant EIP712DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    bytes32 constant TXN_TYPEHASH =
        keccak256("Transaction(address destination,uint256 value,bytes data)");

    bytes32 constant AUTHORITY_TYPEHASH =
        keccak256("Authority(string name,address wallet)");

    event Confirmation(address indexed sender, uint256 indexed nonce);
    event Revocation(address indexed sender, uint256 indexed nonce);
    event Submission(uint256 indexed nonce);
    event ExecutionSuccess(uint256 indexed nonce);
    event ExecutionFailure(uint256 indexed nonce);
    event Deposit(address indexed sender, uint256 value);
    event OwnerAddition(address indexed owner);
    event OwnerRemoval(address indexed owner);
    event ThresholdChange(uint256 threshold);

    struct EIP712Domain {
        string name;
        string version;
        uint256 chainId;
        address verifyingContract;
    }

    struct Authority {
        string name;
        address wallet;
    }

    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
        bool executed;
    }

    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    mapping(address => bool) public isOwner;
    address[] public owners;
    uint256 public threshold;
    uint256 public transactionCount;

    modifier onlyWallet() {
        require(msg.sender == address(this));
        _;
    }

    modifier ownerDoesNotExist(address owner) {
        require(!isOwner[owner]);
        _;
    }

    modifier ownerExists(address owner) {
        require(isOwner[owner]);
        _;
    }

    modifier transactionExists(uint256 nonce) {
        require(transactions[nonce].destination != address(0));
        _;
    }

    modifier confirmed(uint256 nonce, address owner) {
        require(confirmations[nonce][owner]);
        _;
    }

    modifier notConfirmed(uint256 nonce, address owner) {
        require(!confirmations[nonce][owner]);
        _;
    }

    modifier notExecuted(uint256 nonce) {
        require(!transactions[nonce].executed);
        _;
    }

    modifier notNull(address _address) {
        require(_address != address(0));
        _;
    }

    modifier validRequirement(uint256 ownerCount, uint256 _threshold) {
        require(
            ownerCount <= MAX_OWNER_COUNT &&
                _threshold <= ownerCount &&
                _threshold >= 1 &&
                ownerCount >= 1
        );
        _;
    }

    constructor(
        string memory contents,
        address[] memory _owners,
        bytes[] memory signatures,
        uint256 _threshold
    ) validRequirement(_owners.length, _threshold) {
        for (uint256 i = 0; i < _owners.length; i++) {
            require(!isOwner[_owners[i]] && _owners[i] != address(0));
            require(
                Cryptography.recover(
                    Cryptography.toEthereumSignedMessageHash(bytes(contents)),
                    signatures[i]
                ) == _owners[i]
            );
            isOwner[_owners[i]] = true;
        }
        owners = _owners;
        threshold = _threshold;
    }

    function addOwner(address owner, bytes memory signatures)
        public
        onlyWallet
        ownerDoesNotExist(owner)
        notNull(owner)
        validRequirement(owners.length + 1, threshold)
    {
        require(
            Cryptography.recover(
                keccak256(
                    abi.encodePacked(
                        "\x19\x01",
                        domainSeparator(),
                        hash(Authority({name: "ADD_OWNER", wallet: owner}))
                    )
                ),
                signatures
            ) == owner
        );
        isOwner[owner] = true;
        owners.push(owner);
        emit OwnerAddition(owner);
    }

    function removeOwner(address owner) public onlyWallet ownerExists(owner) {
        isOwner[owner] = false;
        for (uint256 i = 0; i < owners.length - 1; i++) {
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                break;
            }
        }
        owners.pop();
        if (owners.length < threshold) {
            changeThreshold(owners.length);
        }
        emit OwnerRemoval(owner);
    }

    function replaceOwner(
        address owner,
        address newOwner,
        bytes memory signatures
    ) public onlyWallet ownerExists(owner) ownerDoesNotExist(newOwner) {
        require(
            Cryptography.recover(
                keccak256(
                    abi.encodePacked(
                        "\x19\x01",
                        domainSeparator(),
                        hash(
                            Authority({name: "REPLACE_OWNER", wallet: newOwner})
                        )
                    )
                ),
                signatures
            ) == newOwner
        );
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == owner) {
                owners[i] = newOwner;
                break;
            }
        }
        isOwner[newOwner] = true;
        isOwner[owner] = false;
        emit OwnerRemoval(owner);
        emit OwnerAddition(newOwner);
    }

    function changeThreshold(uint256 _threshold)
        public
        onlyWallet
        validRequirement(owners.length, _threshold)
    {
        threshold = _threshold;
        emit ThresholdChange(_threshold);
    }

    function submitTransaction(
        address destination,
        uint256 value,
        bytes memory data
    ) public returns (uint256 nonce) {
        nonce = addTransaction(destination, value, data);
        confirmTransaction(nonce);
    }

    function implementTransaction(
        address destination,
        uint256 value,
        bytes calldata data,
        bytes[] memory signatures
    ) public returns (bool) {
        uint256 nonce = addTransaction(destination, value, data);
        bytes32 txHash = getTransactionHash(destination, value, data);
        require(signatures.length == threshold);
        for (uint256 i = 0; i < signatures.length; i++) {
            address ownerRecover = Cryptography.recover(txHash, signatures[i]);
            if (!isOwner[ownerRecover]) {
                return false;
            } else {
                confirmations[nonce][ownerRecover] = true;
                emit Confirmation(ownerRecover, nonce);
            }
        }
        executeTransaction(nonce);
        return true;
    }

    function confirmTransaction(uint256 nonce)
        public
        ownerExists(msg.sender)
        transactionExists(nonce)
        notConfirmed(nonce, msg.sender)
    {
        confirmations[nonce][msg.sender] = true;
        emit Confirmation(msg.sender, nonce);
        executeTransaction(nonce);
    }

    function revokeConfirmation(uint256 nonce)
        public
        ownerExists(msg.sender)
        confirmed(nonce, msg.sender)
        notExecuted(nonce)
    {
        confirmations[nonce][msg.sender] = false;
        emit Revocation(msg.sender, nonce);
    }

    function executeTransaction(uint256 nonce)
        public
        ownerExists(msg.sender)
        confirmed(nonce, msg.sender)
        notExecuted(nonce)
    {
        if (isConfirmed(nonce)) {
            Transaction storage txn = transactions[nonce];
            txn.executed = true;
            if (
                externalCall(
                    txn.destination,
                    txn.value,
                    txn.data.length,
                    txn.data
                )
            ) {
                emit ExecutionSuccess(nonce);
            } else {
                emit ExecutionFailure(nonce);
                txn.executed = false;
            }
        }
    }

    function externalCall(
        address destination,
        uint256 value,
        uint256 dataLength,
        bytes memory data
    ) internal returns (bool) {
        bool result;
        assembly {
            result := call(
                sub(gas(), 34710),
                destination,
                value,
                add(data, 32),
                dataLength,
                mload(0x40),
                0
            )
        }
        return result;
    }

    function isConfirmed(uint256 nonce) public view returns (bool) {
        uint256 count = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[nonce][owners[i]]) {
                count += 1;
            }
        }
        if (count == threshold) {
            return true;
        } else {
            return false;
        }
    }

    function addTransaction(
        address destination,
        uint256 value,
        bytes memory data
    ) internal notNull(destination) returns (uint256 nonce) {
        nonce = transactionCount;
        transactions[nonce] = Transaction({
            destination: destination,
            value: value,
            data: data,
            executed: false
        });
        transactionCount += 1;
        emit Submission(nonce);
    }

    function getConfirmationCount(uint256 nonce)
        public
        view
        returns (uint256 count)
    {
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[nonce][owners[i]]) {
                count += 1;
            }
        }
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getConfirmations(uint256 nonce)
        public
        view
        returns (address[] memory _confirmations)
    {
        address[] memory confirmationsTemp = new address[](owners.length);
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < owners.length; i++) {
            if (confirmations[nonce][owners[i]]) {
                confirmationsTemp[count] = owners[i];
                count += 1;
            }
        }
        _confirmations = new address[](count);
        for (i = 0; i < count; i++) {
            _confirmations[i] = confirmationsTemp[i];
        }
    }

    function getTransactionNonces(
        uint256 from,
        uint256 to,
        bool pending,
        bool executed
    ) public view returns (uint256[] memory _transactionNonces) {
        uint256[] memory transactionNoncesTemp = new uint256[](
            transactionCount
        );
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < transactionCount; i++) {
            if (
                (pending && !transactions[i].executed) ||
                (executed && transactions[i].executed)
            ) {
                transactionNoncesTemp[count] = i;
                count += 1;
            }
        }
        _transactionNonces = new uint256[](to - from);
        for (i = from; i < to; i++) {
            _transactionNonces[i - from] = transactionNoncesTemp[i];
        }
    }

    function hash(EIP712Domain memory eip712Domain)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encode(
                    EIP712DOMAIN_TYPEHASH,
                    keccak256(bytes(eip712Domain.name)),
                    keccak256(bytes(eip712Domain.version)),
                    eip712Domain.chainId,
                    eip712Domain.verifyingContract
                )
            );
    }

    function hash(Authority memory authority) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    AUTHORITY_TYPEHASH,
                    keccak256(bytes(authority.name)),
                    authority.wallet
                )
            );
    }

    function getChainId() internal view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    function domainSeparator() public view returns (bytes32) {
        return
            hash(
                EIP712Domain({
                    name: NAME,
                    version: VERSION,
                    chainId: getChainId(),
                    verifyingContract: address(this)
                })
            );
    }

    function encodeTransactionData(
        address destination,
        uint256 value,
        bytes calldata data
    ) public view returns (bytes memory) {
        bytes32 txHash = keccak256(
            abi.encode(TXN_TYPEHASH, destination, value, keccak256(data))
        );
        return
            abi.encodePacked(
                bytes1(0x19),
                bytes1(0x01),
                domainSeparator(),
                txHash
            );
    }

    function getTransactionHash(
        address destination,
        uint256 value,
        bytes calldata data
    ) public view returns (bytes32) {
        return keccak256(encodeTransactionData(destination, value, data));
    }
}
