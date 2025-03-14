import React from 'react';

interface AbilitiesFilterProps {
  selectedAbilities: string[];
  availableAbilities: string[];
  onChange: (abilities: string[]) => void;
}

const AbilitiesFilter: React.FC<AbilitiesFilterProps> = ({ 
  selectedAbilities, 
  availableAbilities, 
  onChange 
}) => {
  const handleAbilityChange = (ability: string, isChecked: boolean) => {
    if (isChecked) {
      onChange([...selectedAbilities, ability]);
    } else {
      onChange(selectedAbilities.filter(a => a !== ability));
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-medium">Abilities</label>
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 p-2 border border-gray-300 rounded-md bg-gray-800 max-h-40 sm:max-h-60 overflow-y-auto" 
        data-testid="abilities-container"
      >
        {availableAbilities.map(ability => (
          <div key={ability} className="flex items-center">
            <input
              type="checkbox"
              id={`ability-${ability}`}
              name="ability"
              value={ability}
              checked={selectedAbilities.includes(ability)}
              onChange={(e) => handleAbilityChange(ability, e.target.checked)}
              className="mr-1 sm:mr-2"
              data-testid={`ability-checkbox-${ability}`}
            />
            <label htmlFor={`ability-${ability}`} className="text-xs sm:text-sm capitalize truncate">
              {ability.replace('-', ' ')}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbilitiesFilter;
