const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function fetchVenues(signal) {
  const res = await fetch(`${BASE_URL}/api/venues`, { signal });
  if (!res.ok) {
    const err = new Error(
      `Failed to fetch venues: ${res.status} ${res.statusText}`,
    );
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function fetchVenue(id, signal) {
  const res = await fetch(`${BASE_URL}/api/venues/${id}`, { signal });
  if (!res.ok) {
    const err = new Error(
      `Failed to fetch venue: ${res.status} ${res.statusText}`,
    );
    err.status = res.status;
    throw err;
  }
  return res.json();
}
