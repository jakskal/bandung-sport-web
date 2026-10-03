import Place from './components/Place/Place';
import places from './data/places';
import { useState } from 'react';

function App() {
  const [activeCategory, setActiveCategory] = useState(null);
  const categories = [...new Set(places.map((place) => place.category))];
  const visiblePlaces = places.filter(
    (place) => !activeCategory || place.category === activeCategory,
  );
  const count = visiblePlaces.length;
  return (
    <>
      <div className="container">
        <div className="header">
          <h1>Bandung Sport</h1>
          <p>{count} tempat ditemukan</p>
        </div>
        <div className="category-filter-row">
          <button
            key="all"
            className={
              !activeCategory
                ? 'category-filter-item category-filter-active'
                : 'category-filter-item'
            }
            onClick={() => setActiveCategory(null)}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category
                  ? 'category-filter-item category-filter-active'
                  : 'category-filter-item'
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
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
