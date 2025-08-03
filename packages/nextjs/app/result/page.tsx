"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ArrowLeftIcon, CheckCircleIcon, ShareIcon } from "@heroicons/react/24/outline";

// MBTI类型描述数据
const mbtiDescriptions = {
  INTJ: {
    title: "建筑师",
    subtitle: "富有想象力和战略性的思考者",
    description:
      "你是一个深思熟虑的战略家，拥有独特的洞察力和创新能力。你善于分析复杂问题，制定长远计划，并追求完美。你的内向特质让你能够深度思考，而直觉帮助你看到事物的本质。你的逻辑思维和判断力让你成为优秀的决策者。",
    strengths: ["战略思维", "创新精神", "独立自主", "追求完美", "深度分析"],
    color: "from-purple-500 to-indigo-600",
  },
  INTP: {
    title: "逻辑学家",
    subtitle: "创新的发明家，拥有无尽的求知欲",
    description:
      "你是一个充满好奇心的思想家，喜欢探索抽象概念和理论。你拥有敏锐的逻辑思维，能够发现事物之间的关联。你的内向特质让你专注于深度思考，而感知特质让你保持开放和灵活。你善于解决复杂问题，是真正的创新者。",
    strengths: ["逻辑分析", "创新思维", "求知欲强", "独立思考", "理论构建"],
    color: "from-blue-500 to-cyan-600",
  },
  ENTJ: {
    title: "指挥官",
    subtitle: "大胆、富有想象力的领导者",
    description:
      "你是一个天生的领导者，拥有强大的意志力和决策能力。你善于制定战略，组织团队，并推动目标实现。你的外向特质让你善于沟通和激励他人，而判断特质让你保持专注和高效。你是变革的推动者，能够将愿景转化为现实。",
    strengths: ["领导能力", "战略规划", "果断决策", "高效执行", "激励他人"],
    color: "from-red-500 to-pink-600",
  },
  ENTP: {
    title: "辩论家",
    subtitle: "聪明好奇的思想家，喜欢智力挑战",
    description:
      "你是一个充满活力的创新者，喜欢探索新想法和可能性。你善于辩论，能够从多个角度分析问题。你的外向特质让你善于表达和交流，而感知特质让你保持灵活和适应性强。你是创意的源泉，能够激发他人的灵感。",
    strengths: ["创新思维", "辩论能力", "适应性强", "创意丰富", "激发灵感"],
    color: "from-orange-500 to-red-500",
  },
  INFJ: {
    title: "提倡者",
    subtitle: "安静而神秘，富有同情心的理想主义者",
    description:
      "你是一个富有同情心的理想主义者，拥有深刻的洞察力和创造力。你善于理解他人的情感，并致力于帮助他人成长。你的内向特质让你能够深度反思，而直觉帮助你看到未来的可能性。你是和平的使者，能够创造积极的变化。",
    strengths: ["同理心", "洞察力", "创造力", "理想主义", "和平使者"],
    color: "from-green-500 to-emerald-600",
  },
  INFP: {
    title: "调停者",
    subtitle: "诗意的、善良的利他主义者",
    description:
      "你是一个富有诗意的理想主义者，拥有丰富的内心世界和创造力。你重视个人价值观，追求和谐与真实。你的内向特质让你能够深度感受，而感知特质让你保持开放和包容。你是美的创造者，能够用独特的方式表达情感。",
    strengths: ["创造力", "同理心", "理想主义", "艺术天赋", "和谐追求"],
    color: "from-pink-500 to-rose-600",
  },
  ENFJ: {
    title: "主人公",
    subtitle: "富有魅力和鼓舞人心的领导者",
    description:
      "你是一个天生的激励者，拥有强大的同理心和领导能力。你善于理解他人需求，并帮助他们实现目标。你的外向特质让你善于沟通和建立关系，而判断特质让你保持专注和可靠。你是他人的导师，能够激发他们的潜能。",
    strengths: ["激励能力", "同理心", "领导才能", "沟通技巧", "培养他人"],
    color: "from-yellow-500 to-orange-500",
  },
  ENFP: {
    title: "竞选者",
    subtitle: "热情、有创造力、社交能力强",
    description:
      "你是一个充满热情和创造力的自由灵魂，喜欢探索可能性和激励他人。你善于发现他人的潜能，并帮助他们成长。你的外向特质让你善于社交和表达，而感知特质让你保持灵活和开放。你是灵感的源泉，能够点燃他人的激情。",
    strengths: ["热情活力", "创造力", "社交能力", "激励他人", "适应性强"],
    color: "from-yellow-400 to-orange-400",
  },
  ISTJ: {
    title: "物流师",
    subtitle: "实际而可靠，注重细节的执行者",
    description:
      "你是一个可靠和务实的执行者，拥有出色的组织能力和责任感。你善于制定计划，确保事情按预期进行。你的内向特质让你能够专注工作，而判断特质让你保持稳定和可靠。你是团队的中坚力量，值得信赖。",
    strengths: ["可靠性", "组织能力", "责任感", "注重细节", "执行力"],
    color: "from-gray-500 to-slate-600",
  },
  ISFJ: {
    title: "守卫者",
    subtitle: "非常专注和温暖的守护者",
    description:
      "你是一个温暖和负责任的守护者，善于照顾他人和维护和谐。你拥有出色的记忆力和观察力，能够注意到他人的需求。你的内向特质让你能够专注服务，而判断特质让你保持可靠和稳定。你是他人的依靠，创造温暖的环境。",
    strengths: ["关怀他人", "责任感", "观察力", "和谐维护", "服务精神"],
    color: "from-teal-500 to-cyan-600",
  },
  ESTJ: {
    title: "总经理",
    subtitle: "优秀的管理者，不可阻挡的执行者",
    description:
      "你是一个高效和果断的管理者，拥有出色的组织能力和领导才能。你善于制定规则，确保事情有序进行。你的外向特质让你善于沟通和协调，而判断特质让你保持专注和高效。你是秩序的维护者，能够带领团队成功。",
    strengths: ["管理能力", "执行力", "组织才能", "果断决策", "领导力"],
    color: "from-indigo-500 to-purple-600",
  },
  ESFJ: {
    title: "执政官",
    subtitle: "极其关心他人的社交达人",
    description:
      "你是一个温暖和负责任的社交达人，善于照顾他人和维护人际关系。你拥有出色的沟通能力和同理心，能够创造和谐的环境。你的外向特质让你善于社交，而判断特质让你保持可靠和稳定。你是人际关系的桥梁，创造温暖社区。",
    strengths: ["社交能力", "同理心", "责任感", "和谐维护", "服务精神"],
    color: "from-blue-500 to-indigo-600",
  },
  ISTP: {
    title: "鉴赏家",
    subtitle: "大胆而实用的实验家",
    description:
      "你是一个灵活和实用的解决问题者，拥有出色的观察力和动手能力。你善于分析情况，找到最有效的解决方案。你的内向特质让你能够专注观察，而感知特质让你保持灵活和适应性强。你是问题的解决者，能够应对各种挑战。",
    strengths: ["解决问题", "观察力", "动手能力", "适应性强", "实用主义"],
    color: "from-green-600 to-emerald-700",
  },
  ISFP: {
    title: "探险家",
    subtitle: "灵活而迷人的艺术家",
    description:
      "你是一个富有艺术天赋和同情心的自由灵魂，善于发现生活中的美。你拥有敏锐的审美观和创造力，能够用独特的方式表达自己。你的内向特质让你能够深度感受，而感知特质让你保持开放和灵活。你是美的创造者，带来独特的视角。",
    strengths: ["艺术天赋", "同理心", "创造力", "审美观", "自由精神"],
    color: "from-pink-400 to-rose-500",
  },
  ESTP: {
    title: "企业家",
    subtitle: "聪明、精力充沛、非常善于感知",
    description:
      "你是一个充满活力和冒险精神的行动者，善于把握机会和解决问题。你拥有敏锐的观察力和快速反应能力，能够在复杂环境中游刃有余。你的外向特质让你善于社交和表达，而感知特质让你保持灵活和适应性强。你是机会的把握者，能够快速行动。",
    strengths: ["行动力", "观察力", "适应性强", "冒险精神", "快速反应"],
    color: "from-orange-600 to-red-600",
  },
  ESFP: {
    title: "表演者",
    subtitle: "自发的、精力充沛的娱乐者",
    description:
      "你是一个充满活力和魅力的表演者，善于创造快乐和激励他人。你拥有出色的社交能力和同理心，能够轻松与人建立联系。你的外向特质让你善于表达和社交，而感知特质让你保持灵活和开放。你是快乐的传播者，能够点亮他人的生活。",
    strengths: ["社交能力", "活力四射", "同理心", "表演天赋", "快乐传播"],
    color: "from-yellow-500 to-orange-500",
  },
};

const ResultContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address: connectedAddress } = useAccount();

  const [mbtiType, setMbtiType] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const type = searchParams.get("type");
    const answersParam = searchParams.get("answers");

    if (type && answersParam) {
      setMbtiType(type);
      setAnswers(answersParam.split(","));
    } else {
      // 如果没有参数，重定向到首页
      router.push("/");
    }
  }, [searchParams, router]);

  const handleSaveToBlockchain = async () => {
    if (!connectedAddress) {
      alert("请先连接钱包");
      return;
    }

    setIsSaving(true);

    try {
      // 这里后续会添加区块链交互逻辑
      // 模拟保存过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSaved(true);
      console.log("保存到区块链:", { mbtiType, answers, address: connectedAddress });
    } catch (error) {
      console.error("保存失败:", error);
      alert("保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `我的MBTI类型是${mbtiType}`,
        text: `我在MBTI性格测试中获得了${mbtiType}类型！`,
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("链接已复制到剪贴板");
    setShowShareModal(false);
  };

  if (!mbtiType) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-base-content">加载中...</h2>
        </div>
      </div>
    );
  }

  const mbtiInfo = mbtiDescriptions[mbtiType as keyof typeof mbtiDescriptions];

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center text-primary hover:text-primary/80">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            返回首页
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90"
          >
            <ShareIcon className="w-5 h-5 mr-2" />
            分享结果
          </button>
        </div>

        {/* 主要结果展示 */}
        <div className="bg-base-100 rounded-lg p-8 shadow-lg mb-8 border border-base-300">
          <div className="text-center mb-8">
            <div
              className={`inline-block p-4 rounded-full bg-gradient-to-r ${mbtiInfo.color} text-white text-6xl font-bold mb-4`}
            >
              {mbtiType}
            </div>
            <h1 className="text-3xl font-bold mb-2 text-base-content">{mbtiInfo.title}</h1>
            <p className="text-xl text-base-content/80">{mbtiInfo.subtitle}</p>
          </div>

          {/* 性格描述 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-base-content">性格特征</h2>
            <p className="text-lg leading-relaxed text-base-content/90">{mbtiInfo.description}</p>
          </div>

          {/* 优势特点 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-base-content">你的优势</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mbtiInfo.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20"
                >
                  <span className="text-base-content font-medium">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 区块链保存 */}
          <div className="border-t border-base-300 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-base-content">保存到区块链</h3>
                <p className="text-base-content/80">将你的测试结果永久保存在区块链上，确保数据不可篡改</p>
              </div>
              <button
                onClick={handleSaveToBlockchain}
                disabled={isSaving || isSaved}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isSaved
                    ? "bg-success text-success-content cursor-not-allowed"
                    : isSaving
                      ? "bg-base-300 text-base-content/50 cursor-not-allowed"
                      : "bg-primary text-primary-content hover:bg-primary/90"
                }`}
              >
                {isSaved ? (
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    已保存
                  </div>
                ) : isSaving ? (
                  "保存中..."
                ) : (
                  "保存到区块链"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          <Link href="/test" className="px-6 py-3 bg-secondary text-secondary-content rounded-lg hover:bg-secondary/90">
            重新测试
          </Link>
          <Link href="/history" className="px-6 py-3 bg-accent text-accent-content rounded-lg hover:bg-accent/90">
            查看历史
          </Link>
        </div>
      </div>

      {/* 分享模态框 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg max-w-md w-full mx-4 border border-base-300">
            <h3 className="text-lg font-semibold mb-4 text-base-content">分享你的MBTI结果</h3>
            <p className="text-base-content/80 mb-4">复制以下链接分享给朋友：</p>
            <div className="bg-base-200 p-3 rounded mb-4 break-all text-sm text-base-content">
              {window.location.href}
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 px-4 py-2 bg-primary text-primary-content rounded hover:bg-primary/90"
              >
                复制链接
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 bg-base-300 text-base-content rounded hover:bg-base-400"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-base-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-base-content">加载中...</h2>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
};

export default ResultPage;
