const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const keccak256 = require('keccak256')

const leaves = ['a', 'b', 'c'].map(x => SHA256(x))
const leavesTest = ["0xfdd57658465a46125327d7e786411530c985fea8", "0xdae4f717b611a34ffb92a6704073a87dc71693fb"].map(x => keccak256(x))
const tree = new MerkleTree(leavesTest, keccak256)
const root = tree.getRoot().toString('hex')
console.log(root);
const leaf = SHA256('a')
const leafTest = keccak256("Duyen")
const proof = tree.getProof(leafTest)
console.log(tree.verify(proof, leafTest, root)) // true


const badLeaves = ['a', 'x', 'c'].map(x => SHA256(x))
const badTree = new MerkleTree(badLeaves, SHA256)
const badLeaf = SHA256('x')
const badProof = tree.getProof(badLeaf)
console.log(tree.verify(badProof, leaf, root)) // false