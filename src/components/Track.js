import PropTypes from "prop-types";
import React from "react";

const getTrackConfig = ({ source, target, borderColor }) => {
  const basicStyle = {
    left: `${source.percent}%`,
    width: `calc(${target.percent - source.percent}% - 1px)`,
    borderRadius: "16px",
    // filter: "blur(16px)",
    border: `2px solid ${borderColor}`,
    height: "38px",
  };

  const coloredTrackStyle = {
    // filter: "blur(0)",
  };

  return { ...basicStyle, ...coloredTrackStyle };
};

const Track = ({
  source,
  target,
  getTrackProps,
  borderColor,
  setPercentage,
}) => {
  const isTouchDevice =
    !window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches;
  return (
    <div
      className="react_time_range__track"
      style={getTrackConfig({
        source,
        target,
        borderColor,
      })}
      {...getTrackProps()}
      onClick={
        isTouchDevice
          ? undefined
          : (e) => {
              if (e.target.className !== "react_time_range__track") {
                return;
              }
              const target = e.target;
              const targetWidth = target.offsetWidth;
              // Get the bounding rectangle of the target element
              const rect = target.getBoundingClientRect();

              // Calculate the click position relative to the target element
              const clickPosition = e.clientX - rect.left;

              const widthPercentage = clickPosition / targetWidth;
              setPercentage(widthPercentage);
            }
      }
    />
  );
};

Track.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  target: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getTrackProps: PropTypes.func.isRequired,
  borderColor: PropTypes.string.isRequired,
  setPercentage: PropTypes.func.isRequired,
};

export default Track;
