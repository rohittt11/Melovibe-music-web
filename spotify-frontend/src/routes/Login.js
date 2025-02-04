import { useState } from "react";
// import { Icon } from "@iconify/react";
import TextInput from "../components/shared/TextInput";
import PasswordInput from "../components/shared/PasswordInput";
import { Link, json, useNavigate } from "react-router-dom";
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
      console.log("response :", response);
      const token = response.token;
      const date = new Date();
      date.setDate(date.getDate() + 1);
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
    <div className="w-full h-full flex flex-col items-center">
      <div className="logo p-5 border-b border-solid border-gray-400 w-full  flex justify-center">
        {/* <Icon icon="logos:spotify" width="150" /> */}
        <img
          src={MelodiVibewhite}
          alt="MeloVibe logo"
          width={300}
          height={200}
        />
      </div>
      <div className="inputRegion w-1/3 py-10 flex items-center justify-center flex-col">
        {/*  I will have my 2 inputs(email and password) and I will have my sign up instead button*/}
        <div className="font-bold mb-4">To continue, log in to MeloVibe.</div>
        <TextInput
          label="Email address or username"
          placeholder="Email address or username"
          className="my-6"
          value={email}
          setValue={setEmail}
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          value={password}
          setValue={setPassword}
        />
        <div className=" w-full flex items-center justify-end my-8">
          <button
            className="cursor-pointer text-white hover:text-black font-semibold p-3 px-10 rounded-full bg-purple-500"
            onClick={(e) => {
              e.preventDefault();
              login();
            }}
          >
            LOG IN
          </button>
        </div>
        <div className="w-full border border-solid border-gray-300"></div>
        <div className="my-6 font-semibold text-lg">Don't have an account?</div>
        <div className="border border-gray-500 text-gray-500 w-full flex items-center justify-center py-4 rounded-full font-bold">
          <Link to="/signup">SIGN UP FOR MeloVibe</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
