const ERC20 = artifacts.require("ERC20");

module.exports = async function (deployer) {
    await deployer.deploy(ERC20, "ERC20", "@@");
    // const instance = await Sample.deployed();
}