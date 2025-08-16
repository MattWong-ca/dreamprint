const hre = require("hardhat");

async function main() {
  console.log("Deploying PYUSDPayment contract...");

  // PYUSD Sepolia address: 0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9
  // PYUSD Mainnet address: 0x6c3ea9036406852006290770BEdFcAbA0e23A0e8

  const PYUSD_ADDRESS = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
  
  // Deploy the contract
  const PYUSDPayment = await hre.ethers.getContractFactory("PYUSDPayment");
  const pyusdPayment = await PYUSDPayment.deploy(PYUSD_ADDRESS);

  await pyusdPayment.waitForDeployment();
  const contractAddress = await pyusdPayment.getAddress();

  console.log("PYUSDPayment deployed to:", contractAddress);
  console.log("Owner address:", "0xB68918211aD90462FbCf75b77a30bF76515422CE");
  console.log("PYUSD token address:", PYUSD_ADDRESS);
  
  // Verify the deployment
  console.log("\nDeployment successful! 🎉");
  console.log("Contract address:", contractAddress);
  console.log("Network:", hre.network.name);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
