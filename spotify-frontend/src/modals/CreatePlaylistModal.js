import { useState } from "react";
import { createPortal } from "react-dom";
import TextInput from "../components/shared/TextInput";
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";

const CreatePlaylistModal = ({ closeModal }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistThumbnail, setPlaylistThumbnail] = useState("");

  const createPlaylist = async () => {
    const response = await makeAuthenticatedPOSTRequest("/playlist/create", {
      name: playlistName,
      thumbnail: playlistThumbnail,
      songs: [],
    });
    if (response._id) {
      closeModal();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={closeModal}
    >
      <div
        className="bg-[#181818] w-full max-w-md rounded-xl p-5 md:p-8 border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Smaller title on mobile */}
        <div className="text-white mb-4 md:mb-6 font-bold text-lg md:text-xl">
          Create Playlist
        </div>

        {/* Reduced spacing on mobile */}
        <div className="space-y-3 md:space-y-4 flex flex-col justify-center items-center w-full">
          <TextInput
            label="Name"
            labelClassName={"text-white text-sm md:text-base"}
            placeholder="Playlist Name"
            value={playlistName}
            setValue={setPlaylistName}
          />
          <TextInput
            label="Thumbnail"
            labelClassName={"text-white text-sm md:text-base"}
            placeholder="Thumbnail URL"
            value={playlistThumbnail}
            setValue={setPlaylistThumbnail}
          />
          {/* Full width button, slightly smaller on mobile */}
          <button
            className="bg-white w-full rounded-full text-black font-bold justify-center items-center py-2.5 md:py-3 mt-2 md:mt-4 cursor-pointer hover:bg-gray-200 transition-colors text-sm md:text-base"
            onClick={createPlaylist}
          >
            Create
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreatePlaylistModal;
