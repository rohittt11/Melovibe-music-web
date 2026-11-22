import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const IconText = ({
  iconName,
  displayText,
  active,
  targetLink,
  onClick,
  compact = false,
  onNavigate,
}) => {
  const handleClick = () => {
    onClick && onClick();
    onNavigate && onNavigate();
  };

  const inner = (
    <div
      className={`flex items-center my-1 ${
        compact ? "justify-center" : "justify-start"
      } cursor-pointer transition-all duration-200 rounded-xl mx-2
      ${
        active
          ? "bg-gray-900 text-white shadow-md"
          : "bg-transparent text-white hover:bg-gray-900 hover:text-white"
      }`}
      onClick={handleClick}
      title={
        compact && typeof displayText === "string" ? displayText : undefined
      }
    >
      <div className={`${compact ? "px-2 py-3" : "px-4 py-3"} shrink-0`}>
        <Icon
          icon={iconName}
          color={active ? "white" : "currentColor"}
          fontSize={compact ? 24 : 26}
        />
      </div>
      {!compact && displayText && (
        <div
          className={`text-sm font-semibold truncate pr-4 ${
            active ? "text-white" : "text-inherit"
          }`}
        >
          {displayText}
        </div>
      )}
    </div>
  );

  if (!targetLink) {
    return inner;
  }

  return (
    <Link to={targetLink} className="block">
      {inner}
    </Link>
  );
};

export default IconText;
