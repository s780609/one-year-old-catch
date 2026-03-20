"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useVoting(myName, nameCheck) {
  const router = useRouter();

  const [count, setCount] = useState(0);
  const [votedItems, setVotedItems] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [checkingVotes, setCheckingVotes] = useState(false);
  const [showAlreadyVoted, setShowAlreadyVoted] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(5);
  const countRef = useRef(0);

  // 同步 countRef，避免 closure 舊值問題
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  // 進入投票頁面時，檢查此人是否已投過票
  useEffect(() => {
    if (!nameCheck || !myName?.trim()) return;

    const checkPreviousVotes = async () => {
      setCheckingVotes(true);
      try {
        const res = await fetch(
          `/api/vote?voter=${encodeURIComponent(myName)}&t=${Date.now()}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data.success && data.votedCount > 0) {
          if (data.votedCount >= 3) {
            setVotedItems(data.votedItems);
            setShowAlreadyVoted(true);
          } else {
            setCount(data.votedCount);
            countRef.current = data.votedCount;
            setVotedItems(data.votedItems);
            toast(`歡迎回來！你已經投了 ${data.votedCount}/3 票`, {
              icon: "📋",
              style: { borderRadius: "12px", background: "#3B82F6", color: "#fff", fontWeight: "bold" },
            });
          }
        }
      } catch (error) {
        console.error("檢查投票紀錄失敗:", error);
      } finally {
        setCheckingVotes(false);
      }
    };

    checkPreviousVotes();
  }, [nameCheck, myName]);

  // 投滿 3 票後觸發倒數
  useEffect(() => {
    if (count >= 3) {
      toast("選完囉，來看結果吧 🎉", {
        icon: "🍺",
        style: { borderRadius: "12px", background: "#4CAF50", color: "#fff", fontWeight: "bold" },
      });
      setTimeout(() => setShowCountdown(true), 800);
    }
  }, [count]);

  // 倒數計時，到 0 跳轉結果頁
  useEffect(() => {
    if (!showCountdown) return;
    if (countdownNumber <= 0) {
      router.push("/result", { scroll: false });
      return;
    }
    const timer = setTimeout(() => setCountdownNumber((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [showCountdown, countdownNumber]);

  const handleRevote = useCallback(async () => {
    setIsResetting(true);
    try {
      const res = await fetch(
        `/api/vote?voter=${encodeURIComponent(myName)}&reset=voter`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setCount(0);
        countRef.current = 0;
        setVotedItems([]);
        setShowAlreadyVoted(false);
        toast.success("已清除投票，重新開始吧！");
      } else {
        toast.error(data.error || "重置失敗");
      }
    } catch (error) {
      toast.error("重置失敗: " + error.message);
    } finally {
      setIsResetting(false);
    }
  }, [myName]);

  const handleVote = useCallback(async (itemName) => {
    if (countRef.current >= 3) {
      toast.error("已投滿 3 票");
      return;
    }
    setIsVoting(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterName: myName, itemName }),
      });
      const data = await res.json();
      if (data.success) {
        setCount((prev) => prev + 1);
        setVotedItems((prev) => [...prev, itemName]);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("投票失敗: " + error.message);
    } finally {
      setIsVoting(false);
    }
  }, [myName]);

  const handleCancelVote = useCallback(async (itemName) => {
    setIsVoting(true);
    try {
      const res = await fetch(
        `/api/vote?voter=${encodeURIComponent(myName)}&item=${encodeURIComponent(itemName)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setCount((prev) => prev - 1);
        setVotedItems((prev) => prev.filter((i) => i !== itemName));
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("取消失敗: " + error.message);
    } finally {
      setIsVoting(false);
    }
  }, [myName]);

  return {
    count,
    votedItems,
    isVoting,
    checkingVotes,
    showAlreadyVoted,
    isResetting,
    showCountdown,
    countdownNumber,
    handleVote,
    handleCancelVote,
    handleRevote,
  };
}
