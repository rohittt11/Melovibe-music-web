import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";

const Library = () => {
  const [myPlaylists, setMyPlaylists] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest("/playlist/get/me");
      setMyPlaylists(response.data || []);
    };
    getData();
  }, []);

  return (
    <LoggedInContainer curActiveScreen={"library"}>
      <div className="text-white text-lg md:text-xl pt-4 md:pt-8 font-semibold">
        My Playlists
      </div>

      {myPlaylists.length === 0 ? (
        <div className="text-gray-400 text-sm mt-6">
          No playlists yet. Create one from the sidebar or the bottom bar.
        </div>
      ) : (
        <div className="py-4 md:py-5 grid gap-3 md:gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {myPlaylists.map((item) => (
            <Card
              key={JSON.stringify(item)}
              title={item.name}
              description=""
              imgUrl={item.thumbnail}
              playlistId={item._id}
            />
          ))}
        </div>
      )}
    </LoggedInContainer>
  );
};

const Card = ({ title, description, imgUrl, playlistId }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-black bg-opacity-40 w-full p-3 md:p-4 rounded-lg cursor-pointer hover:bg-opacity-60 transition-all"
      onClick={() => navigate("/playlist/" + playlistId)}
    >
      <div className="pb-3 md:pb-4 pt-1 md:pt-2">
        <img
          className="w-full aspect-square object-cover rounded-md"
          src={imgUrl}
          alt={title}
        />
      </div>
      <div className="text-white font-semibold py-2 text-sm md:text-base truncate">
        {title}
      </div>
      {description && (
        <div className="text-gray-500 text-xs md:text-sm truncate">
          {description}
        </div>
      )}
    </div>
  );
};

export default Library;
