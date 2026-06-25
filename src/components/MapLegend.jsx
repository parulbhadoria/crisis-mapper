import { AlertTriangle, HeartHandshake } from "lucide-react";

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000]
bg-white/95 backdrop-blur
rounded-xl shadow-xl
p-3 w-64
text-gray-800">

      <h3 className="font-bold mb-3 text-slate-800">
        Map Legend
      </h3>

      <div className="space-y-2">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          Critical Incident
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          Urgent Incident
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          Low Priority
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-500" />
          Resolved
        </div>

        <hr />

        <div className="flex items-center gap-2">
          <AlertTriangle size={14}/>
          Hotspot Circle
        </div>

        <div className="flex items-center gap-2">
          <HeartHandshake size={14}/>
          Helper Available Nearby
        </div>

        <div className="text-slate-500 mt-2">
          Hotspot Score = Number of nearby incidents
        </div>

    </div>
</div>
);
}