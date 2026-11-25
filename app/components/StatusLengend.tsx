// app/components/StatusLegend.tsx
// Compact legend explaining what each card status means on the dashboard.

const legend = [
  {
    key: "collecting",
    label: "Collecting",
    dot: "bg-[#D4845A]",
    bg: "bg-[#FEF3ED]",
    text: "text-[#D4845A]",
    desc: "Open for signatures. Share the signing link. You can still edit the card and hide messages until you deliver it.",
  },
  {
    key: "delivered",
    label: "Delivered",
    dot: "bg-[#7B9E87]",
    bg: "bg-[#EEF3EE]",
    text: "text-[#5A7D66]",
    desc: "Finalized, and signing is closed. If you added the recipient's email, we sent them the link the moment you delivered. If not, copy the recipient link from the card page and send it yourself.",
  },
];

export default function StatusLegend() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-white border border-[#E8DDD0] rounded-2xl px-4 py-3">
      {legend.map((s) => (
        <div key={s.key} className="flex items-start gap-3">
          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${s.bg} ${s.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </div>
          <p className="text-xs text-muted-taupe font-light leading-relaxed">
            {s.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
