import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import InfineonLogo from '../public/logo.png';
import Modal from "./components/Modal";

// Import all images dynamically using import.meta.glob
const images = import.meta.glob('../public/images/*.{png,jpg,jpeg}');

// Utility function to highlight search text
const highlightText = (text, searchText) => {
  if (!searchText) return text;

  const regex = new RegExp(`(${searchText})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? <span key={index} className="bg-yellow-300">{part}</span> : part
  );
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePaths, setImagePaths] = useState({}); // State to hold image URLs

  useEffect(() => {
    // Fetch locations from the backend
    axios.get('http://127.0.0.1:5000/')
      .then((response) => {
        setLocations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
        setLoading(false);
      });

    // Resolve all image paths (asynchronous)
    const resolveImagePaths = async () => {
      const entries = Object.entries(images);
  
      // Extract the numerical part and sort
      const sortedEntries = entries.sort(([pathA], [pathB]) => {
        const numA = parseInt(pathA.match(/\d+/)[0], 10);
        const numB = parseInt(pathB.match(/\d+/)[0], 10);
        return numA - numB;
      });
  
      const paths = await Promise.all(
        sortedEntries.map(async ([path]) => {
          const module = await images[path]();
          return module.default;
        })
      );
  
      setImagePaths(paths); // Set the resolved image paths in the correct order
    };
  
    resolveImagePaths();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredLocations = locations.filter((loc) => {
    const lowerSearchText = searchText.toLowerCase();
    return (
      loc.name.toLowerCase().includes(lowerSearchText) ||
      loc.user.toLowerCase().includes(lowerSearchText) ||
      loc.infoText.toLowerCase().includes(lowerSearchText)
    );
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header with search bar */}
      <header>
        <div className="flex items-center justify-between p-4 bg-white border-b-0 mobile:border-b-2 border-ocean-80">
          <div className="flex items-center w-1/5">
            <img src={InfineonLogo} alt="Infineon Logo" className="h-6 mobile:h-12" /> {/* Infineon Logo */}
          </div>

          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-center text-base mobile:text-xl xl:text-2xl font-bold text-ocean-80 mb-0 px-2 mobile:mb-2">Karte aller Lieblingsplätze</h1>
          
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
            {/* Search Bar in mobile perspective*/}
            <FaSearch className="bg-ocean-20 absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-ocean-20 pl-10 pr-4 py-1 rounded-full border border-ocean-80 focus:outline-none focus:ring-2 focus:ring-[#0A8276] text-gray-700 w-64 shadow-sm  "
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </header>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
      <div className="flex-grow z-1">
        <APIProvider apiKey={import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY}>
          <Map defaultCenter={{ lat: 49.0134, lng: 12.1016 }} defaultZoom={11} mapId="testID">
            {filteredLocations.map((location, index) => (
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
                  <div className="flex flex-col justify-center items-center">
                    {/* Display the image dynamically based on the index (starting from 1) */}
                    <img
                      src={imagePaths[selectedLocation.id] || imagePaths[0]} // Fallback to '1.jpg' if no matching image
                      alt={`Image for location ${selectedLocation.id}`}
                      className="h-32 xl:h-48"
                    />
                    <p className="text-sm text-gray-700 pb-4">
                      Empfohlen von: {highlightText(selectedLocation.user, searchText)}
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
