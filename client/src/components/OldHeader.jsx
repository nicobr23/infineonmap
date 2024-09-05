Import React from 'react'

function OldHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b-2 border-ocean-80">
    <div className="flex items-center">
      <img src={InfineonLogo} alt="Infineon Logo" className="w-32  h-auto " /> {/* Infineon Logo */}
    </div>
    <div className="flex items-center justify-center w-3-5">
      <div className="relative flex items-center">
        {/* Search Bar */}
        <FaSearch className="absolute left-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 rounded-full border border-ocean-80 focus:outline-none focus:ring-2 focus:ring-[#0A8276] text-gray-700 w-auto shadow-sm  "
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
    </div>

    <div className="w-32">
      <p className="text-center"><button onClick={() => setShowModal(true)} className='w-12 h-12 bg-ocean-40 m-4 px-2 rounded-full border-2 border-ocean-60 text-4xl font-bold text-ocean-80'>
      ?
      </button></p>
    </div> {/* Placeholder to align with logo */}
  </header>
  )
}

export default OldHeader