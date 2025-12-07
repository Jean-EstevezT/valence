import React from 'react';
import './ElementCard.css';

const ElementCard = ({ element }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'diatomic nonmetal': '#f59e0b',
      'noble gas': '#8b5cf6',
      'alkali metal': '#ef4444',
      'alkaline earth metal': '#f97316',
      'metalloid': '#10b981',
      'polyatomic nonmetal': '#f59e0b',
      'post-transition metal': '#06b6d4',
      'transition metal': '#3b82f6',
      'lanthanide': '#ec4899',
      'actinide': '#d946ef',
      'unknown': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const getPhaseColor = (phase) => {
    const colors = {
      'Gas': '#3b82f6',
      'Liquid': '#8b5cf6',
      'Solid': '#10b981',
      '': '#6b7280'
    };
    return colors[phase] || '#6b7280';
  };

  return (
    <div className="element-card">
      <div className="card-header" style={{ backgroundColor: getCategoryColor(element.category) }}>
        <div className="header-content">
          <div className="element-basic-info">
            <div className="atomic-number">#{element.number}</div>
            <div className="element-symbol-large">{element.symbol}</div>
            <div className="element-name-large">{element.name}</div>
          </div>
          <div className="atomic-mass">{element.atomic_mass?.toFixed(3)}</div>
        </div>
      </div>
      
      <div className="card-body">
        <div className="property-grid">
          <div className="property">
            <span className="property-label">Category</span>
            <span className="property-value">{element.category}</span>
          </div>
          <div className="property">
            <span className="property-label">Phase</span>
            <span className="property-value" style={{ color: getPhaseColor(element.phase) }}>
              {element.phase || 'Unknown'}
            </span>
          </div>
          <div className="property">
            <span className="property-label">Group</span>
            <span className="property-value">{element.xpos}</span>
          </div>
          <div className="property">
            <span className="property-label">Period</span>
            <span className="property-value">{element.ypos}</span>
          </div>
          <div className="property">
            <span className="property-label">Density</span>
            <span className="property-value">
              {element.density ? `${element.density} g/cm³` : 'Unknown'}
            </span>
          </div>
          <div className="property">
            <span className="property-label">Melting Point</span>
            <span className="property-value">
              {element.melt ? `${element.melt} K` : 'Unknown'}
            </span>
          </div>
          <div className="property">
            <span className="property-label">Boiling Point</span>
            <span className="property-value">
              {element.boil ? `${element.boil} K` : 'Unknown'}
            </span>
          </div>
          <div className="property">
            <span className="property-label">Electronegativity</span>
            <span className="property-value">
              {element.electronegativity_pauling || 'Unknown'}
            </span>
          </div>
          <div className="property">
            <span className="property-label">Electron Configuration</span>
            <span className="property-value electron-config">
              {element.electron_configuration || 'Unknown'}
            </span>
          </div>
        </div>
        
        <div className="element-description">
          <h4>Description</h4>
          <p>{element.summary || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ElementCard;