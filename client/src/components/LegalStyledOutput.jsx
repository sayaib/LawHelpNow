import React from "react";

export default function LegalStyledOutput({ content }) {
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className="space-y-4 text-gray-800 text-sm leading-relaxed">
      {lines.map((line, index) => {
        // Main Heading (**Heading**)
        const headingMatch = line.match(/^\*\*(.+?)\*\*$/);
        if (headingMatch) {
          return (
            <h2 key={index} className="text-lg font-bold text-blue-700">
              {headingMatch[1]}
            </h2>
          );
        }

        // Subpoint (- **Subpoint**)
        const subpointMatch = line.match(/^- \*\*(.+?)\*\*$/);
        if (subpointMatch) {
          return (
            <li
              key={index}
              className="list-disc list-inside font-semibold text-gray-900 ml-6"
            >
              {subpointMatch[1]}
            </li>
          );
        }

        // Fallback plain text
        return (
          <p key={index} className="text-gray-700">
            {line}
          </p>
        );
      })}
    </div>
  );
}
