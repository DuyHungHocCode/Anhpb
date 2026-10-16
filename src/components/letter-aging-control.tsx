"use client";

import { useEffect, useState } from "react";

const START_DATE_KEY = "letter-aging-start-date";
const MAX_AGE_DAYS = 365;

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDateKey(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

function daysBetween(start: string, end: string) {
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  const startUtc = Date.UTC(startYear, startMonth - 1, startDay);
  const endUtc = Date.UTC(endYear, endMonth - 1, endDay);
  return Math.max(0, Math.floor((endUtc - startUtc) / 86_400_000));
}

function formatDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day, 12));
}

export function LetterAgingControl() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const [previewDays, setPreviewDays] = useState<number | null>(null);

  useEffect(() => {
    const currentDate = getLocalDateKey(new Date());
    let storedStartDate: string | null = null;

    try {
      const savedDate = window.localStorage.getItem(START_DATE_KEY);
      storedStartDate = isDateKey(savedDate) ? savedDate : currentDate;
      if (storedStartDate !== savedDate) {
        window.localStorage.setItem(START_DATE_KEY, storedStartDate);
      }
    } catch (error) {
      console.error("Không thể lưu ngày bắt đầu bộ đếm lá thư.", error);
      storedStartDate = currentDate;
    }

    const initializationTimeout = window.setTimeout(() => {
      setStartDate(storedStartDate);
      setToday(getLocalDateKey(new Date()));
    }, 0);

    const intervalId = window.setInterval(() => {
      setToday(getLocalDateKey(new Date()));
    }, 60_000);

    return () => {
      window.clearTimeout(initializationTimeout);
      window.clearInterval(intervalId);
    };
  }, []);

  const elapsedDays =
    startDate && today ? daysBetween(startDate, today) : 0;
  const shownDays = previewDays ?? elapsedDays;
  const paperAge = `${(Math.min(shownDays, MAX_AGE_DAYS) / MAX_AGE_DAYS) * 44}%`;

  useEffect(() => {
    document.documentElement.style.setProperty("--paper-age", paperAge);
    return () => {
      document.documentElement.style.removeProperty("--paper-age");
    };
  }, [paperAge]);

  return (
    <section className="timekeeper" aria-label="Bộ đếm tuổi của lá thư">
      <div className="timekeeper-reading" aria-live="polite">
        <span className="timekeeper-label">Thời gian từ ngày bắt đầu</span>
        <strong>
          {startDate && today ? `${shownDays} ngày` : "Đang tính…"}
        </strong>
        {startDate && (
          <span className="timekeeper-date">
            Bắt đầu từ {formatDate(startDate)}
            {previewDays !== null && " · đang xem thử"}
          </span>
        )}
      </div>

      <label className="timekeeper-slider-label" htmlFor="letter-age-preview">
        Mô phỏng giấy cũ theo thời gian
      </label>
      <input
        id="letter-age-preview"
        className="timekeeper-slider"
        type="range"
        min="0"
        max={Math.max(MAX_AGE_DAYS, elapsedDays)}
        step="1"
        value={shownDays}
        onChange={(event) => setPreviewDays(Number(event.currentTarget.value))}
        aria-valuetext={`${shownDays} ngày`}
      />
      <div className="timekeeper-scale" aria-hidden="true">
        <span>Hôm nay</span>
        <span>Một năm sau</span>
      </div>
      {previewDays !== null && (
        <button
          className="timekeeper-reset"
          type="button"
          onClick={() => setPreviewDays(null)}
        >
          Trở về thời gian thực
        </button>
      )}
    </section>
  );
}
