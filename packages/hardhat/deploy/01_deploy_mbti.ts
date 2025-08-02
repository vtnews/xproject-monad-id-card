import { ethers } from "hardhat";

async function main() {
  console.log("🚀 开始部署 MBTI 测试合约...");

  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("📝 部署者地址:", deployer.address);

  // 获取账户余额
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 部署者余额:", ethers.formatEther(balance), "ETH");

  // 部署 MBTI 测试合约
  const MBTITest = await ethers.getContractFactory("MBTITest");
  const mbtiTest = await MBTITest.deploy();
  await mbtiTest.waitForDeployment();

  const contractAddress = await mbtiTest.getAddress();
  console.log("✅ MBTI 测试合约已部署到:", contractAddress);

  // 验证合约部署
  console.log("🔍 验证合约部署...");
  const totalTests = await mbtiTest.getTotalTests();
  console.log("📊 初始测试总数:", totalTests.toString());

  console.log("🎉 MBTI 测试合约部署完成!");
  console.log("📋 合约地址:", contractAddress);
  console.log("👤 合约所有者:", await mbtiTest.owner());

  // 输出部署信息
  console.log("\n📝 部署信息:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("合约名称: MBTITest");
  console.log("合约地址:", contractAddress);
  console.log("部署者:", deployer.address);
  console.log("网络:", (await ethers.provider.getNetwork()).name);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// 执行部署
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  });
