import { Link } from 'react-router';

function NotFound() {
  return (
    <div className="container">
      <h1>404</h1>
      <h2>Halaman yang kamu cari nggak ada</h2>
      <Link to="/">← Kembali ke list</Link>
    </div>
  );
}

export default NotFound;
