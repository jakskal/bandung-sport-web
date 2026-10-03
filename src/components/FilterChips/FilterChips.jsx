import './FilterChips.css';
function FilterChips({ items, activeItem, onItemClick }) {
  return (
    <div className="filter-row">
      <button
        key="all"
        className={!activeItem ? 'filter-item filter-active' : 'filter-item'}
        onClick={() => onItemClick(null)}
      >
        Semua
      </button>
      {items.map((item) => (
        <button
          key={item}
          className={
            activeItem === item ? 'filter-item filter-active' : 'filter-item'
          }
          onClick={() => onItemClick(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default FilterChips;
