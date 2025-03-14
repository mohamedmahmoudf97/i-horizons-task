import React from 'react';

/**
 * EmptyListMessage component displays a message when no items are found
 */
const EmptyListMessage: React.FC = () => {
  return (
    <div className="text-center py-6 sm:py-8" data-testid="empty-list">
      <p className="text-sm sm:text-base">No Pokémon found.</p>
    </div>
  );
};

export default EmptyListMessage;
