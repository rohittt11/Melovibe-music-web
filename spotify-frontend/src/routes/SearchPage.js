import { useState } from "react";
import LoggedInContainer from "../containers/LoggedInContainer";
import { Icon } from "@iconify/react";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import SingleSongCard from "../components/shared/SingleSongCard";

const SearchPage = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [songData, setSongData] = useState([]);

  const searchSong = async () => {
    // This function will call the search api
    const response = await makeAuthenticatedGETRequest(
      "/song/get/songname/" + searchText
    );
    setSongData(response.data);
  };

  const Musics = [
    "Ram siya ram",
    "Satranga",
    "Tere hawaale",
    "Pehle bhi main",
    "Tu hai kahan",
    "Rang lageya",
    "Ghamand kar",
    "Aradhya",
    "Vachindamma",
    "Malare",
    "Darshana Hridayam",
    "Nagumo Hridayam",
    "Aaoge tum kabhi",
    "Kitni hasrat hai humein",
    "Ve kamleya",
    "Aashiyan",
    "Deewani mastani",
  ];

  const rohit = [
    "Salamat rahe dostana humara",
    "Gulabi ankhen",
    "Shirdi wale sai baba",
    "Aaj bhi",
    "Nai lagda",
    "Marham",
    "Kaise hua",
    "Sairat",
    "Yad lagla",
    "Umagaya baap re",
    "Kashmir mai tu kannyakumari",
    "Kamli",
    "Punjabi wedding song",
    "Hey shona",
    "Chor bazari",
    "Sukh kalale",
  ];

  return (
    <LoggedInContainer curActiveScreen="search">
      <div className="w-full py-6">
        <div
          className={`w-1/3 p-3 text-sm rounded-full bg-gray-800 px-5 flex text-white space-x-3 items-center ${
            isInputFocused ? "border border-white" : ""
          }`}
        >
          <Icon icon="ic:outline-search" className="text-lg" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            className="w-full bg-gray-800 focus:outline-none"
            onFocus={() => {
              setIsInputFocused(true);
            }}
            onBlur={() => {
              setIsInputFocused(false);
            }}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchSong();
              }
            }}
          />
        </div>
        {songData.length > 0 ? (
          <div className="pt-10 space-y-3">
            <div className="text-white">
              Showing search results for
              <span className="font-bold"> {searchText}</span>
            </div>
            {songData.map((item) => {
              return (
                <SingleSongCard
                  info={item}
                  key={JSON.stringify(item)}
                  playSound={() => {}}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-gray-400 pt-10 flex flex-wrap">
            <div className="w-1/3 pr-2">
              <div className="p-4 bg-gray-800 rounded-lg">
                {Musics.map((Music, index) => (
                  <h3 key={index} className="text-sm mb-2">
                    {Music}
                  </h3>
                ))}
              </div>
            </div>
            <div className="w-1/3 pl-2">
              <div className="p-4 bg-gray-800 rounded-lg">
                {rohit.map((rohitItem, index) => (
                  <h3 key={index} className="text-sm mb-2">
                    {rohitItem}
                  </h3>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </LoggedInContainer>
  );
};

export default SearchPage;
