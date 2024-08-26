import React, { useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { FaSearch } from "react-icons/fa"; // Import FontAwesome search icon
import InfineonLogo from '../public/logo.png'; // Import the Infineon logo (you'll need to have the logo locally)

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

// Utility function to highlight search text
const highlightText = (text, searchText) => {
  if (!searchText) return text; // If no search term, return plain text

  const regex = new RegExp(`(${searchText})`, 'gi'); // Match the search term (case-insensitive)
  const parts = text.split(regex); // Split the text based on the search term

  return parts.map((part, index) =>
    regex.test(part) ? <span key={index} className="bg-yellow-300">{part}</span> : part
  );
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
    <div className="flex flex-col h-screen bg-white">
      {/* Header with search bar */}
      <header className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center">
          <img src={InfineonLogo} alt="Infineon Logo" className="w-32 h-auto" /> {/* Infineon logo */}
        </div>

        <div className="flex items-center justify-center w-full">
          <div className="relative flex items-center">
            {/* Search Bar */}
            <FaSearch className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Suche nach Sehenswürdigkeiten..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A8276] text-gray-700 w-80 shadow-sm"
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="w-32"></div> {/* Placeholder to align with logo */}
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
                  background={'#0A8276'}
                  borderColor={'#0A8276'}
                  glyphColor={'#FFFFFF'}
                />
              </AdvancedMarker>
            ))}

            {selectedLocation && (
              <InfoWindow
                position={selectedLocation.position}
                onCloseClick={() => setSelectedLocation(null)}
                headerContent={
                  <h2 className="text-lg font-bold">
                    {highlightText(selectedLocation.name, searchText)}
                  </h2>
                }
              >
                <div>
                  <p className="text-sm text-gray-700 pb-4">
                    By: {highlightText(selectedLocation.user, searchText)}
                  </p>
                  <p className="text-base">
                    {highlightText(selectedLocation.infoText, searchText)}
                  </p>
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
