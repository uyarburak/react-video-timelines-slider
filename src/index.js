import React from "react";
import PropTypes from "prop-types";
import { scaleTime } from "d3-scale";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { differenceInMilliseconds } from "date-fns";

import SliderRail from "./components/SliderRail";
import Track from "./components/Track";
import Handle from "./components/Handle";

import "./styles/index.scss";

class TimeRange extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      disabled: true,
    };

    // Bind event handlers (if necessary)
    this.setDisabled = this.setDisabled.bind(this);
  }

  setDisabled = (disabled) => {
    this.setState({ disabled });
  };

  onChange = (newTime) => {
    const formattedNewTime = newTime.map((t) => new Date(t));
    this.props.onChangeCallback(formattedNewTime);
  };

  setPercentage = (percentage) => {
    const { selectedInterval } = this.props;
    if (selectedInterval.length === 1) {
      if (typeof selectedInterval[0] === "object") {
        this.props.setNow(new Date(selectedInterval[0].getTime() * percentage));
      } else {
        this.props.setNow(new Date(selectedInterval[0] * percentage));
      }
    } else {
      if (typeof selectedInterval[0] === "object") {
        const diff =
          selectedInterval[1].getTime() - selectedInterval[0].getTime();
        this.props.setNow(
          new Date(selectedInterval[0].getTime() + diff * percentage)
        );
      } else {
        const diff = selectedInterval[1] - selectedInterval[0];
        this.props.setNow(new Date(selectedInterval[0] + diff * percentage));
      }
    }
  };

  checkIsSelectedIntervalNotValid = ([start, end], source, target) => {
    const { value: startInterval } = source;
    const { value: endInterval } = target;

    if (
      (startInterval > start && endInterval <= end) ||
      (startInterval >= start && endInterval < end)
    )
      return true;
    if (start >= startInterval && end <= endInterval) return true;

    const isStartInBlockedInterval =
      start > startInterval && start < endInterval && end >= endInterval;
    const isEndInBlockedInterval =
      end < endInterval && end > startInterval && start <= startInterval;

    return isStartInBlockedInterval || isEndInBlockedInterval;
  };

  onUpdate = (newTime) => {
    const { onUpdateCallback } = this.props;
    const disabledIntervals = this.disabledIntervals;

    if (disabledIntervals?.length) {
      const isValuesNotValid = disabledIntervals.some(({ source, target }) =>
        this.checkIsSelectedIntervalNotValid(newTime, source, target)
      );
      const formattedNewTime = newTime.map((t) => new Date(t));
      onUpdateCallback({ error: isValuesNotValid, time: formattedNewTime });
      return;
    }

    const formattedNewTime = newTime.map((t) => new Date(t));
    onUpdateCallback({ error: false, time: formattedNewTime });
  };

  getDateTicks = () => {
    const { timelineInterval, ticksNumber } = this.props;
    const ticks = scaleTime()
      .domain(timelineInterval)
      .ticks(ticksNumber - 2)
      .map((t) => +t);

    return [
      timelineInterval[0].getTime(),
      ...ticks,
      timelineInterval[1].getTime(),
    ];
  };

  render() {
    const {
      sliderRailClassName,
      timelineInterval,
      selectedInterval,
      containerClassName,
      step,
      showNow,
      formatTick,
      formatTooltip,
      mode,
      showTooltip,
      now,
      snapshots,
      borderColor,
    } = this.props;

    const domain = timelineInterval.map((t) => Number(t));

    const timelineLength = differenceInMilliseconds(
      timelineInterval[1],
      timelineInterval[0]
    );
    const percent =
      (differenceInMilliseconds(now, timelineInterval[0]) / timelineLength) *
      100;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    return (
      <div
        className={
          containerClassName || "react_time_range__time_range_container"
        }
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="ticks-container">
            <Ticks values={this.getDateTicks()}>
              {({ ticks }) => (
                <>
                  {ticks.map((tick, index) => (
                    <React.Fragment key={`${tick}_${index}`}>
                      <div className="react_time_range__tick_label" style={{}}>
                        {formatTick(tick.value)}
                      </div>
                      {index < ticks.length - 1 && (
                        <>
                          <svg
                            width="3"
                            height="2"
                            viewBox="0 0 3 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.799805"
                              width="2"
                              height="2"
                              rx="1"
                              fill="white"
                              fillOpacity="0.6"
                            />
                          </svg>
                          <svg
                            width="3"
                            height="2"
                            viewBox="0 0 3 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.799805"
                              width="2"
                              height="2"
                              rx="1"
                              fill="white"
                              fillOpacity="0.6"
                            />
                          </svg>
                          <svg
                            width="3"
                            height="2"
                            viewBox="0 0 3 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.799805"
                              width="2"
                              height="2"
                              rx="1"
                              fill="white"
                              fillOpacity="0.6"
                            />
                          </svg>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </>
              )}
            </Ticks>
          </div>
          <Slider
            mode={mode}
            step={step}
            domain={domain}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
            values={selectedInterval.map((t) => +t)}
            rootStyle={{
              position: "relative",
              width: "100%",
              marginTop: "38px",
            }}
            disabled={!isTouchDevice && this.state.disabled}
          >
            <Rail>
              {({ getRailProps, getEventData, activeHandleID }) => (
                <SliderRail
                  className={sliderRailClassName}
                  activeHandleID={activeHandleID}
                  getRailProps={getRailProps}
                  getEventData={getEventData}
                  formatTooltip={formatTooltip}
                  showTooltip={showTooltip}
                  totalDuration={timelineInterval[1]}
                  snapshots={snapshots}
                />
              )}
            </Rail>

            <Handles>
              {({ handles, getHandleProps, activeHandleID }) => (
                <>
                  {handles.map((handle) => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      domain={domain}
                      getHandleProps={getHandleProps}
                      formatTooltip={formatTooltip}
                      isActive={handle.id === activeHandleID}
                      showTooltip={showTooltip}
                      borderColor={borderColor}
                      onMouseEnter={() => this.setDisabled(false)}
                      onMouseLeave={() => this.setDisabled(true)}
                    />
                  ))}
                  {handles.length > 1 &&
                    handles.map((handle, index) => (
                      <div
                        key={handle.id}
                        style={{
                          left: index === 0 ? 0 : undefined,
                          right: index === 0 ? undefined : 0,
                          top: "-20px",
                          width:
                            index === 0
                              ? `calc(${handle.percent}% + 6px)`
                              : `calc(${100 - handle.percent}% + 4px)`,
                          backdropFilter: "blur(2px)",
                          WebkitBackdropFilter: "blur(2px)",
                          background: "#FFFFFF1A",
                          height: "40px",
                          position: "absolute",
                          zIndex: 1,
                          borderRadius:
                            index === 0 ? "16px 0 0 16px" : "0 16px 16px 0",
                          pointerEvents: "none",
                        }}
                      ></div>
                    ))}
                </>
              )}
            </Handles>

            <Tracks left={false} right={false}>
              {({ tracks, getTrackProps }) => (
                <>
                  {tracks?.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                      borderColor={borderColor}
                      setPercentage={this.setPercentage}
                      isTouchDevice={isTouchDevice}
                    />
                  ))}
                </>
              )}
            </Tracks>

            {showNow && (
              <>
                <div
                  style={{
                    left: `${percent}%`,
                    position: "absolute",
                    marginLeft: "-2px",
                    marginTop: "-35px",
                  }}
                >
                  <div className="tooltip">
                    <span className="tooltiptext">
                      {formatTooltip(now)}{" "}
                      <span style={{ opacity: 0.5 }}>
                        {formatTooltip(timelineInterval[1])}
                      </span>
                    </span>
                  </div>
                </div>
                <div
                  className="now"
                  style={{
                    left: `${percent}%`,
                  }}
                />
              </>
            )}
          </Slider>
        </div>
      </div>
    );
  }
}

TimeRange.propTypes = {
  ticksNumber: PropTypes.number.isRequired,
  selectedInterval: PropTypes.arrayOf(PropTypes.object),
  timelineInterval: PropTypes.arrayOf(PropTypes.object),
  disabledIntervals: PropTypes.arrayOf(PropTypes.object),
  containerClassName: PropTypes.string,
  sliderRailClassName: PropTypes.string,
  step: PropTypes.number,
  formatTick: PropTypes.func,
  formatTooltip: PropTypes.func,
  showTooltip: PropTypes.bool,
  now: PropTypes.object,
  snapshots: PropTypes.arrayOf(PropTypes.string),
  borderColor: PropTypes.string,
  setNow: PropTypes.func,
};

export default TimeRange;
