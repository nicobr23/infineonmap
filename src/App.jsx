import React, { useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { FaSearch } from "react-icons/fa"; // Import FontAwesome search icon
import InfineonLogo from '../public/logo.png'; // Import the Infineon logo (you'll need to have the logo locally)
import Modal from "./components/Modal";
import Person from '../public/person.png'; // Import Example Picture for a Person

const locations = [
  {
    id: 1,
    name: "Schloss Neuschwanstein",
    position: { lat: 47.5575, lng: 10.7498 },
    user: "John Doe",
    infoText: "A breathtaking castle in the Bavarian Alps, known as the inspiration for Disney's Sleeping Beauty Castle.",
    profilPicture: {Person}
  },
  {
    id: 2,
    name: "Marienplatz München",
    position: { lat: 48.1371, lng: 11.5754 },
    user: "Sean Esper",
    infoText: "The heart of Munich's city center, surrounded by historic buildings and famous for its Glockenspiel.",
    profilPicture: {Person}
  },
  {
    id: 3,
    name: "Würzburg Residenz",
    position: { lat: 49.7913, lng: 9.9534 },
    user: "Max Mustermann",
    infoText: "One of the most important Baroque palaces in Europe, located in the city of Würzburg.",
    profilPicture: {Person}
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
  const [showModal, setShowModal] =useState(false);

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
      <header >
        <div className="flex items-center justify-between p-4 bg-white border-b-0 mobile:border-b-2 border-ocean-80">
          <div className="flex items-center w-1/5">
            <img src={InfineonLogo} alt="Infineon Logo" className="h-6 mobile:h-12" /> {/* Infineon Logo */}
          </div>

          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-base mobile:text-xl xl:text-2xl font-bold text-ocean-80 mb-0 mobile:mb-2">Map of all favorite places</h1>
          
            <div className="relative hidden items-center mobile:flex">
              {/* Search Bar */}
              <FaSearch className="absolute left-3 text-gray-500 bg-ocean-20" />
              <input
                type="text"
                placeholder="Search..."
                className=" bg-ocean-20 pl-10 pr-4 py-2 rounded-full border border-ocean-80 focus:outline-none focus:ring-2 focus:ring-[#0A8276] text-gray-700 w-auto shadow-sm  "
                value={searchText}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="w-1/5">
            <p className="text-center"><button onClick={() => setShowModal(true)} className='px-2 py-0.5 border-ocean-80 bg-white rounded-lg max-w-max border-2 text-base mobile:text-xl xl:text-3xl font-bold text-ocean-80'>
            Info
            </button></p>
          </div> {/* Placeholder to align with logo */}
        </div>
        <div className="flex items-center justify-center w-3-5 mobile:hidden border-b-2 border-ocean-80 pb-4">
          <div className="relative flex items-center">
            {/* Search Bar in mobile perspective
            */}
            <FaSearch className="bg-ocean-20 absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-ocean-20 pl-10 pr-4 py-2 rounded-full border border-ocean-80 focus:outline-none focus:ring-2 focus:ring-[#0A8276] text-gray-700 w-auto shadow-sm  "
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </header>

      {showModal && <Modal onClose={() => setShowModal(false)}/>}
      {/* Pop up info window -> BLURT DIE KARTE NICHT AUS*/}
      {/* Map */}
      <div className="flex-grow z-1">
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
                  glyphColor={'#B8DEDA'}
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
                  <div class="flex flex-col justify-center items-center">
                    <img src={Person} alt="Profile photo of the person who suggested this place" className="h-16 mobile:h-32 xl:h-48" /> {/* Infineon Logo */}
                    <p className="text-sm text-gray-700 pb-4">
                    Suggested by: {highlightText(selectedLocation.user, searchText)}
                    </p>
                  </div>
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
