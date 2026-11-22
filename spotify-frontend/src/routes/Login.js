import { useState } from "react";
import TextInput from "../components/shared/TextInput";
import PasswordInput from "../components/shared/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { makeUnauthenticatedPOSTRequest } from "../utils/serverHelpers";
import { useCookies } from "react-cookie";
import MelodiVibewhite from "../assets/images/MelodiVibewhite1.png";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const login = async () => {
    const data = { email, password };
    const response = await makeUnauthenticatedPOSTRequest("/auth/login", data);
    if (response && !response.err) {
      const token = response.token;
      const date = new Date();
      date.setDate(date.getDate() + 30);
      localStorage.setItem(
        "profileData",
        JSON.stringify({
          gmail: response["email"],
          username: response["username"],
          firstname: response["firstname"],
          lastname: response["lastname"],
        })
      );
      setCookie("token", token, { path: "/", expires: date });
      alert("Welcome to MeloVibe Music..!");
      navigate("/");
    } else {
      alert("Password is not matching :( ");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-white">
      {/* Logo header */}
      <div className="logo py-4 px-4 border-b border-solid border-gray-400 w-full flex justify-center">
        <img
          src={MelodiVibewhite}
          alt="MeloVibe logo"
          className="w-40 sm:w-56 md:w-72 h-auto object-contain"
        />
      </div>

      {/* Form area */}
      <div className="inputRegion w-full max-w-md px-4 sm:px-6 py-6 sm:py-10 flex items-center justify-center flex-col">
        <div className="font-bold mb-4 text-center text-sm sm:text-base">
          To continue, log in to MeloVibe.
        </div>

        <div className="w-full">
          <TextInput
            label="Email address or username"
            placeholder="Email address or username"
            className="my-4 sm:my-6"
            value={email}
            setValue={setEmail}
          />
        </div>

        <div className="w-full">
          <PasswordInput
            label="Password"
            placeholder="Password"
            value={password}
            setValue={setPassword}
          />
        </div>

        <div className="w-full flex items-center justify-center my-6 sm:my-8">
          <button
            className="cursor-pointer text-white hover:text-black font-semibold p-3 px-8 sm:px-10 rounded-full bg-purple-500 w-full"
            onClick={(e) => {
              e.preventDefault();
              login();
            }}
          >
            LOG IN
          </button>
        </div>

        <div className="w-full border border-solid border-gray-300"></div>

        <div className="my-4 sm:my-6 font-semibold text-base sm:text-lg text-center">
          Don't have an account?
        </div>

        <div className="border border-gray-500 text-gray-500 w-full flex items-center justify-center py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base">
          <Link to="/signup" className="px-2 text-center">
            SIGN UP FOR MeloVibe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
