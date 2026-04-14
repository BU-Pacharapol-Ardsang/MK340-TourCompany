"use client";

import { useEffect, useState } from "react";

interface AdminReviewCodeGeneratorProps {
  tourId: string;
  tourTitle: string;
}

type ReviewCodeRow = {
  code: string;
  used: boolean;
  used_by: string | null;
  created_at: string;
  review: {
    rating: number;
    comment: string | null;
    images: string[];
    name: string | null;
    email: string | null;
    created_at: string | null;
  } | null;
};

export default function AdminReviewCodeGenerator({
  tourId,
  tourTitle,
}: AdminReviewCodeGeneratorProps) {
  const [count, setCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingCodes, setIsLoadingCodes] = useState(true);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [existingCodes, setExistingCodes] = useState<ReviewCodeRow[]>([]);
  const [unusedCount, setUnusedCount] = useState(0);
  const [usedCount, setUsedCount] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    const safeRating = Math.max(0, Math.min(5, Math.round(rating)));
    return "★★★★★".slice(0, safeRating) + "☆☆☆☆☆".slice(0, 5 - safeRating);
  };

  const loadExistingCodes = async () => {
    setIsLoadingCodes(true);

    try {
      const response = await fetch(`/api/review-codes/${tourId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "ไม่สามารถโหลดรหัสรีวิวได้");
      }

      setExistingCodes(Array.isArray(data.codes) ? data.codes : []);
      setExpandedCode(null);
      setUnusedCount(typeof data.unusedCount === "number" ? data.unusedCount : 0);
      setUsedCount(typeof data.usedCount === "number" ? data.usedCount : 0);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "ไม่สามารถโหลดรหัสรีวิวได้");
    } finally {
      setIsLoadingCodes(false);
    }
  };

  useEffect(() => {
    loadExistingCodes();
  }, [tourId]);

  const handleGenerate = async () => {
    if (count < 1 || count > 100) {
      setError("ต้องกำหนดจำนวน 1-100");
      return;
    }

    if (
      unusedCount > 0 &&
      !window.confirm(`มีรหัสที่ยังไม่ใช้ ${unusedCount} รหัส ต้องการสร้างเพิ่มหรือไม่?`)
    ) {
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
        await loadExistingCodes();
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการสร้างรหัส");
      }
    } catch {
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

  const handleCopyUnused = async () => {
    const text = existingCodes
      .filter((item) => !item.used)
      .map((item) => item.code)
      .join("\n");

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

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xs text-blue-700">ยังไม่ใช้</p>
          <p className="text-xl font-semibold text-blue-900">{unusedCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs text-gray-600">ใช้แล้ว</p>
          <p className="text-xl font-semibold text-gray-900">{usedCount}</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">รหัสที่มีอยู่ในระบบ (ล่าสุด 200 รายการ)</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadExistingCodes}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              รีเฟรช
            </button>
            <button
              type="button"
              onClick={handleCopyUnused}
              disabled={unusedCount === 0}
              className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              คัดลอกรหัสที่ยังไม่ใช้
            </button>
          </div>
        </div>

        {isLoadingCodes ? (
          <p className="text-sm text-gray-500">กำลังโหลดรหัส...</p>
        ) : existingCodes.length === 0 ? (
          <p className="text-sm text-gray-500">ยังไม่มีรหัสรีวิวสำหรับแพ็กเกจนี้</p>
        ) : (
          <div className="max-h-48 space-y-2 overflow-y-auto rounded bg-gray-50 p-2">
            {existingCodes.map((item) => (
              <div key={`${item.code}-${item.created_at}`} className="rounded bg-white px-3 py-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-gray-900">{item.code}</span>

                  <div className="flex items-center gap-2">
                    {item.used && item.review ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                        {renderStars(item.review.rating)} ({item.review.rating}/5)
                      </span>
                    ) : null}

                    {item.used && item.review ? (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCode((prev) => (prev === item.code ? null : item.code))
                        }
                        className="rounded-full border border-gray-300 px-2 py-0.5 font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        {expandedCode === item.code ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
                      </button>
                    ) : null}

                    {item.used ? (
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 font-semibold text-gray-700">
                        ใช้แล้ว
                      </span>
                    ) : (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 font-semibold text-blue-800">
                        ยังไม่ใช้
                      </span>
                    )}
                  </div>
                </div>

                {item.used && item.review && expandedCode === item.code ? (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <p className="text-gray-700">
                        <span className="font-semibold text-gray-900">ชื่อ:</span> {item.review.name || "-"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold text-gray-900">อีเมล:</span> {item.review.email || "-"}
                      </p>
                    </div>

                    <p className="mt-2 text-gray-700">
                      <span className="font-semibold text-gray-900">รีวิว:</span>{" "}
                      {item.review.comment?.trim() ? item.review.comment : "ไม่มีข้อความรีวิว"}
                    </p>

                    {item.review.images.length > 0 ? (
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                        {item.review.images.map((imageUrl, imageIndex) => (
                          <a
                            key={`${item.code}-img-${imageIndex}`}
                            href={imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block overflow-hidden rounded border border-gray-200 bg-white"
                          >
                            <img
                              src={imageUrl}
                              alt={`review-${item.code}-${imageIndex + 1}`}
                              className="h-20 w-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-gray-500">ไม่มีรูปที่แนบมา</p>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

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
