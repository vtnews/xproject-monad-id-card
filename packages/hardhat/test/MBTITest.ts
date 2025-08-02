import { expect } from "chai";
import { ethers } from "hardhat";

describe("MBTITest", function () {
  let mbtiTest: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const MBTITest = await ethers.getContractFactory("MBTITest");
    mbtiTest = await MBTITest.deploy();
    await mbtiTest.deployed();
  });

  describe("基本功能测试", function () {
    it("应该正确部署合约", async function () {
      expect(mbtiTest.address).to.not.equal(ethers.ZeroAddress);
      expect(await mbtiTest.owner()).to.equal(owner.address);
    });

    it("应该能够提交测试结果", async function () {
      const mbtiType = "INTJ";
      const answers = [0, 1, 0, 1, 0, 1, 0, 1];

      await mbtiTest.connect(user1).submitTestResult(mbtiType, answers);

      expect(await mbtiTest.getTotalTests()).to.equal(1);
      expect(await mbtiTest.hasUserTested(user1.address)).to.equal(true);
    });

    it("应该能够获取用户结果", async function () {
      const mbtiType = "ENFP";
      const answers = [1, 0, 1, 0, 1, 0, 1, 0];

      await mbtiTest.connect(user1).submitTestResult(mbtiType, answers);

      const results = await mbtiTest.getUserResults(user1.address);
      expect(results.length).to.equal(1);
      expect(results[0].mbtiType).to.equal("ENFP");
    });

    it("应该支持多次测试", async function () {
      // 第一次测试
      await mbtiTest.connect(user1).submitTestResult("INTJ", [0, 1, 0, 1, 0, 1, 0, 1]);

      // 第二次测试
      await mbtiTest.connect(user1).submitTestResult("ENFP", [1, 0, 1, 0, 1, 0, 1, 0]);

      expect(await mbtiTest.getUserTestCount(user1.address)).to.equal(2);
      expect(await mbtiTest.getTotalTests()).to.equal(2);
    });
  });

  describe("错误处理", function () {
    it("应该拒绝无效的MBTI类型", async function () {
      const invalidMbtiType = "ABC";
      const answers = [0, 1, 0, 1, 0, 1, 0, 1];

      await expect(mbtiTest.connect(user1).submitTestResult(invalidMbtiType, answers)).to.be.revertedWith(
        "MBTI type must be 4 characters",
      );
    });

    it("应该拒绝错误数量的答案", async function () {
      const mbtiType = "INTJ";
      const invalidAnswers = [0, 1, 0, 1, 0, 1]; // 只有6个答案

      await expect(mbtiTest.connect(user1).submitTestResult(mbtiType, invalidAnswers)).to.be.revertedWith(
        "Must have exactly 8 answers",
      );
    });
  });

  describe("统计功能", function () {
    it("应该正确统计测试数量", async function () {
      await mbtiTest.connect(user1).submitTestResult("INTJ", [0, 1, 0, 1, 0, 1, 0, 1]);
      await mbtiTest.connect(user2).submitTestResult("ENFP", [1, 0, 1, 0, 1, 0, 1, 0]);

      expect(await mbtiTest.getTotalTests()).to.equal(2);
      expect(await mbtiTest.getUserTestCount(user1.address)).to.equal(1);
      expect(await mbtiTest.getUserTestCount(user2.address)).to.equal(1);
    });
  });
});
