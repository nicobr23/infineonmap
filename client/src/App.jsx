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
      const paths = {};
      let counter = 1; // Start the counter at 1 for image names

      for (const path in images) {
        const module = await images[path](); // Load the image URL dynamically
        paths[counter] = module.default; // Assign the image URL to the counter
        counter++; // Increment counter to match the next image
      }
      setImagePaths(paths); // Set the resolved image paths
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
        {/* Your header code */}
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
                      src={imagePaths[selectedLocation.id] || imagePaths[1]} // Fallback to '1.jpg' if no matching image
                      alt={`Image for location ${selectedLocation.id}`}
                      className="h-16 mobile:h-32 xl:h-48"
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
