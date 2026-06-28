import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location'); // Example: lat,lng or an address string
  
  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'Google API key is not configured' }, { status: 500 });
  }

  try {
    // For now, since we might get a string like 'Polanco, CDMX', 
    // ideally we'd geocode it first, but we can try textsearch.
    // In a real scenario, you'd use Places API Text Search or Nearby Search.
    
    // Using Text Search for flexibility
    const query = encodeURIComponent(`lugares cercanos a ${location}`);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_API_KEY}&language=es`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return NextResponse.json({ error: data.error_message || 'Error from Google API' }, { status: 500 });
    }

    // Process the results to simplify for the frontend
    const results = (data.results || []).slice(0, 5).map((place: any) => ({
      name: place.name,
      category: place.types && place.types.length > 0 ? place.types[0].replace(/_/g, ' ') : 'General',
      distance: 'A consultar' // Distance matrix would be needed for walking time
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
