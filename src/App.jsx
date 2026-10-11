import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router';
import ListPage from './pages/ListPage';
import PlaceDetail from './pages/PlaceDetail';
import NotFound from './pages/NotFound';
function App() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;
    window.scrollTo(0, 0);
  }, [location.pathname, navigationType]);
  return (
    <Routes>
      <Route path="/" element={<ListPage />} />
      <Route path="/place/:id" element={<PlaceDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
