import React, { useState, useEffect } from 'react';
import './App.css';
import PeriodicTable from './components/PeriodicTable';
import ElementCard from './components/ElementCard';
import Element3DViewer from './components/Element3DViewer';
import ElementProperties from './components/ElementProperties';

function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElements();
  }, []);

  const fetchElements = async () => {
    const cachedData = localStorage.getItem('periodicTableData');
    if (cachedData) {
      try {
        setElements(JSON.parse(cachedData));
        setLoading(false);
      } catch (e) {
        console.error('Error parsing cached data', e);
      }
    }

    try {
      const response = await fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json');
      const data = await response.json();

      setElements(data.elements);
      if (!cachedData) setLoading(false);

      localStorage.setItem('periodicTableData', JSON.stringify(data.elements));
    } catch (error) {
      console.error('Error fetching elements:', error);
      if (!cachedData) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="app-title">Valence - Periodic Table Explorer</h1>
        <p className="app-subtitle">Interactive visualization of chemical elements and their properties</p>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading elements...</p>
        </div>
      ) : (
        <main className="app-main">
          <div className="dashboard">
            <div className="periodic-table-container">
              <PeriodicTable
                elements={elements}
                onElementSelect={setSelectedElement}
              />
            </div>

            <div className="visualization-panel">
              {selectedElement ? (
                <>
                  <ElementCard element={selectedElement} />
                  <div className="visualizations">
                    <Element3DViewer element={selectedElement} />
                    <ElementProperties element={selectedElement} />
                  </div>
                </>
              ) : (
                <div className="placeholder">
                  <div className="placeholder-icon">⚛️</div>
                  <h3>Select an Element</h3>
                  <p>Click on any element in the periodic table to visualize its properties and atomic structure</p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      <footer className="App-footer">
        <p>Data sourced from Periodic-Table-JSON API | Built with React & Three.js | Created by <a href="https://github.com/Jean-EstevezT" target="_blank" rel="noopener noreferrer">Jean Estevez</a></p>
      </footer>
    </div>
  );
}

export default App;