import PropTypes from "prop-types";
import React, { useState } from "react";
import "./tooltip.scss";

const Handle = ({
  domain: [min, max],
  handle: { id, value, percent = 0 },
  formatTooltip,
  getHandleProps,
  isActive,
  showTooltip,
  borderColor,
}) => {
  const leftPosition = `${percent}%`;
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <>
      {(mouseOver || isActive) && showTooltip ? (
        <div
          style={{
            left: `${percent}%`,
            position: "absolute",
            marginLeft: id === "$$-0" ? "-2px" : "-6px",
            marginTop: "-35px",
          }}
        >
          <div className="tooltip">
            <span className="tooltiptext">
              {formatTooltip(value)}{" "}
              <span style={{ opacity: 0.5 }}>{formatTooltip(max)}</span>
            </span>
          </div>
        </div>
      ) : null}
      <div
        className="react_time_range__handle_wrapper"
        style={{ left: leftPosition }}
        {...getHandleProps(id, {
          onMouseEnter: () => setMouseOver(true),
          onMouseLeave: () => setMouseOver(false),
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="react_time_range__handle_container"
        style={{
          left: `calc(${leftPosition} ${id === "$$-0" ? "+" : "-"} 2px)`,
          backgroundColor: borderColor,
        }}
      >
        <div className="react_time_range__handle_marker" />
      </div>
    </>
  );
};

Handle.propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
  style: PropTypes.object,
  formatTooltip: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  showTooltip: PropTypes.bool.isRequired,
  borderColor: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

Handle.defaultProps = {};

export default Handle;
