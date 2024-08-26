import React, { useState } from "react";
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const locations = [
  { id: 1, name: "Schloss Neuschwanstein", position: { lat: 47.5575, lng: 10.7498 } },
  { id: 2, name: "Marienplatz München", position: { lat: 48.1371, lng: 11.5754 } },
  { id: 3, name: "Würzburg Residenz", position: { lat: 49.7913, lng: 9.9534 } },
];


const center = {
  lat: 48.790447,
  lng: 11.497889,
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header mit Suchleiste */}
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

      {/* Karte */}
      <div className="flex-grow">
        <APIProvider apiKey={import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY}>
          <Map defaultCenter={center} defaultZoom={7}>


            {locations
              .filter((loc) => loc.name.toLowerCase().includes(searchText.toLowerCase()))
              .map((location) => (
                <Marker
                  key={location.id}
                  position={location.position}
                  onClick={() => setSelectedLocation(location)}
                />
              ))}
          </Map>
        </APIProvider>



        {/* <LoadScript googleMapsApiKey={import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
            {locations
              .filter((loc) => loc.name.toLowerCase().includes(searchText.toLowerCase()))
              .map((location) => (
                <MarkerF
                  key={location.id}
                  position={location.position}
                  onClick={() => setSelectedLocation(location)}
                />
              ))}
              
            {selectedLocation && (
              <InfoWindow
                position={selectedLocation.position}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  <h2>{selectedLocation.name}</h2>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript> */}
      </div>
    </div>
  );
}

export default App;
