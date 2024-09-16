export async function fetchData(dataLink) {
  try {
    const response = await fetch(dataLink);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const moviesList = await response.json();

    return moviesList;
  } catch {
    console.error(`Failed to fetch data`, error);
    return [];
  }
}