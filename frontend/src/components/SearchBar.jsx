import React from 'react';
import Icon from './icons';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search records...',
}) {
  return (
    <div className="search-bar">
      <Icon name="search" size={16} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <Icon name="close" size={13} />
        </button>
      )}
    </div>
  );
}
