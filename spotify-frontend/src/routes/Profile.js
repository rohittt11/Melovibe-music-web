import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Avatar from "../containers/avatar";

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [gmail, setGmail] = useState("");
  const [bio, setBio] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // State to control the popup

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("profileData"));

    if (storedData) {
      setProfileImage(storedData.profileImage || null);
      setUsername(storedData.username || "");
      setGmail(storedData.gmail || "");
      setBio(storedData.bio || "");
      setFirstname(storedData.firstname || "");
      setLastname(storedData.lastname || "");
    }
  }, [cookies.token]); // Refresh data when token changes

  useEffect(() => {
    const filledFields = [username, gmail, bio, firstname, lastname];
    const completeness =
      (filledFields.filter((field) => field !== "").length /
        filledFields.length) *
      100;
    setProfileCompletion(completeness);
  }, [username, gmail, bio, firstname, lastname]);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  };

  const saveProfileData = () => {
    const profileData = {
      profileImage,
      username,
      gmail,
      bio,
      firstname,
      lastname,
    };
    localStorage.setItem("profileData", JSON.stringify(profileData));
    setShowPopup(true); // Show the popup after saving
  };

  const logout = () => {
    removeCookie("token", { path: "/" });
    // Redirect to login page
    window.location.href = "/login"; // Replace "/login" with the actual login page route
  };

  const onLogin = () => {
    // Clear previous user data
    setProfileImage(null);
    setUsername("");
    setGmail("");
    setBio("");
    setFirstname("");
    setLastname("");
    setProfileCompletion(0);
    // Clear data from localStorage
    localStorage.removeItem("profileData");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-purple-300">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="relative flex justify-center items-center">
          <Avatar />
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <label htmlFor="username" className="font-semibold w-20">
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            readOnly
            className="border rounded-md px-4 py-2 focus:outline-none flex-1 cursor-not-allowed"
          />
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <label htmlFor="email" className="font-semibold w-20">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            readOnly
            className="border rounded-md px-4 py-2 focus:outline-none flex-1 cursor-not-allowed"
          />
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <label htmlFor="bio" className="font-semibold w-20">
            Bio:
          </label>
          <textarea
            id="bio"
            placeholder="Tell something about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none flex-1"
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <label htmlFor="firstname" className="font-semibold w-20">
            Firstname:
          </label>
          <input
            id="firstname"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            readOnly
            className="border rounded-md px-4 py-2 focus:outline-none flex-1 cursor-not-allowed"
          />
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <label htmlFor="lastname" className="font-semibold w-20">
            Lastname:
          </label>
          <input
            id="lastname"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            readOnly
            className="border rounded-md px-4 py-2 focus:outline-none flex-1 cursor-not-allowed"
          />
        </div>
        <div className="w-full mt-4 text-center">
          <p className="text-sm text-gray-600">
            You can add a short bio to let others know about you!
          </p>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mr-4">
            {Math.round(profileCompletion)}%
          </div>
          <div>
            <div className="text-sm">Profile Completeness</div>
            <div className="text-xs text-gray-600">Based on filled fields</div>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={saveProfileData}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            Save Changes
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            Logout
          </button>
        </div>
        <div className="mt-4 text-md text-gray-600">
          Your data will be saved automatically
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-xl font-semibold text-center text-purple-500">
              Profile data saved successfully!
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md mt-4 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
