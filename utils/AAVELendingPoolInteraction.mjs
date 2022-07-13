import Web3 from "web3";
import { abiAAVE } from "../frontend/contracts/AAVELendingPool";


const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const initContract = (addr) => new web3.eth.Contract(abiAAVE, addr)
const myContract = initContract("0x9E5C7835E4b13368fd628196C4f1c6cEc89673Fa");

console.log(myContract)