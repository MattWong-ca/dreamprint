const hre = require("hardhat");

async function main() {
  console.log("Deploying DreamprintNFT contract...");

  // Your web app's base URL for metadata API
  // This should match your deployed web app URL
  const BASE_METADATA_URI = "https://dreamprint.app";
  
  console.log("Base Metadata URI:", BASE_METADATA_URI);
  
  // Deploy the contract
  const DreamprintNFT = await hre.ethers.getContractFactory("DreamprintNFT");
  const dreamprintNFT = await DreamprintNFT.deploy(BASE_METADATA_URI);

  await dreamprintNFT.waitForDeployment();
  const contractAddress = await dreamprintNFT.getAddress();

  console.log("\n🎨 DreamprintNFT deployed to:", contractAddress);
  console.log("👤 Owner address:", "0xB68918211aD90462FbCf75b77a30bF76515422CE");
  console.log("🔗 Base metadata URI:", BASE_METADATA_URI);
  console.log("💎 Mint cost: FREE (only gas fees)");
  
  // Test contract deployment by checking initial values
  console.log("\n🔍 Verifying deployment...");
  const nextTokenId = await dreamprintNFT.getNextTokenId();
  const totalSupply = await dreamprintNFT.totalSupply();
  const baseURI = await dreamprintNFT.getBaseMetadataURI();
  
  console.log("✅ Next token ID:", nextTokenId.toString());
  console.log("✅ Total supply:", totalSupply.toString());
  console.log("✅ Base metadata URI:", baseURI);
  
  console.log("\n🎉 Deployment successful!");
  console.log("📍 Network:", hre.network.name);
  console.log("📝 Contract address:", contractAddress);
  
  console.log("\n📋 Next steps:");
  console.log("1. Update your web app with the new contract address");
  console.log("2. Update the ABI in your web app");
  console.log("3. Test free minting functionality");
  console.log("4. Verify contract on Etherscan (optional)");
  console.log("5. Note: Minting is now FREE - users only pay gas fees!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
