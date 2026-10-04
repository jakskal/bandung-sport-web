import Place from '../components/Place/Place';
import places from '../data/places';
import { useState } from 'react';
import FilterChips from '../components/FilterChips/FilterChips';
import { Link } from 'react-router';

function ListPage() {
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

  const [activeArea, setActiveArea] = useState(null);
  const areas = [...new Set(places.map((place) => place.area))];

  const visiblePlaces = places.filter(
    (place) =>
      (!activeCategory || place.category === activeCategory) &&
      (!activeTier ||
        place.tier === activeTier ||
        (activeTier === 'Belum dikurasi' && place.tier == null)) &&
      (!activeArea || place.area === activeArea),
  );
  const count = visiblePlaces.length;
  const hasActiveFilters = activeCategory || activeTier || activeArea;

  return (
    <>
      {
        <div className="container">
          <div className="filter-container">
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
            <select
              className="area-select"
              value={activeArea || ''}
              onChange={(e) => setActiveArea(e.target.value || null)}
            >
              <option value="">Semua Area</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          {visiblePlaces.length === 0 ? (
            <div className="no-places">
              <p>Tidak ada tempat yang ditemukan.</p>
              {hasActiveFilters && (
                <button
                  className="reset-button"
                  onClick={() => {
                    setActiveCategory(null);
                    setActiveTier(null);
                    setActiveArea(null);
                  }}
                >
                  Reset filter
                </button>
              )}
            </div>
          ) : (
            <ul className="place-list">
              {visiblePlaces.map((place) => (
                <li key={place.id}>
                  <Link className="place-card" to={`/place/${place.id}`}>
                    <Place place={place} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      }
    </>
  );
}

export default ListPage;
