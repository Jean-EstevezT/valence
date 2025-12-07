import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ElementProperties.css';

const ElementProperties = ({ element }) => {
  // Prepare data for line chart (temperature properties)
  const tempData = [
    { name: 'Melting', value: element.melt || 0, type: 'Melting Point' },
    { name: 'Boiling', value: element.boil || 0, type: 'Boiling Point' },
  ].filter(item => item.value > 0);

  // Prepare data for bar chart (comparison with nearby elements)
  const nearbyElementsData = [
    { name: element.symbol, 
      atomicMass: element.atomic_mass || 0,
      electronegativity: element.electronegativity_pauling || 0,
      density: element.density || 0
    }
  ];

  // Mock data for context (in real app, you'd fetch nearby elements)
  const mockNearbyElements = [
    { name: element.xpos > 1 ? 'Previous' : 'Next', 
      atomicMass: element.atomic_mass ? element.atomic_mass * 0.9 : 0,
      electronegativity: element.electronegativity_pauling ? element.electronegativity_pauling * 0.95 : 0,
      density: element.density ? element.density * 0.85 : 0
    },
    { name: element.xpos < 18 ? 'Next' : 'Previous', 
      atomicMass: element.atomic_mass ? element.atomic_mass * 1.1 : 0,
      electronegativity: element.electronegativity_pauling ? element.electronegativity_pauling * 1.05 : 0,
      density: element.density ? element.density * 1.15 : 0
    }
  ];

  const comparisonData = [...mockNearbyElements, ...nearbyElementsData];

  // Property cards data
  const propertyCards = [
    {
      title: 'Atomic Radius',
      value: element.atomic_radius ? `${element.atomic_radius} pm` : 'Unknown',
      icon: '⦿',
      color: '#10b981'
    },
    {
      title: 'Electronegativity',
      value: element.electronegativity_pauling || 'Unknown',
      icon: '⚡',
      color: '#f59e0b'
    },
    {
      title: 'Ionization Energy',
      value: element.ionization_energies?.[0] ? `${element.ionization_energies[0]} kJ/mol` : 'Unknown',
      icon: '⚛️',
      color: '#8b5cf6'
    },
    {
      title: 'Electron Affinity',
      value: element.electron_affinity ? `${element.electron_affinity} kJ/mol` : 'Unknown',
      icon: '🔋',
      color: '#3b82f6'
    }
  ];

  return (
    <div className="element-properties">
      <h3>Physical & Chemical Properties</h3>
      
      <div className="property-cards">
        {propertyCards.map((card, index) => (
          <div key={index} className="property-card" style={{ borderLeftColor: card.color }}>
            <div className="card-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="card-content">
              <div className="card-title">{card.title}</div>
              <div className="card-value">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-container">
        {tempData.length > 0 && (
          <div className="chart">
            <h4>Temperature Properties (K)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #475569',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Temperature (K)"
                  stroke="#60a5fa" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="chart">
          <h4>Property Comparison</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid #475569',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="atomicMass" 
                name="Atomic Mass" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="electronegativity" 
                name="Electronegativity" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="additional-info">
        <h4>Additional Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Discovered by:</span>
            <span className="info-value">{element.discovered_by || 'Unknown'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Discovery Year:</span>
            <span className="info-value">{element.discovery_year || 'Unknown'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Named by:</span>
            <span className="info-value">{element.named_by || 'Unknown'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Appearance:</span>
            <span className="info-value">{element.appearance || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementProperties;