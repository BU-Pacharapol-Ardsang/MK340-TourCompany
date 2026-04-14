"use client";

import { useState, useRef } from "react";
import StarRating from "./StarRating";

interface ReviewFormProps {
  tourId: string;
  onSubmitSuccess?: () => void;
}

export default function ReviewForm({ tourId, onSubmitSuccess }: ReviewFormProps) {
  const [step, setStep] = useState<"code" | "form">("code");
  const [reviewCode, setReviewCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidateCode = async () => {
    if (!reviewCode.trim()) {
      setCodeError("กรุณาใส่รหัสรีวิว");
      return;
    }

    setIsValidatingCode(true);
    setCodeError("");

    try {
      const response = await fetch("/api/review-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: reviewCode, tourId }),
      });

      const data = await response.json();

      if (data.valid) {
        setStep("form");
      } else {
        setCodeError(data.message || "รหัสรีวิวไม่ถูกต้อง");
      }
    } catch {
      setCodeError("เกิดข้อผิดพลาดในการตรวจสอบรหัส");
    } finally {
      setIsValidatingCode(false);
    }
  };

  const handleAddFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = selectedFiles.length + newFiles.length;

    if (totalFiles > 5) {
      setSubmitError(`สามารถอัปโหลดได้สูงสุด 5 รูป (ปัจจุบัน ${selectedFiles.length})`);
      return;
    }

    // Filter image files only
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== newFiles.length) {
      setSubmitError("กรุณาเลือกเฉพาะไฟล์รูปภาพ");
      return;
    }

    setSelectedFiles([...selectedFiles, ...imageFiles]);
    setSubmitError("");
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!name.trim() || !email.trim()) {
      setSubmitError("กรุณากรอกชื่อและอีเมล");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("tourId", tourId);
      formData.append("reviewCode", reviewCode);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("rating", rating.toString());
      formData.append("comment", comment);

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch("/api/reviews/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setName("");
        setEmail("");
        setComment("");
        setSelectedFiles([]);
        setRating(5);
        setReviewCode("");
        setStep("code");

        onSubmitSuccess?.();

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(data.error || "เกิดข้อผิดพลาดในการส่งรีวิว");
      }
    } catch {
      setSubmitError("เกิดข้อผิดพลาดในการส่งรีวิว");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
        <p className="text-green-800 font-semibold">ส่งรีวิวสำเร็จแล้ว!</p>
        <p className="text-sm text-green-600 mt-1">
          ขอบคุณที่แบ่งปันประสบการณ์ของคุณ
        </p>
      </div>
    );
  }

  if (step === "code") {
    return (
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">ป้อนรหัสรีวิว</h3>
        <p className="text-sm text-gray-600 mb-4">
          รหัสรีวิวถูกส่งไปยังอีเมลของคุณหลังจากเที่ยวจบแล้ว
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รหัสรีวิว
            </label>
            <input
              type="text"
              value={reviewCode}
              onChange={(e) => {
                setReviewCode(e.target.value.toUpperCase());
                setCodeError("");
              }}
              placeholder="กรุณาใส่รหัสรีวิว 8 หลัก"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isValidatingCode}
            />
            {codeError && (
              <p className="text-red-600 text-sm mt-1">{codeError}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleValidateCode}
            disabled={isValidatingCode}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
          >
            {isValidatingCode ? "กำลังตรวจสอบ..." : "ดำเนินการต่อ"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">เขียนรีวิว</h3>

      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {submitError}
        </div>
      )}

      <div className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ให้คะแนน
          </label>
          <StarRating value={rating} onChange={setRating} size="md" />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อ *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อของคุณ"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            อีเมล *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="อีเมลของคุณ"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ความเห็น
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="แบ่งปันประสบการณ์ของคุณ..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รูปภาพ (สูงสุด 5 รูป)
          </label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddFiles(e.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleAddFiles(e.target.files)}
              className="hidden"
              aria-label="เลือกรูปภาพ"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              เลือกรูปภาพ
            </button>
            <p className="text-sm text-gray-600 mt-1">
              หรือลากรูปมาวางที่นี่
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={() => setStep("code")}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
          >
            ย้อนกลับ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
          >
            {isSubmitting ? "กำลังส่ง..." : "ส่งรีวิว"}
          </button>
        </div>
      </div>
    </form>
  );
}
