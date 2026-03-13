export const formatLocation = (location, fallback = 'Location not specified') => {
  if (!location) return fallback;

  if (typeof location === 'string') {
    const trimmed = location.trim();
    return trimmed || fallback;
  }

  if (Array.isArray(location)) {
    const parts = location
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : fallback;
  }

  if (typeof location === 'object') {
    const parts = [location.city, location.state, location.country]
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : fallback;
  }

  return fallback;
};
