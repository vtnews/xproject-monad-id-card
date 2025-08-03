"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

// MBTI测试题目
const questions = [
  {
    id: 1,
    dimension: "E/I",
    question: "你更喜欢独处还是社交？",
    options: [
      { value: "E", text: "社交 - 我喜欢与他人互动，从社交中获得能量" },
      { value: "I", text: "独处 - 我更喜欢安静的环境，从独处中恢复能量" },
    ],
  },
  {
    id: 2,
    dimension: "E/I",
    question: "在团队中你更倾向于？",
    options: [
      { value: "E", text: "积极参与讨论，分享想法" },
      { value: "I", text: "先观察和思考，然后发言" },
    ],
  },
  {
    id: 3,
    dimension: "S/N",
    question: "你更关注细节还是整体？",
    options: [
      { value: "S", text: "细节 - 我注重具体的事实和细节" },
      { value: "N", text: "整体 - 我更关注概念和可能性" },
    ],
  },
  {
    id: 4,
    dimension: "S/N",
    question: "解决问题时你更依赖？",
    options: [
      { value: "S", text: "过去的经验和具体方法" },
      { value: "N", text: "直觉和创新思维" },
    ],
  },
  {
    id: 5,
    dimension: "T/F",
    question: "做决定时你更看重？",
    options: [
      { value: "T", text: "逻辑和客观分析" },
      { value: "F", text: "价值观和人际关系" },
    ],
  },
  {
    id: 6,
    dimension: "T/F",
    question: "处理冲突时你更倾向于？",
    options: [
      { value: "T", text: "直接面对问题，寻求解决方案" },
      { value: "F", text: "考虑他人感受，寻求和谐" },
    ],
  },
  {
    id: 7,
    dimension: "J/P",
    question: "你更喜欢计划还是随机？",
    options: [
      { value: "J", text: "计划 - 我喜欢制定计划并按计划执行" },
      { value: "P", text: "随机 - 我喜欢保持灵活性，随机应变" },
    ],
  },
  {
    id: 8,
    dimension: "J/P",
    question: "面对新项目你更倾向于？",
    options: [
      { value: "J", text: "制定详细的计划和时间表" },
      { value: "P", text: "先开始行动，边做边调整" },
    ],
  },
];

const TestPage = () => {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some(answer => answer === "")) {
      alert("请完成所有题目后再提交");
      return;
    }

    setIsSubmitting(true);

    // 计算MBTI类型
    const mbtiType = calculateMBTI(answers);

    // 跳转到结果页面
    router.push(`/result?type=${mbtiType}&answers=${answers.join(",")}`);
  };

  const calculateMBTI = (answers: string[]): string => {
    let eCount = 0,
      iCount = 0;
    let sCount = 0,
      nCount = 0;
    let tCount = 0,
      fCount = 0;
    let jCount = 0,
      pCount = 0;

    answers.forEach((answer, index) => {
      if (index < 2) {
        // E/I维度
        if (answer === "E") eCount++;
        else if (answer === "I") iCount++;
      } else if (index < 4) {
        // S/N维度
        if (answer === "S") sCount++;
        else if (answer === "N") nCount++;
      } else if (index < 6) {
        // T/F维度
        if (answer === "T") tCount++;
        else if (answer === "F") fCount++;
      } else {
        // J/P维度
        if (answer === "J") jCount++;
        else if (answer === "P") pCount++;
      }
    });

    const first = eCount >= iCount ? "E" : "I";
    const second = sCount >= nCount ? "S" : "N";
    const third = tCount >= fCount ? "T" : "F";
    const fourth = jCount >= pCount ? "J" : "P";

    return first + second + third + fourth;
  };

  if (!connectedAddress) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-base-content">请先连接钱包</h2>
          <p className="text-base-content/70">连接钱包后才能开始MBTI测试</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-base-content">MBTI性格测试</h1>
          <p className="text-base-content/70">发现你的真实性格类型</p>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-base-content">进度</span>
            <span className="text-sm text-base-content/70">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 题目卡片 */}
        <div className="bg-base-100 rounded-lg p-6 shadow-lg border border-base-300">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-primary">维度: {currentQ.dimension}</span>
              <span className="text-sm text-base-content/60">题目 {currentQ.id}</span>
            </div>
            <h3 className="text-xl font-semibold mb-6 text-base-content">{currentQ.question}</h3>
          </div>

          {/* 选项 */}
          <div className="space-y-4 mb-6">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  answers[currentQuestion] === option.value
                    ? "border-primary bg-primary/10 text-base-content"
                    : "border-base-300 hover:border-primary/50 text-base-content bg-base-100 hover:bg-base-200"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 mt-1 ${
                      answers[currentQuestion] === option.value ? "border-primary bg-primary" : "border-base-300"
                    }`}
                  >
                    {answers[currentQuestion] === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span className="text-sm">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentQuestion === 0 ? "text-base-content/40 cursor-not-allowed" : "text-primary hover:bg-primary/10"
              }`}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              上一题
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || answers.some(answer => answer === "")}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isSubmitting || answers.some(answer => answer === "")
                    ? "bg-base-300 text-base-content/50 cursor-not-allowed"
                    : "bg-primary text-primary-content hover:bg-primary/90"
                }`}
              >
                {isSubmitting ? "提交中..." : "提交结果"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  !answers[currentQuestion]
                    ? "text-base-content/40 cursor-not-allowed"
                    : "text-primary hover:bg-primary/10"
                }`}
              >
                下一题
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-8 text-sm text-base-content/60">
          <p>请根据你的真实想法选择答案，没有对错之分</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
