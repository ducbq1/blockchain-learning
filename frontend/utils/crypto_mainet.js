// Hello
const { MerkleTree } = require('merkletreejs')
const { SHA256, RIPEMD160, enc } = require('crypto-js')
const keccak256 = require('keccak256')
const secp256k1 = require('secp256k1')
const mapChain = require("./chain_info");

module.exports = {
    // did:network:address, lấy thông tin của chainId của mạng và địa chỉ
    resolve_gen: (input) => {
        const input_arr = input.split(":");
        return ({
            network: mapChain[input_arr[1]].chainID,
            address: input_arr[2]
        });
    },
    // did:network:address
    resolve_gen_did: (input) => {
        let array_did = input.split(":");
        return '0x' + mapChain[array_did[1]].chainID + array_did[2].slice(2);
    },
    // did:base58:message, mã hóa thông tin của thông điệp
    base58_gen: (input) => base58(input.split(":")[2]),
    // did:compress:message-message-message, nén và mã hóa nhiều dữ liệu bằng merkle tree
    compress_gen: (input) => compressMessage(input.split(":")[2].split("-")).toString("hex"),
    // compress_gen: (input) => {
    //     console.log(input.split(":")[2].split("-"))
    //     return "0x" + compressMessage(input.split(":")[2].split("-")).toString("hex")
    // },
    // did:message:private, ký mã hóa lên một bản ghi, thông điệp
    sign_gen: (input) => {
        const input_arr = input.split(":");
        return getSign(input_arr[1], input_arr[2]);
    },
    // did:network:private, tạo address từ private key
    address_gen: (input) => {
        const input_arr = input.split(":");
        return getAddress(input_arr[2], input_arr[1]);
    },
    // did:uncompressed:private hoặc did:compressed:private, tạo public key từ private key
    public_gen: (input) => {
        const input_arr = input.split(":");
        if (input_arr[1] == "uncompressed") {
            return Buffer.from(getPublicKey(input_arr[2])).toString("hex");
        } else {
            return Buffer.from(getPublicKeyCompressed(input_arr[2])).toString("hex");
        }
    },
    // did:resolve:did.did.did-sign.sign.sign
    payload_gen: (input) => {
        const input_criteria = input.slice(12);
        const input_arr = input_criteria.split("-");
        const array_did = input_arr[0].split(".");
        const array_sign = input_arr[1].split(".");

        return ({
            timestamp: Date.now(),
            count: array_did.length,
            data: array_did,
            signature: array_sign,
            // message: "0x" + compressMessage(array_did).toString("hex")
            message: "0x" + input_arr[2]
        });
    }

}

/*************************************************************/
const privateKey = ["3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85", "ed6cbdcbf49f7ffc68fdea51c28f7254bb6d6056960f81ce346a79b1907e91d9", "9468a6f6a3ba77b5c7ac99b29cf755ea014a4500b8009d16aa1b34b5a4d097c6"];
const address = [0x8B6ff17E6a61879661296CBA916BeC85F6649062, 0x3AA528B07d997b2E78e7BFB96fdFB7CA31cE0e46, 0xFdd57658465a46125327D7e786411530C985FEa8];

// const msg = compressMessage(["Hello", "Goodbye", "Duc", "Duyen"])
// const msg = compressMessage(['0xedfbb352a9180afeb44a5dc89c55cbcd4053b731188df9abb0e75a003cfae6d4']);
const sign = getSign("afa3cc1d1a7621d2624ea3ebbd530d87556b29c39402cdb1ce8874aaeeba6142", privateKey[2])
// console.log('ROOT', "0x" + msg.toString("hex"))
console.log('SIGN', sign)
// console.log('SIGN', "0x0739da1c678dfbd9fe7452382082567c18c7f448e2702a7177b3223415d145ab57fa11471dc7d8cf1d31c6c7b7f1fb6b02b471565392d5cb9dd2df0ade989cc41b");
console.log("BSC", getAddress(privateKey[0], "binance"))
console.log("ETH", getAddress(privateKey[0], "ethereum"))
/*************************************************************/

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

function resolvePayload({
    data: array_did,
    signature: array_signature
}) {
    return ({
        timestamp: Date.now(),
        count: array_did.length,
        data: array_did,
        signature: array_signature,
        message: "0x" + compressMessage(array_did).toString("hex")
    });
}

function compressMessage(data) {
    const leaves = data.map(x => SHA256(x));
    const tree = new MerkleTree(leaves, SHA256);
    return tree.getRoot();
}

function signMessage(message, _privateKey) {
    const privateKey = Buffer.from(_privateKey, "hex");
    const msg = Buffer.from(message, "hex");
    return secp256k1.ecdsaSign(msg, privateKey);
}

function getSign(message, _privateKey) {
    const sign = signMessage(message, _privateKey)
    return "0x" + Buffer.from(sign.signature).toString("hex") + sign.recid.toString().padStart(2, "0")
}

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
        return '0x' + base58(my_string)
    }

}


