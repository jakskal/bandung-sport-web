import './Header.css';
export default function Header({ venueCount }) {
  return (
    <header className="site-header">
      <h1 className="site-header-title">Bandung Sport — Direktori olahraga Bandung</h1>
      <p className="site-header-sub">
        Kita bantu cari tempat olahraga — kamu tinggal pilih
      </p>
      <a className="site-header-cta" href="#tempat-list">
        Lihat semua tempat
      </a>
      {venueCount != null && (
        <p className="site-header-count">{venueCount} tempat terdaftar</p>
      )}
    </header>
  );
}
