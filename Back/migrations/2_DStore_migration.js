const DStore = artifacts.require("DStore");

module.exports = function (deployer) {
  deployer.deploy(DStore,10,1001);
};
