import * as React from "react";
const LogoComponent = (props) => (
  <svg
    viewBox="0 0 160 36"
    width={150}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <style>
        {
          "\n      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&display=swap');\n    "
        }
      </style>
    </defs>
    <text
      x={0}
      y={27}
      fontFamily="'Playfair Display', Georgia, serif"
      fontSize={28}
      fontWeight={400}
      letterSpacing="-0.5px"
      fill="#1A1208"
    >
      {"together"}
    </text>
    <text
      x={105}
      y={27}
      fontFamily="'Playfair Display', Georgia, serif"
      fontSize={28}
      fontWeight={400}
      fill="#D4845A"
    >
      {"."}
    </text>
  </svg>
);
export default LogoComponent;
