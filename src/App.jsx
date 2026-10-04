import { Routes, Route } from 'react-router';
import ListPage from './pages/ListPage';
import PlaceDetail from './pages/PlaceDetail';
function App() {
  return (
    <Routes>
      <Route path="/" element={<ListPage />} />
      <Route path="/place/:id" element={<PlaceDetail />} />
    </Routes>
  );
}

export default App;
