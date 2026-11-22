import { useState } from "react";
import { useCookies } from "react-cookie";
import TextInput from "../components/shared/TextInput";
import PasswordInput from "../components/shared/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { makeUnauthenticatedPOSTRequest } from "../utils/serverHelpers";
import MelodiVibewhite from "../assets/images/MelodiVibewhite1.png";

const SignupComponent = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const signUp = async () => {
    if (email !== confirmEmail) {
      alert("Email and confirm email fields must match. Please check again");
      return;
    }
    const data = { email, password, username, firstname, lastname };
    const response = await makeUnauthenticatedPOSTRequest(
      "/auth/register",
      data
    );
    if (response && !response.err) {
      const token = response.token;
      const date = new Date();
      date.setDate(date.getDate() + 0.5);
      setCookie("token", token, { path: "/", expires: date });
      alert("Success");
      navigate("/login");
    } else {
      alert("Failure");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center overflow-x-hidden">
      <div className="logo p-5 border-b border-solid border-gray-300 w-full flex justify-center">
        <img
          src={MelodiVibewhite}
          alt="MeloVibe logo"
          className="w-40 sm:w-56 md:w-72 h-auto object-contain"
        />
      </div>

      <div className="w-full max-w-md px-4 sm:px-6 py-10 flex items-center justify-center flex-col">
        <div className="font-bold mb-4 text-center text-lg sm:text-xl md:text-2xl">
          Sign up for free to start listening.
        </div>

        <div className="w-full">
          <div className="flex-1">
            <TextInput
              label="First Name"
              placeholder="Enter Your First Name"
              className="my-4 md:my-6"
              value={firstname}
              setValue={setFirstName}
            />
          </div>
          <div className="flex-1">
            <TextInput
              label="Last Name"
              placeholder="Enter Your Last Name"
              className="my-4 md:my-6"
              value={lastname}
              setValue={setLastName}
            />
          </div>
          <TextInput
            label="Email address"
            placeholder="Enter your email"
            className="my-4 md:my-6"
            value={email}
            setValue={setEmail}
          />
          <TextInput
            label="Confirm Email Address"
            placeholder="Enter your email again"
            className="mb-4 md:mb-6"
            value={confirmEmail}
            setValue={setConfirmEmail}
          />
          <TextInput
            label="Username"
            placeholder="Enter your username"
            className="mb-4 md:mb-6"
            value={username}
            setValue={setUsername}
          />
          <PasswordInput
            label="Create Password"
            placeholder="Enter a strong password here"
            value={password}
            setValue={setPassword}
          />
        </div>

        <div className="w-full flex items-center justify-center my-6 md:my-8">
          <button
            className="cursor-pointer text-white hover:text-black font-semibold p-3 px-10 rounded-full bg-purple-500 w-full sm:w-auto"
            onClick={(e) => {
              e.preventDefault();
              signUp();
            }}
          >
            Sign Up
          </button>
        </div>

        <div className="w-full border border-solid border-gray-300"></div>

        <div className="my-6 font-semibold text-lg text-center">
          Already have an account?
        </div>

        <div className="border border-gray-500 text-gray-500 w-full flex items-center justify-center py-3 md:py-4 rounded-full font-bold">
          <Link to="/login">LOG IN INSTEAD</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
