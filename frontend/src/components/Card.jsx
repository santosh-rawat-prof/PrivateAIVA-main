import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Card({ title, value, subtitle, icon }) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex justify-between">
        <div className="text-2xl font-bold">{value}</div>
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </div>
      <div className="text-sm mt-1">{title}</div>
      <div className="text-xs text-gray-400">{subtitle}</div>
    </div>
  );
}
