import React from "react";

interface TransportModeProps {
  modes: string[];
}

const TransportMode: React.FC<TransportModeProps> = ({ modes }) => {
  const getIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "train":
        return "🚆";
      case "bus":
        return "🚌";
      case "taxi":
        return "🚕";
      case "plane":
        return "✈️";
      default:
        return "🚗";
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {modes.map((mode, index) => (
        <React.Fragment key={index}>
          <span className="text-lg">{getIcon(mode)}</span>
          {index < modes.length - 1 && <span className="text-gray-400">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TransportMode;