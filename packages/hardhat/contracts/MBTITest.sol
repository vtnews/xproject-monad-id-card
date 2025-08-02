// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MBTITest
 * @dev MBTI性格测试智能合约
 * 用户可以提交MBTI测试结果，查询历史记录和统计信息
 */
contract MBTITest is Ownable {
    
    constructor() Ownable(msg.sender) {}
    
    // 测试结果结构
    struct TestResult {
        address user;
        string mbtiType;
        uint256 timestamp;
        uint8[] answers;
    }
    
    // 用户地址 => 测试结果数组
    mapping(address => TestResult[]) public userResults;
    
    // 所有测试结果
    TestResult[] public allResults;
    
    // 事件
    event TestResultSubmitted(
        address indexed user,
        string mbtiType,
        uint256 timestamp,
        uint8[] answers
    );
    
    /**
     * @dev 提交测试结果
     * @param mbtiType MBTI类型 (如 "INTJ", "ENFP" 等)
     * @param answers 8个问题的答案数组
     */
    function submitTestResult(string memory mbtiType, uint8[] memory answers) public {
        require(bytes(mbtiType).length == 4, "MBTI type must be 4 characters");
        require(answers.length == 8, "Must have exactly 8 answers");
        
        // 验证答案值 (0或1)
        for (uint i = 0; i < answers.length; i++) {
            require(answers[i] <= 1, "Answer must be 0 or 1");
        }
        
        TestResult memory newResult = TestResult({
            user: msg.sender,
            mbtiType: mbtiType,
            timestamp: block.timestamp,
            answers: answers
        });
        
        userResults[msg.sender].push(newResult);
        allResults.push(newResult);
        
        emit TestResultSubmitted(msg.sender, mbtiType, block.timestamp, answers);
    }
    
    /**
     * @dev 获取用户的所有测试结果
     * @param user 用户地址
     * @return 用户的测试结果数组
     */
    function getUserResults(address user) public view returns (TestResult[] memory) {
        return userResults[user];
    }
    
    /**
     * @dev 获取用户最新的测试结果
     * @param user 用户地址
     * @return 最新的测试结果
     */
    function getUserLatestResult(address user) public view returns (TestResult memory) {
        require(userResults[user].length > 0, "No results found for user");
        return userResults[user][userResults[user].length - 1];
    }
    
    /**
     * @dev 获取所有测试结果
     * @return 所有测试结果数组
     */
    function getAllResults() public view returns (TestResult[] memory) {
        return allResults;
    }
    
    /**
     * @dev 获取测试统计信息
     * @return 总测试次数
     */
    function getTotalTests() public view returns (uint256) {
        return allResults.length;
    }
    
    /**
     * @dev 获取用户测试次数
     * @param user 用户地址
     * @return 用户测试次数
     */
    function getUserTestCount(address user) public view returns (uint256) {
        return userResults[user].length;
    }
    
    /**
     * @dev 检查用户是否已进行过测试
     * @param user 用户地址
     * @return 是否已测试
     */
    function hasUserTested(address user) public view returns (bool) {
        return userResults[user].length > 0;
    }
} 