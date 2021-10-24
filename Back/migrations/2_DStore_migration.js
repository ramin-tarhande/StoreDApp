const DStore = artifacts.require("DStore");

module.exports = function (deployer) {
  deployer.deploy(DStore,10,2,2,1001);
};
