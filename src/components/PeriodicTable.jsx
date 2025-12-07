import React, { useState } from 'react';
import './PeriodicTable.css';

const PeriodicTable = ({ elements, onElementSelect, selectedElement }) => {
  const [hoveredElement, setHoveredElement] = useState(null);

  const periods = {};
  elements.forEach(element => {
    if (!periods[element.ypos]) {
      periods[element.ypos] = [];
    }
    periods[element.ypos].push(element);
  });

  const sortedPeriods = Object.keys(periods)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(key => periods[key]);

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

  const isLanthanideOrActinide = (element) => {
    return element.category === 'lanthanide' || element.category === 'actinide';
  };


  const fBlockElements = elements.filter(el => isLanthanideOrActinide(el));

  return (
    <div className="periodic-table">
      <div className="table-legend">
        <div className="legend-title">Element Categories</div>
        <div className="legend-items">
          {['alkali metal', 'alkaline earth metal', 'transition metal', 'post-transition metal',
            'metalloid', 'nonmetal', 'noble gas', 'lanthanide', 'actinide'].map(cat => (
              <div key={cat} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: getCategoryColor(cat) }}></span>
                <span className="legend-label">{cat}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="main-table">
        {sortedPeriods.map((period, periodIndex) => (
          <div key={periodIndex} className="period-row">
            {period
              .filter(el => !isLanthanideOrActinide(el))
              .sort((a, b) => a.xpos - b.xpos)
              .map(element => (
                <button
                  key={element.number}
                  className={`element-cell ${selectedElement?.number === element.number ? 'selected' : ''} ${hoveredElement?.number === element.number ? 'hovered' : ''}`}
                  style={{
                    backgroundColor: getCategoryColor(element.category),
                    gridColumn: element.xpos
                  }}
                  onClick={() => onElementSelect(element)}
                  onMouseEnter={() => setHoveredElement(element)}
                  onMouseLeave={() => setHoveredElement(null)}
                  title={`${element.name} (${element.symbol}) - ${element.category}`}
                >
                  <div className="element-number">{element.number}</div>
                  <div className="element-symbol">{element.symbol}</div>
                  <div className="element-name">{element.name}</div>
                </button>
              ))}
          </div>
        ))}
      </div>

      <div className="f-block-container">
        <div className="f-block-label">Lanthanides</div>
        <div className="f-block-row">
          {elements
            .filter(el => el.number >= 57 && el.number <= 71)
            .sort((a, b) => a.number - b.number)
            .map(element => (
              <button
                key={element.number}
                className={`element-cell ${selectedElement?.number === element.number ? 'selected' : ''}`}
                style={{ backgroundColor: getCategoryColor(element.category) }}
                onClick={() => onElementSelect(element)}
                onMouseEnter={() => setHoveredElement(element)}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className="element-number">{element.number}</div>
                <div className="element-symbol">{element.symbol}</div>
              </button>
            ))}
        </div>

        <div className="f-block-label">Actinides</div>
        <div className="f-block-row">
          {elements
            .filter(el => el.number >= 89 && el.number <= 103)
            .sort((a, b) => a.number - b.number)
            .map(element => (
              <button
                key={element.number}
                className={`element-cell ${selectedElement?.number === element.number ? 'selected' : ''}`}
                style={{ backgroundColor: getCategoryColor(element.category) }}
                onClick={() => onElementSelect(element)}
                onMouseEnter={() => setHoveredElement(element)}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className="element-number">{element.number}</div>
                <div className="element-symbol">{element.symbol}</div>
              </button>
            ))}
        </div>
      </div>

      {hoveredElement && (
        <div className="element-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-symbol">{hoveredElement.symbol}</span>
            <span className="tooltip-name">{hoveredElement.name}</span>
          </div>
          <div className="tooltip-details">
            <p>Atomic Number: {hoveredElement.number}</p>
            <p>Atomic Mass: {hoveredElement.atomic_mass?.toFixed(3)}</p>
            <p>Category: {hoveredElement.category}</p>
            <p>Phase: {hoveredElement.phase}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodicTable;