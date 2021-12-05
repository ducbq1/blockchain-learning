const fs = require('fs')
const solc = require('solc')

const CONTRACT_NAME = 'ChainIdentification';

(async function () {
    const rawCodeFs = fs.readFileSync(`${__dirname}/${CONTRACT_NAME}.sol`);
    const rawCode = rawCodeFs.toString();

    const input = {
        language: 'Solidity',
        sources: {
            [`${CONTRACT_NAME}`]: {
                content: rawCode
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }

    const contractBytecode = JSON.parse(solc.compile(JSON.stringify(input))).contracts[`${CONTRACT_NAME}`][`${CONTRACT_NAME}`].evm.bytecode.object;
    console.log('contractBytecode:', contractBytecode);
})();