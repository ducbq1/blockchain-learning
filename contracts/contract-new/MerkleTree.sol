// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MerkleTree {
    bytes32[] private hashes;

    constructor() {}

    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        return processProof(proof, leaf) == root;
    }

    function processProof(bytes32[] memory proof, bytes32 leaf)
        internal
        pure
        returns (bytes32)
    {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = _efficientHash(computedHash, proofElement);
            } else {
                computedHash = _efficientHash(proofElement, computedHash);
            }
        }
        return computedHash;
    }

    function _efficientHash(bytes32 a, bytes32 b)
        private
        pure
        returns (bytes32 value)
    {
        assembly {
            mstore(0x00, a)
            mstore(0x20, b)
            value := keccak256(0x00, 0x40)
        }
    }

    function generateMerkleTree(string[] memory nodes)
        internal
        returns (bytes32[] memory)
    {
        for (uint256 i = 0; i < nodes.length; i++) {
            hashes.push(keccak256(abi.encodePacked(nodes[i])));
        }

        uint256 n = nodes.length;
        uint256 offset = 0;

        while (n != 1) {
            if (n % 2 == 0) {
                for (uint256 i = 0; i < n - 1; i += 2) {
                    hashes.push(
                        keccak256(
                            abi.encodePacked(
                                hashes[offset + i],
                                hashes[offset + i + 1]
                            )
                        )
                    );
                }
                offset += n;
                n = n / 2;
            } else {
                for (uint256 i = 0; i < n - 2; i += 2) {
                    hashes.push(
                        keccak256(
                            abi.encodePacked(
                                hashes[offset + i],
                                hashes[offset + i + 1]
                            )
                        )
                    );
                }
                hashes.push(hashes[offset + n - 1]);
                offset += n;
                n = (n + 1) / 2;
            }
        }
        return hashes;
    }

    function getRoot() public view returns (bytes32) {
        return hashes[hashes.length - 1];
    }
}
