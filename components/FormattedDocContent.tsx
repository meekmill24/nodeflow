'use client';

import React from 'react';
import { CheckCircle2, ChevronRight, Hash } from 'lucide-react';

interface FormattedDocContentProps {
  content: string;
  accentColor?: string; // e.g. '#3DD6C8', 'emerald', 'cyan'
}

export default function FormattedDocContent({
  content,
  accentColor = '#3DD6C8'
}: FormattedDocContentProps) {
  if (!content || !content.trim()) return null;

  // Split into raw blocks separated by 2 or more newlines, or lines that clearly mark new sections
  const blocks = content
    .split(/\n\s*\n/)
    .map(b => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return null;

        const firstLine = lines[0];

        // Check if firstLine is a heading like "1. Title", "01. Title", "## Title", "Section Name:"
        const isHeading =
          /^(\d+[\.\)]|\#+|[A-Z\s]{3,}:)/i.test(firstLine) ||
          firstLine.endsWith(':') ||
          (firstLine.length < 60 && lines.length > 1);

        if (isHeading && lines.length > 1) {
          const headingText = firstLine.replace(/^#+\s*/, '');
          const bodyLines = lines.slice(1);

          return (
            <div
              key={bIdx}
              className="p-6 md:p-8 rounded-[28px] bg-[#0B0B1E]/80 border border-white/5 hover:border-white/10 transition-all duration-300 space-y-4 relative overflow-hidden group shadow-lg"
            >
              <div
                className="absolute top-0 left-0 h-[2px] w-12 transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: accentColor }}
              />

              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-mono text-xs font-black"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    border: `1px solid ${accentColor}30`,
                    color: accentColor
                  }}
                >
                  {headingText.match(/^\d+/)?.[0] || <Hash size={14} />}
                </div>
                <h3 className="text-base font-black text-white uppercase tracking-tight pt-1">
                  {headingText.replace(/^\d+[\.\)]\s*/, '')}
                </h3>
              </div>

              <div className="space-y-2.5 pl-0 sm:pl-11">
                {bodyLines.map((line, lIdx) => {
                  const isBullet = /^[-*•]\s+/.test(line);
                  const isSubNum = /^\d+\.\d+\s+/.test(line);

                  if (isBullet || isSubNum) {
                    const cleanText = line.replace(/^[-*•]\s+|\d+\.\d+\s+/, '');
                    const prefix = isSubNum ? line.match(/^\d+\.\d+/)?.[0] : null;

                    return (
                      <div key={lIdx} className="flex items-start gap-2.5 text-xs text-white/70 font-medium leading-relaxed">
                        {prefix ? (
                          <span
                            className="text-[10px] font-black font-mono shrink-0 px-1.5 py-0.5 rounded bg-white/5 border border-white/10"
                            style={{ color: accentColor }}
                          >
                            {prefix}
                          </span>
                        ) : (
                          <ChevronRight
                            size={14}
                            className="shrink-0 mt-0.5"
                            style={{ color: accentColor }}
                          />
                        )}
                        <span>{cleanText}</span>
                      </div>
                    );
                  }

                  return (
                    <p key={lIdx} className="text-xs text-white/70 font-medium leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        }

        // Check if single block with bullet points
        const hasBullets = lines.some(l => /^[-*•]/.test(l));
        if (hasBullets) {
          return (
            <div
              key={bIdx}
              className="p-6 md:p-8 rounded-[28px] bg-[#0B0B1E]/60 border border-white/5 space-y-3"
            >
              {lines.map((line, lIdx) => {
                const isBullet = /^[-*•]/.test(line);
                const text = line.replace(/^[-*•]\s*/, '');
                return (
                  <div key={lIdx} className="flex items-start gap-3 text-xs text-white/70 font-medium leading-relaxed">
                    {isBullet ? (
                      <CheckCircle2
                        size={16}
                        className="shrink-0 mt-0.5"
                        style={{ color: accentColor }}
                      />
                    ) : (
                      <span className="font-bold text-white uppercase tracking-wider block mb-1">
                        {text}
                      </span>
                    )}
                    {isBullet && <span>{text}</span>}
                  </div>
                );
              })}
            </div>
          );
        }

        // Regular clean paragraph card
        return (
          <div
            key={bIdx}
            className="p-6 md:p-7 rounded-[24px] bg-[#0B0B1E]/50 border border-white/5 hover:border-white/10 transition-all text-xs text-white/75 font-medium leading-relaxed"
          >
            {lines.map((l, idx) => (
              <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                {l}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
