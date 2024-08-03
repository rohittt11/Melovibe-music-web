import "./output.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginComponent from "./routes/Login";
import SignupComponent from "./routes/Signup";
import HomeComponent from "./routes/Home";
import LoggedInHomeComponent from "./routes/LoggedInHome";
import UploadSong from "./routes/UploadSong";
import MyMusic from "./routes/MyMusic";
import SearchPage from "./routes/SearchPage";
import Library from "./routes/Library";
import Profile from "./routes/Profile";
import SinglePlaylistView from "./routes/SinglePlaylistView";
import { useCookies } from "react-cookie";
import songContext from "./contexts/songContext";
import Support from "./routes/Support";
import SonglistConext from "./contexts/songListConext";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import videoSrc from "./assets/videos/gif.mp4";

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [cookie, setCookie] = useCookies(["token"]);
  const [songList, setSongList] = useState([]);

  return (
    <div className="w-screen h-screen font-poppins">
      <BrowserRouter>
        {cookie.token ? (
          <SonglistConext.Provider value={{ songList, setSongList }}>
            <songContext.Provider
              value={{
                currentSong,
                setCurrentSong,
                soundPlayed,
                setSoundPlayed,
                isPaused,
                setIsPaused,
              }}
            >
              <Routes>
                <Route path="/" element={<HelloComponent />} />
                <Route path="/home" element={<LoggedInHomeComponent />} />

                <Route path="/uploadsong" element={<UploadSong />} />

                <Route path="/myMusic" element={<MyMusic />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/support" element={<Support />} />
                <Route
                  path="/playlist/:playlistId"
                  element={<SinglePlaylistView />}
                />

                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </songContext.Provider>
          </SonglistConext.Provider>
        ) : (
          // logged out routes
          <Routes>
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

const HelloComponent = () => {
  const navigate = useNavigate();
  const isMounted = useRef(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isMounted.current) {
        // Check if the component is still mounted
        navigate("/home");
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      isMounted.current = false;
    };
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <video
        src={videoSrc}
        type="video/mp4"
        autoPlay
        muted
        loop
        className="logo-video"
      />
    </div>
  );
};

export default App;
