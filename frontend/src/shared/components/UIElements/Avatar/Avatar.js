import React from "react";
import RenderSmoothImage from "render-smooth-image-react";
import "render-smooth-image-react/build/style.css";

import "./Avatar.scss";

const Avatar = (props) => {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <RenderSmoothImage src={props.image} alt={props.alt} />
      {/* <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      /> */}
    </div>
  );
};

export default Avatar;
