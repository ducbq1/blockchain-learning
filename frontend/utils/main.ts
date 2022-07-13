import {
  resolve_gen,
  base58_gen,
  compress_gen,
  sign_gen,
  address_gen,
  public_gen,
  payload_gen,
  resolve_gen_did,
} from "./crypto_mainet";

/*

// did:network:address
// dùng để phân tích mạng thành object gồm id và địa chỉ
console.log(resolve_gen("did:mainnet:3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85"))

// did:base58:message
// dùng để mã hóa một thông điệp sang base58
console.log(base58_gen("did:base58:Hello"))

// did:compress:message1-message2-message3
// dùng để nén các thông tin lại bằng merkle tree
console.log(compress_gen("did:compress:Hello-ABC-CD#ED-ILM"))

// did:message:private
// dùng để ký mã hóa lên một bản ghi, thông điệp bẳng khóa riêng
console.log(sign_gen("did:HelloWorl:3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85"))

// did:network:private
// dùng để tạo địa chỉ từ khóa riêng với hai mạng là ethereum hoặc binance
console.log(address_gen("did:ethereum:3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85"))
console.log(address_gen("did:binance:3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85"))

// did:uncompressed:private
// did:compressed:private
// dùng để tạo khóa công khai tử khóa chính
console.log(public_gen("did:uncompressed:3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85"))
console.log(public_gen("did:compressed:3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85"))

*/

// did:resolve:did1.did2.did3-sign1.sign2.sign3
// tạo payload đưa tới contract theo mẫu

const privateKey = [
  "3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85",
  "ed6cbdcbf49f7ffc68fdea51c28f7254bb6d6056960f81ce346a79b1907e91d9",
  "9468a6f6a3ba77b5c7ac99b29cf755ea014a4500b8009d16aa1b34b5a4d097c6",
];
const address = [
  "0x8B6ff17E6a61879661296CBA916BeC85F6649062",
  "0x3AA528B07d997b2E78e7BFB96fdFB7CA31cE0e46",
  "0xFdd57658465a46125327D7e786411530C985FEa8",
];

const did1 = resolve_gen_did(`did:mainnet:${address[0]}`);
const did2 = resolve_gen_did(`did:mainnet:${address[1]}`);
const did3 = resolve_gen_did(`did:mainnet:${address[2]}`);

console.log(did1, did2, did3);

// giả sử có 3 địa chỉ, nén lại thành dữ liệu root_hash
const root_hash = compress_gen(`did:compress:${did1}-${did2}-${did3}`);
console.log(root_hash);

// dùng metamask ký (không cần private key cung cấp mà ngầm định)
// ở đây ký bằng private để test
const sign1 = sign_gen(`did:${root_hash}:${privateKey[0]}`);
const sign2 = sign_gen(`did:${root_hash}:${privateKey[1]}`);
const sign3 = sign_gen(`did:${root_hash}:${privateKey[2]}`);
console.log(sign1);

console.log(
  payload_gen(
    `did:resolve:${did1}.${did2}.${did3}-${sign1}.${sign2}.${sign3}-${root_hash}`
  )
);
