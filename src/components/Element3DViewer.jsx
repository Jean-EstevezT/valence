import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import './Element3DViewer.css';

const Electron = ({ radius, speed, inclination = 0, color, isAnimating }) => {
  const ref = useRef();
  const time = useRef(0);

  useFrame((state, delta) => {
    if (!isAnimating) return;
    time.current += delta * speed;
    const x = Math.cos(time.current) * radius;
    const z = Math.sin(time.current) * radius * Math.cos(inclination);
    const y = Math.sin(inclination) * radius;
    ref.current.position.set(x, y, z);
  });

  return (
    <Sphere ref={ref} args={[0.05, 16, 16]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </Sphere>
  );
};

const Shell = ({ radius, color, electrons, shellNumber, isAnimating }) => {
  const electronsPerShell = [2, 8, 18, 32, 32, 18, 8]; // Max electrons per shell

  const electronPositions = [];
  if (electrons > 0) {
    const maxElectrons = electronsPerShell[shellNumber - 1] || electrons;
    const actualElectrons = Math.min(electrons, maxElectrons);

    for (let i = 0; i < actualElectrons; i++) {
      const angle = (i / actualElectrons) * Math.PI * 2;
      const inclination = Math.sin(i * 0.7) * 0.5; // Vary inclination for 3D effect
      electronPositions.push({
        angle,
        inclination,
        speed: 0.5 + Math.random() * 0.5
      });
    }
  }

  return (
    <group>
      <Sphere args={[radius, 32, 32]}>
        <meshBasicMaterial color={color} transparent opacity={0.1} wireframe />
      </Sphere>
      {electronPositions.map((pos, idx) => (
        <Electron
          key={idx}
          radius={radius * 1.1}
          speed={pos.speed}
          inclination={pos.inclination}
          color={idx % 2 === 0 ? "#60a5fa" : "#a78bfa"}
          isAnimating={isAnimating}
        />
      ))}
    </group>
  );
};

const Nucleus = ({ protons, neutrons }) => {
  const totalNucleons = protons + neutrons;
  const nucleonCount = Math.min(50, totalNucleons); // Limit for performance
  const nucleons = [];

  for (let i = 0; i < nucleonCount; i++) {
    const radius = 0.3 * Math.cbrt(totalNucleons) * 0.3;
    const phi = Math.acos(-1 + (2 * i) / nucleonCount);
    const theta = Math.sqrt(nucleonCount * Math.PI) * phi;

    nucleons.push({
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi),
      type: i < protons ? 'proton' : 'neutron'
    });
  }

  return (
    <group>
      {nucleons.map((nuc, idx) => (
        <Sphere key={idx} position={[nuc.x, nuc.y, nuc.z]} args={[0.1, 16, 16]}>
          <meshStandardMaterial
            color={nuc.type === 'proton' ? '#ef4444' : '#3b82f6'}
            emissive={nuc.type === 'proton' ? '#ef4444' : '#3b82f6'}
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}
    </group>
  );
};

const AtomModel = ({ element, isAnimating }) => {
  const protons = element.number;
  const neutrons = Math.round(element.atomic_mass) - protons;
  const electrons = protons;

  // Shell radii based on electron configuration
  const shells = [];
  let remainingElectrons = electrons;

  for (let i = 1; i <= 7 && remainingElectrons > 0; i++) {
    const maxInShell = Math.min(2 * i * i, remainingElectrons);
    const electronsInShell = Math.min(maxInShell, remainingElectrons);
    shells.push({
      number: i,
      radius: i * 0.8,
      electrons: electronsInShell,
      color: i % 2 === 0 ? '#10b981' : '#0ea5e9'
    });
    remainingElectrons -= electronsInShell;
  }

  return (
    <group>
      <Nucleus protons={protons} neutrons={neutrons} />
      {shells.map(shell => (
        <Shell
          key={shell.number}
          radius={shell.radius}
          color={shell.color}
          electrons={shell.electrons}
          shellNumber={shell.number}
          isAnimating={isAnimating}
        />
      ))}
      <Html position={[0, -shells[shells.length - 1]?.radius * 1.5 || -3, 0]}>
        <div className="atom-label">
          {element.name} Atom
          <div className="atom-stats">
            <span>Protons: {protons}</span>
            <span>Neutrons: {neutrons}</span>
            <span>Electrons: {electrons}</span>
          </div>
        </div>
      </Html>
    </group>
  );
};

const Element3DViewer = ({ element }) => {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="element-3d-viewer">
      <div className="viewer-header">
        <h3>3D Atomic Structure</h3>
        <button
          className="control-button"
          onClick={() => setAutoRotate(!autoRotate)}
        >
          {autoRotate ? 'Pause Rotation' : 'Resume Rotation'}
        </button>
      </div>

      <div className="canvas-container">
        <Canvas camera={{ position: [10, 5, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <AtomModel element={element} isAnimating={autoRotate} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>

      <div className="viewer-info">
        <p>Interactive 3D model showing electron shells and nucleus composition.</p>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color proton"></div>
            <span>Protons ({element.number})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color neutron"></div>
            <span>Neutrons ({Math.round(element.atomic_mass) - element.number})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color electron"></div>
            <span>Electrons ({element.number})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Element3DViewer;