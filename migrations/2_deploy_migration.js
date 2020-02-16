const TransparencyGoverment = artifacts.require("TransparentGoverment");

module.exports = function(deployer) {
  deployer.deploy(TransparencyGoverment);
};
