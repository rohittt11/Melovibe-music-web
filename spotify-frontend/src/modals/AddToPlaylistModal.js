import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";

const AddToPlaylistModal = ({ closeModal, addSongToPlaylist }) => {
  const [myPlaylists, setMyPlaylists] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest("/playlist/get/me");
      setMyPlaylists(response.data);
    };
    getData();
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={closeModal}
    >
      {/* Adjusted padding and max-height for mobile */}
      <div
        className="bg-[#181818] w-full max-w-md rounded-xl p-4 md:p-6 border border-white/10 shadow-2xl max-h-[70vh] md:max-h-[80vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white mb-3 md:mb-5 font-bold text-lg md:text-xl">
          Select Playlist
        </div>

        <div className="space-y-2 flex flex-col justify-center items-center w-full">
          {myPlaylists.length === 0 ? (
            <div className="text-gray-400 text-sm py-4">
              No playlists found. Create one first!
            </div>
          ) : (
            myPlaylists.map((item) => (
              <PlaylistListComponent
                key={item._id}
                info={item}
                addSongToPlaylist={addSongToPlaylist}
              />
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const PlaylistListComponent = ({ info, addSongToPlaylist }) => {
  return (
    <div
      className="bg-[#282828] w-full flex items-center space-x-3 md:space-x-4 hover:bg-gray-600 transition-colors cursor-pointer p-2 md:p-3 rounded-lg"
      onClick={() => addSongToPlaylist(info._id)}
    >
      <div>
        {/* Smaller thumbnail on mobile */}
        <img
          src={info.thumbnail}
          className="w-10 h-10 md:w-12 md:h-12 rounded object-cover shrink-0"
          alt="thumbnail"
        />
      </div>
      <div className="text-white font-semibold text-sm md:text-base truncate">
        {info.name}
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
