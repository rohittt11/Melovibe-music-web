import { useState } from "react";
import { Icon } from "@iconify/react";

const PasswordInput = ({ label, placeholder, value, setValue }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="textInputDiv flex flex-col space-y-2 w-full">
      <label for={label} className="font-semibold">
        {label}
      </label>
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="p-3 pr-12 border border-gray-400 border-solid rounded placeholder-gray-500 w-full"
          id={label}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          <Icon
            icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
            fontSize={20}
          />
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
