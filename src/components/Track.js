import PropTypes from "prop-types";
import React from "react";

const getTrackConfig = ({ source, target, error }) => {
  const basicStyle = {
    left: `${source.percent}%`,
    width: `calc(${target.percent - source.percent}% - 1px)`,
    borderRadius: "16px",
    // filter: "blur(16px)",
    border: `2px solid ${error ? "#EF4444" : "#10B981"}`,
    height: "38px",
  };

  const coloredTrackStyle = {
    // filter: "blur(0)",
  };

  return { ...basicStyle, ...coloredTrackStyle };
};

const Track = ({ source, target, getTrackProps, error }) => (
  <div
    className="react_time_range__track"
    style={getTrackConfig({
      source,
      target,
      error,
    })}
    {...getTrackProps()}
  />
);

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
  error: PropTypes.bool.isRequired,
};

Track.defaultProps = {};

export default Track;
