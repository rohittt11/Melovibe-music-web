import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Avatar from "../containers/avatar";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import {
  makeAuthenticatedGETRequest,
  makeAuthenticatedPUTRequest,
} from "../utils/serverHelpers";

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [gmail, setGmail] = useState("");
  const [bio, setBio] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("artist"); // NEW
  const [profileCompletion, setProfileCompletion] = useState(0);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password modal state
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const navigate = useNavigate();

  /* ---- Load profile from DB ---- */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await makeAuthenticatedGETRequest("/auth/me");
        setProfileImage(user.profileImage || null);
        setUsername(user.username || "");
        setGmail(user.email || "");
        setBio(user.bio || "");
        setFirstname(user.firstname || "");
        setLastname(user.lastname || "");
        setRole(user.role || "artist"); // NEW
      } catch (err) {
        console.error("Failed to load profile:", err);
        const storedData = JSON.parse(localStorage.getItem("profileData"));
        if (storedData) {
          setProfileImage(storedData.profileImage || null);
          setUsername(storedData.username || "");
          setGmail(storedData.gmail || "");
          setBio(storedData.bio || "");
          setFirstname(storedData.firstname || "");
          setLastname(storedData.lastname || "");
          setRole(storedData.role || "artist"); // NEW
        }
      }
    };
    loadProfile();
  }, [cookies.token]);

  /* ---- Completion % ---- */
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
    reader.onloadend = () => setProfileImage(reader.result);
    if (imageFile) reader.readAsDataURL(imageFile);
  };

  /* ---- Save profile to DB ---- */
  const saveProfileData = async () => {
    try {
      setSavingProfile(true);
      const updated = await makeAuthenticatedPUTRequest("/auth/profile", {
        firstname,
        lastname,
        username,
        bio,
        profileImage,
      });

      localStorage.setItem(
        "profileData",
        JSON.stringify({
          gmail,
          username: updated.username,
          firstname: updated.firstname,
          lastname: updated.lastname,
          bio: updated.bio,
          profileImage: updated.profileImage,
          role: updated.role || role, // NEW
        })
      );

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.err || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  /* ---- Change password ---- */
  const submitPassword = async () => {
    setPwError("");
    setPwSuccess("");

    if (pwNew !== pwConfirm) {
      setPwError("New passwords do not match");
      return;
    }
    if (pwNew.length < 8) {
      setPwError("Password must be at least 8 characters");
      return;
    }

    try {
      setSavingPw(true);
      await makeAuthenticatedPUTRequest("/auth/change-password", {
        currentPassword: pwCurrent,
        newPassword: pwNew,
        confirmPassword: pwConfirm,
      });

      setPwSuccess("Password updated successfully");
      setPwCurrent("");
      setPwNew("");
      setPwConfirm("");

      setTimeout(() => {
        setShowPasswordModal(false);
        setPwSuccess("");
      }, 1500);
    } catch (err) {
      setPwError(err?.response?.data?.err || "Failed to change password");
    } finally {
      setSavingPw(false);
    }
  };

  const logout = () => {
    removeCookie("token", { path: "/" });
    localStorage.removeItem("profileData");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen w-full bg-app-black overflow-x-hidden">
      <div className="h-32 md:h-44 w-full bg-gradient-to-b from-purple-800/60 via-purple-900/30 to-app-black" />

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-20 md:-mt-24 pb-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-3 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 w-fit"
          aria-label="Go back"
        >
          <Icon icon="mdi:arrow-left" fontSize={22} />
          <span className="text-sm font-semibold">Enjoy the music</span>
        </button>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-5 md:p-8 text-gray-900">
          {/* Header */}
          <div className="flex flex-col items-center md:flex-row md:items-end gap-4 md:gap-6 pb-6 border-b border-gray-200">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center ring-4 ring-white">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Avatar />
                )}
              </div>
              <label
                htmlFor="profileImage"
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white"
              >
                <Icon icon="mdi:camera" fontSize={26} />
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center md:text-left min-w-0">
              {/* Name row with ADMIN badge */}
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <div className="text-xl md:text-3xl font-bold truncate text-gray-900">
                  {firstname || lastname
                    ? `${firstname} ${lastname}`.trim()
                    : "Your Name"}
                </div>
                {role === "admin" && (
                  <span className="inline-flex items-center gap-1 bg-purple-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full uppercase tracking-wider">
                    <Icon icon="mdi:shield-crown" fontSize={12} />
                    Admin
                  </span>
                )}
              </div>
              <div className="text-gray-500 text-sm truncate mt-1">
                @{username || "username"}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-full border border-purple-100">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#e9d5ff"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="4"
                    strokeDasharray={`${(profileCompletion / 100) * 94.2} 94.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-purple-700">
                  {Math.round(profileCompletion)}%
                </span>
              </div>
              <div className="text-xs text-purple-800 leading-tight">
                Profile
                <br />
                complete
              </div>
            </div>
          </div>

          {/* Admin Panel shortcut — only for admins */}
          {role === "admin" && (
            <div className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Icon
                  icon="mdi:shield-crown"
                  className="text-white"
                  fontSize={28}
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="text-white font-bold text-sm md:text-base">
                  Admin Access
                </div>
                <div className="text-purple-100 text-xs md:text-sm">
                  View all contracts, manage songs, terminate agreements.
                </div>
              </div>
              <button
                onClick={() => navigate("/admin")}
                className="bg-white text-purple-700 hover:bg-purple-50 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:arrow-right-circle" fontSize={18} />
                Open Admin Panel
              </button>
            </div>
          )}

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Field
              label="First name"
              icon="mdi:account"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Enter your first name"
            />
            <Field
              label="Last name"
              icon="mdi:account-outline"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Enter your last name"
            />
            <Field
              label="Username"
              icon="mdi:at"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
            <Field
              label="Email"
              icon="mdi:email-outline"
              value={gmail}
              onChange={() => {}}
              placeholder="your@email.com"
              readOnly
            />
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-2">
                <Icon icon="mdi:text-account" fontSize={16} />
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell something about yourself..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 flex-wrap">
            <button
              onClick={saveProfileData}
              disabled={savingProfile}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-full transition-colors"
            >
              <Icon icon="mdi:content-save" fontSize={20} />
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold px-5 py-3 rounded-full transition-colors"
            >
              <Icon icon="mdi:lock-reset" fontSize={20} />
              Change Password
            </button>
            <button
              onClick={logout}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-transparent border border-red-300 text-red-500 hover:bg-red-50 font-semibold px-5 py-3 rounded-full transition-colors"
            >
              <Icon icon="mdi:logout" fontSize={20} />
              Logout
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 mt-4">
            Your profile is saved securely to the server.
          </div>
        </div>
      </div>

      {/* ============ SUCCESS POPUP ============ */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Icon
                icon="mdi:check-circle"
                className="text-purple-600"
                fontSize={40}
              />
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">
              Profile saved!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your changes have been saved to the server.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ============ CHANGE PASSWORD MODAL ============ */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:shield-lock"
                  className="text-purple-600"
                  fontSize={26}
                />
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Change Password
                </h2>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <Icon icon="mdi:close" fontSize={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 block">
                  Current Password
                </label>
                <input
                  type="password"
                  value={pwCurrent}
                  onChange={(e) => setPwCurrent(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-gray-50 border border-gray-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 block">
                  New Password
                </label>
                <input
                  type="password"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                  placeholder="At least 8 chars, letters + numbers"
                  className="w-full bg-gray-50 border border-gray-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-gray-50 border border-gray-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none"
                />
              </div>

              {pwError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
                  <Icon
                    icon="mdi:alert-circle"
                    fontSize={18}
                    className="shrink-0 mt-0.5"
                  />
                  {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-start gap-2">
                  <Icon
                    icon="mdi:check-circle"
                    fontSize={18}
                    className="shrink-0 mt-0.5"
                  />
                  {pwSuccess}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitPassword}
                disabled={savingPw}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-full transition-colors"
              >
                {savingPw ? "Saving..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============ Field ============ */
const Field = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
}) => (
  <div>
    <label className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-2">
      <Icon icon={icon} fontSize={16} />
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
        readOnly
          ? "cursor-not-allowed text-gray-500"
          : "focus:border-purple-500 focus:bg-white"
      }`}
    />
  </div>
);

export default Profile;
