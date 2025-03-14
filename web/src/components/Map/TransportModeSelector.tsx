import React from 'react';
import { TRANSPORT_MODES } from '../../constants/TRANSPORT_MODES';

interface TransportModeSelectorProps {
    selectedModes: string[];  // Correction : On utilise `string[]`
    onModeToggle: (mode: string) => void;
}

const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({ selectedModes, onModeToggle }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {Object.values(TRANSPORT_MODES).map((mode) => {
                const isSelected = selectedModes.includes(mode.id);
                const Icon = mode.icon;

                return (
                    <button
                        key={mode.id}
                        onClick={() => onModeToggle(mode.id)}
                        className={`flex items-center px-3 py-2 rounded-lg transition-all
                            ${isSelected
                                ? `${mode.bgColor} ${mode.color} border-2 border-current`
                                : 'bg-white border-2 border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                    >
                        <Icon className="h-4 w-4 mr-2" />
                        <span>{mode.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default TransportModeSelector;