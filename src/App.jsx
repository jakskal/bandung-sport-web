import Place from './components/Place/Place';
import places from './data/places';
function App() {
  return (
    <>
      <div className="container">
        <h1>Bandung Sport</h1>
        <ul className="place-list">
          {places.map((place) => (
            <Place key={place.id} place={place} />
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
