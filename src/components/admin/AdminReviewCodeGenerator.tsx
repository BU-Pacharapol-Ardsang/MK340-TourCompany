"use client";

import { useState } from "react";

interface AdminReviewCodeGeneratorProps {
  tourId: string;
  tourTitle: string;
}

export default function AdminReviewCodeGenerator({
  tourId,
  tourTitle,
}: AdminReviewCodeGeneratorProps) {
  const [count, setCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (count < 1 || count > 100) {
      setError("ต้องกำหนดจำนวน 1-100");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/review-codes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tourId, count }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedCodes(data.codes);
        setCount(10);
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการสร้างรหัส");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAll = async () => {
    const text = generatedCodes.join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg bg-white border border-gray-200 p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">สร้างรหัสรีวิว</h3>
        <p className="text-sm text-gray-600 mt-1">{tourTitle}</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {generatedCodes.length === 0 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              จำนวนรหัสที่ต้องการ
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              title="จำนวนรหัสรีวิว"
              placeholder="เช่น 10"
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
          >
            {isGenerating ? "กำลังสร้าง..." : "สร้างรหัส"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-3">
              สร้างรหัสสำเร็จ {generatedCodes.length} รหัส
            </p>

            <div className="max-h-48 overflow-y-auto bg-white rounded p-3 mb-3 text-xs font-mono space-y-1">
              {generatedCodes.map((code, index) => (
                <div key={index} className="text-gray-700">
                  {code}
                </div>
              ))}
            </div>

            <button
              onClick={handleCopyAll}
              className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              {copied ? "คัดลอกแล้ว!" : "คัดลอกทั้งหมด"}
            </button>
          </div>

          <button
            onClick={() => {
              setGeneratedCodes([]);
              setCount(10);
            }}
            className="w-full py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
          >
            สร้างเพิ่มเติม
          </button>
        </div>
      )}
    </div>
  );
}
