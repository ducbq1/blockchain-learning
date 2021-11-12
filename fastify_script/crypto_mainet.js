// Hello
const { MerkleTree } = require('merkletreejs')
const { SHA256, RIPEMD160, enc } = require('crypto-js')
const keccak256 = require('keccak256')
const secp256k1 = require('secp256k1')

const mapChain = require("./chainID.json");
const privateKey = ["3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85", "ed6cbdcbf49f7ffc68fdea51c28f7254bb6d6056960f81ce346a79b1907e91d9", "9468a6f6a3ba77b5c7ac99b29cf755ea014a4500b8009d16aa1b34b5a4d097c6"];
const address = [0x8B6ff17E6a61879661296CBA916BeC85F6649062, 0x3AA528B07d997b2E78e7BFB96fdFB7CA31cE0e46, 0xFdd57658465a46125327D7e786411530C985FEa8];

const storage = [];
function storeData(chain, address) {
    storage.push(mapChain[chain].chainID.concat(address.toString(16)));
}

function compressMessage(data) {
    const leaves = data.map(x => SHA256(x));
    const tree = new MerkleTree(leaves, SHA256);
    return tree.getRoot();
}


function signMessage(message, _privateKey) {
    const privateKey = Buffer.from(_privateKey, "hex")
    return secp256k1.ecdsaSign(message, privateKey)
}

function getSign(message, _privateKey) {
    const sign = signMessage(message, _privateKey)
    return Buffer.from(sign.signature).toString("hex") + sign.recid.toString().padStart(2, "0")
}

const msg = compressMessage(["Hello", "Goodbye", "Duc", "Duyen"])
const sign = getSign(msg, privateKey[0])
console.log(msg.toString("hex"))
console.log(sign)
// console.log(sign)
// console.log(keccak256("\x19Ethereum Signed Message:\n32" + keccak256(msg)).toString("hex"))
// console.log(msg.toString('hex'))
// console.log(signMessage(msg, getPrivateKey(privateKey[1])))
// console.log(Buffer.from(signMessage(msg, getPrivateKey(privateKey[1])).signature).toString('hex'))
// console.log(secp256k1.ecdsaRecover(sign.signature, sign.recid, msg))
// console.log(getPublicKeyCompressed(privateKey[1]))
// console.log(secp256k1.ecdsaVerify(sign.signature, msg, getPublicKeyCompressed(privateKey[1])))
// console.log(secp256k1.ecdsaVerify(signMessage(msg, getPrivateKey(privateKey[1])).signature, msg, getPublicKeyCompressed(privateKey[0])));


function getPublicKeyCompressed(_privateKey) {
    const privateKey = Buffer.from(_privateKey, "hex")
    return secp256k1.publicKeyCreate(privateKey)
}

function getPublicKey(_privateKey) {
    const privateKey = Buffer.from(_privateKey, "hex")
    return secp256k1.publicKeyCreate(privateKey, false)
}

function getAddress(_privateKey, chain, type = "p2pkh") {
    if (chain == "ethereum") {
        const without_prefix = Buffer.from(getPublicKey(_privateKey)).slice(1)
        return "0x" + keccak256(without_prefix).toString('hex').slice(-40)
    }
    if (chain == "binance") {

        const prefixes = {
            p2pkh: "00",
            p2sh: "05",
            p2pkh_testnet: "6F",
            p2sh_testnet: "C4"
        }
        const hex = Buffer.from(getPublicKeyCompressed(_privateKey)).toString("hex")
        const binary = hex.split("").map(item => parseInt(item, 16).toString(2).padStart(4, 0)).join("")
        const hash160 = RIPEMD160(SHA256(binary))
        const checksum = SHA256(SHA256(hash160)).toString(enc.Hex).slice(0, 2)
        const my_string = prefixes[type] + hash160.toString(enc.Hex) + checksum
        return base58(my_string)
    }

}

// console.log(getAddress(privateKey[0], "binance"))
// console.log(getAddress(privateKey[0], "ethereum"))

function base58(address_hex) {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    let base58string = ""
    let address_int = BigInt("0x" + address_hex)
    while (address_int > 0n) {
        let digit = address_int % 58n
        base58string = alphabet[Number(digit)] + base58string
        address_int = address_int / 58n
    }
    const leading_zeros = address_hex.match(/^00+/)
    if (leading_zeros) {
        for (let step = 0; step < leading_zeros[0].length / 2; step++)
            base58string = "1" + base58string
    }
    return base58string
}

