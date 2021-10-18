const DStore = artifacts.require("DStore");

module.exports = function (deployer) {
  deployer.deploy(DStore,1001);
};
