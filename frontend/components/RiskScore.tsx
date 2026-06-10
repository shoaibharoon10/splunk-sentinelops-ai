import React from "react";

interface RiskScoreProps {
  score: number;
  level: string;
  factors: string[];
}

export default function RiskScore({ score, level, factors }: RiskScoreProps) {
  // SVG circular properties
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine colors based on level
  const getColorClasses = (lvl: string) => {
    const l = lvl.toLowerCase();
    if (l.includes("critical")) {
      return {
        text: "text-red-500",
        bg: "bg-red-950/20 border-red-800/50",
        stroke: "stroke-red-500",
        track: "stroke-red-950",
      };
    }
    if (l.includes("high")) {
      return {
        text: "text-orange-500",
        bg: "bg-orange-950/20 border-orange-800/50",
        stroke: "stroke-orange-500",
        track: "stroke-orange-950",
      };
    }
    if (l.includes("medium")) {
      return {
        text: "text-yellow-500",
        bg: "bg-yellow-950/20 border-yellow-800/50",
        stroke: "stroke-yellow-500",
        track: "stroke-yellow-950",
      };
    }
    return {
      text: "text-emerald-500",
      bg: "bg-emerald-950/20 border-emerald-800/50",
      stroke: "stroke-emerald-500",
      track: "stroke-emerald-950",
    };
  };

  const colors = getColorClasses(level);

  return (
    <div className={`border rounded-lg p-5 bg-zinc-950/80 ${colors.bg} flex flex-col md:flex-row items-center md:items-start gap-6`}>
      {/* Circle Gauge */}
      <div className="relative flex-shrink-0 w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle track */}
          <circle
            className={`${colors.track}`}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="56"
            cy="56"
          />
          {/* Progress circle */}
          <circle
            className={`${colors.stroke} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="56"
            cy="56"
          />
        </svg>
        {/* Score Value Text inside */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-zinc-100 tracking-tight">{score}</span>
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold">{level}</span>
        </div>
      </div>

      {/* Factors details */}
      <div className="space-y-3 flex-grow">
        <h4 className="text-zinc-300 font-bold text-xs tracking-wider uppercase">
          Threat Vector Assessment
        </h4>
        {factors && factors.length > 0 ? (
          <ul className="space-y-2">
            {factors.map((factor, idx) => (
              <li key={idx} className="text-xs text-zinc-400 flex items-start space-x-2">
                <span className="text-red-500 font-bold select-none mt-0.5">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500 text-xs italic">
            No indicators of compromise or elevated risk factors identified.
          </p>
        )}
      </div>
    </div>
  );
}
