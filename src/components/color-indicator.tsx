import { txColorLabels, txColors } from "@/lib/tx-colors";

export default function ColorIndicator() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-50 items-center">
      {Object.entries(txColors).map(([type, color]) => (
        <div key={type} className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-4 rounded-full"
            style={{ background: hexColor(color as number) }}
          />
          
          <span className="text-sm text-white font-sans">
            {txColorLabels[type as keyof typeof txColors]}
          </span>
        </div>
      ))}
    </div>
  );
}

function hexColor(num: number) {
  return "#" + num.toString(16).padStart(6, "0");
}