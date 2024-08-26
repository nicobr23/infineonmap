import React, { useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';

const locations = [
  {
    id: 1,
    name: "Schloss Neuschwanstein",
    position: { lat: 47.5575, lng: 10.7498 },
    user: "John Doe",
    infoText: "A breathtaking castle in the Bavarian Alps, known as the inspiration for Disney's Sleeping Beauty Castle."
  },
  {
    id: 2,
    name: "Marienplatz München",
    position: { lat: 48.1371, lng: 11.5754 },
    user: "Jane Smith",
    infoText: "The heart of Munich's city center, surrounded by historic buildings and famous for its Glockenspiel."
  },
  {
    id: 3,
    name: "Würzburg Residenz",
    position: { lat: 49.7913, lng: 9.9534 },
    user: "Max Mustermann",
    infoText: "One of the most important Baroque palaces in Europe, located in the city of Würzburg."
  },
];

const center = {
  lat: 48.790447,
  lng: 11.497889,
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Fuzzy search logic
  const handleSearchChange = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  // Filter function for fuzzy search on name, user, and infoText
  const filteredLocations = locations.filter((loc) => {
    const lowerSearchText = searchText.toLowerCase();
    return (
      loc.name.toLowerCase().includes(lowerSearchText) ||
      loc.user.toLowerCase().includes(lowerSearchText) ||
      loc.infoText.toLowerCase().includes(lowerSearchText)
    );
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Header with search bar */}
      <header className="bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">Mitarbeiter Lieblingsorte</h1>
          <input
            type="text"
            placeholder="Suche nach Sehenswürdigkeiten..."
            className="p-2 rounded-md text-black"
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      {/* Map */}
      <div className="flex-grow">
        <APIProvider apiKey={import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY}>
          <Map defaultCenter={center} defaultZoom={7} mapId="testID">

            {filteredLocations.map((location) => (
              <AdvancedMarker
                key={location.id}
                position={location.position}
                onClick={() => setSelectedLocation(location)}
              >
                <Pin
                  background={'#0f9d5800'}
                  borderColor={'#006425'}
                  glyphColor={'#60d98f'}
                />
              </AdvancedMarker>
            ))}

            {selectedLocation && (
              <InfoWindow
                position={selectedLocation.position}
                onCloseClick={() => setSelectedLocation(null)}
                headerContent={<h2 className="text-lg font-bold">{selectedLocation.name}</h2>}
              >
                <div>
                  <p className="text-sm text-gray-700 pb-4">By: {selectedLocation.user}</p>
                  <p className="text-base">{selectedLocation.infoText}</p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}

export default App;
