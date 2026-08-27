export const stations = [
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
  { code: 'SBC', name: 'Bengaluru City', city: 'Bengaluru' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur' },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal' },
  { code: 'PAT', name: 'Patna Junction', city: 'Patna' },
  { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior' },
  { code: 'CDG', name: 'Chandigarh', city: 'Chandigarh' },
  { code: 'VSKP', name: 'Visakhapatnam', city: 'Visakhapatnam' },
  { code: 'TVC', name: 'Thiruvananthapuram', city: 'Thiruvananthapuram' },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu' },
  { code: 'DDN', name: 'Dehradun', city: 'Dehradun' },
];

export function searchStations(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return stations.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.code.toLowerCase().includes(q) ||
    s.city.toLowerCase().includes(q)
  ).slice(0, 6);
}
