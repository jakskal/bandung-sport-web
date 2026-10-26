import Place from '../components/Place/Place';
import { useCallback, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import FilterChips from '../components/FilterChips/FilterChips';
import { Link, useSearchParams } from 'react-router';
import { fetchVenues } from '../api/client';

function ListPage() {
  const fetcher = useCallback((signal) => fetchVenues(signal), []);
  const { data, error, loading, retry } = useFetch(fetcher);

  const venues = data ?? [];
  const [searchParams, setSearchParams] = useSearchParams();
  // State to keep track of the currently active category filter
  const activeSport = searchParams.get('olahraga');
  const sports = [...new Set(venues.flatMap((venue) => venue.sports))].sort();

  // state to keep track of the currently active tier filter

  const activeTier = searchParams.get('tier');
  const tiers = [
    ...new Set(
      venues.map((place) => (place.tier != null ? place.tier : 'Belum dicek')),
    ),
  ];

  const activeArea = searchParams.get('area');
  const areas = [...new Set(venues.map((place) => place.area))];

  const setParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }
    setSearchParams(params);
  };

  const setActiveSport = (value) => setParam('olahraga', value);
  const setActiveTier = (value) => setParam('tier', value);
  const setActiveArea = (value) => setParam('area', value);
  const visibleVenues = venues.filter(
    (venue) =>
      (!activeSport || venue.sports.includes(activeSport)) &&
      (!activeTier ||
        venue.tier === activeTier ||
        (activeTier === 'Belum dicek' && venue.tier == null)) &&
      (!activeArea || venue.area === activeArea),
  );
  const hasActiveFilters = activeSport || activeTier || activeArea;

  useEffect(() => {
    // Reset filters when the component mounts
    document.title = 'Bandung Sport — Direktori olahraga Bandung';
  }, []);

  return (
    <>
      {
        <div className="container">
          <div className="filter-container">
            <div className="header">
              <h1>Bandung Sport</h1>
              <FilterChips
                items={sports}
                activeItem={activeSport}
                onItemClick={setActiveSport}
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
              <p>
                {loading && 'Memuat tempat...'}
                {!loading &&
                  !error &&
                  `${visibleVenues.length} tempat ditemukan.`}
              </p>
              {loading && (
                <ul className="place-list" aria-hidden="true">
                  {Array.from({ length: 6 }, (_, index) => (
                    <li key={index} className="skeleton-card" />
                  ))}
                </ul>
              )}
              {!loading && error && (
                <div className="fetch-error">
                  <p>Gagal Memuat data tempat.</p>
                  <p className="fetch-error-detail">{error.message}</p>
                  <button className="reset-button" onClick={retry}>
                    Coba lagi
                  </button>
                </div>
              )}
            </div>
          </div>
          {!loading && !error && visibleVenues.length === 0 && (
            <div className="no-places">
              <p>Tidak ada tempat yang ditemukan.</p>
              {hasActiveFilters && (
                <button
                  className="reset-button"
                  onClick={() => {
                    setActiveSport(null);
                    setActiveTier(null);
                    setActiveArea(null);
                  }}
                >
                  Reset filter
                </button>
              )}
            </div>
          )}

          {!loading && !error && visibleVenues.length > 0 && (
            <ul className="place-list">
              {visibleVenues.map((venue) => (
                <li key={venue.id}>
                  <Link className="place-card" to={`/tempat/${venue.id}`}>
                    <Place venue={venue} />
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
