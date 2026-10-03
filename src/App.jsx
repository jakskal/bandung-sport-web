import Place from './components/Place/Place';
import places from './data/places';
import { useState } from 'react';
import FilterChips from './components/FilterChips/FilterChips';
function App() {
  // State to keep track of the currently active category filter
  const [activeCategory, setActiveCategory] = useState(null);
  const categories = [...new Set(places.map((place) => place.category))];

  // state to keep track of the currently active tier filter

  const [activeTier, setActiveTier] = useState(null);
  const tiers = [
    ...new Set(
      places.map((place) =>
        place.tier != null ? place.tier : 'Belum dikurasi',
      ),
    ),
  ];

  const visiblePlaces = places.filter(
    (place) =>
      (!activeCategory || place.category === activeCategory) &&
      (!activeTier ||
        place.tier === activeTier ||
        (activeTier === 'Belum dikurasi' && place.tier == null)),
  );
  const count = visiblePlaces.length;
  return (
    <>
      <div className="container">
        <div className="header">
          <h1>Bandung Sport</h1>
          <p>{count} tempat ditemukan</p>
        </div>
        <FilterChips
          items={categories}
          activeItem={activeCategory}
          onItemClick={setActiveCategory}
        />
        <FilterChips
          items={tiers}
          activeItem={activeTier}
          onItemClick={setActiveTier}
        />
        <ul className="place-list">
          {visiblePlaces.map((place) => (
            <Place key={place.id} place={place} />
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
