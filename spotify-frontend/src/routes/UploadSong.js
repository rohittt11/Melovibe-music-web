import { useState } from "react";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";
import TextInput from "../components/shared/TextInput";
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";
import { useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import ContractModal from "../modals/ContractModal";

const UploadSong = () => {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [uploadedSongFileName, setUploadedSongFileName] = useState();
  const [duration, setDuration] = useState(0);
  const [uploadedSong, setUploadedSong] = useState(null);
  const navigate = useNavigate();

  // Get logged-in user's name for signature matching
  const profileData = (() => {
    try {
      return JSON.parse(localStorage.getItem("profileData")) || {};
    } catch {
      return {};
    }
  })();

  const artistFullName = `${profileData.firstname || ""} ${
    profileData.lastname || ""
  }`.trim();

  const submitSong = async () => {
    const data = { name, thumbnail, track: playlistUrl, duration: duration };
    const response = await makeAuthenticatedPOSTRequest("/song/create", data);

    if (response?.err) {
      alert("Could not create song: " + response.err);
      return;
    }

    // Song created — now show contract modal
    setUploadedSong(response);
  };

  const handleContractSigned = () => {
    alert("Song uploaded and contract signed successfully!");
    setUploadedSong(null);
    navigate("/myMusic");
  };

  const handleContractCancel = () => {
    // Contract not signed — song is still in DB but stays unsigned
    alert(
      "Song uploaded, but contract not signed. You can sign it later from My Contracts."
    );
    setUploadedSong(null);
    navigate("/myMusic");
  };

  return (
    <LoggedInContainer curActiveScreen="uploadsong">
      <div className="content p-4 md:p-8 pt-0 overflow-auto">
        <div className="text-xl md:text-2xl font-semibold mb-5 text-white mt-4 md:mt-8">
          Upload Your Music
        </div>

        <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-3 mb-4">
          <div className="w-full sm:w-1/2">
            <TextInput
              label="Name"
              labelClassName={"text-white"}
              placeholder="Name"
              value={name}
              setValue={setName}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <TextInput
              label="Thumbnail"
              labelClassName={"text-white"}
              placeholder="Thumbnail"
              value={thumbnail}
              setValue={setThumbnail}
              type="file"
            />
          </div>
        </div>

        <div className="py-4 md:py-5">
          {uploadedSongFileName ? (
            <div className="bg-white rounded-full p-3 w-full sm:w-1/2 text-sm truncate">
              {uploadedSongFileName.substring(0, 35)}...
            </div>
          ) : (
            <CloudinaryUpload
              setUrl={setPlaylistUrl}
              setName={setUploadedSongFileName}
              setDuration={setDuration}
            />
          )}
        </div>

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-full cursor-pointer font-semibold transition-colors disabled:opacity-50"
          onClick={submitSong}
          disabled={!name || !thumbnail || !playlistUrl}
        >
          Submit & Sign Contract
        </button>

        <p className="text-xs text-gray-400 mt-3">
          After upload, you'll be asked to sign a contract to publish this song
          on MeloVibe.
        </p>
      </div>

      {/* Contract Modal — appears after successful upload */}
      {uploadedSong && (
        <ContractModal
          song={uploadedSong}
          artistName={artistFullName}
          closeModal={handleContractCancel}
          onSigned={handleContractSigned}
        />
      )}
    </LoggedInContainer>
  );
};

export default UploadSong;
