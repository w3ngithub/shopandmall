import TimePicker from "react-time-picker";
import "./defaulttiming.css";

const DefaultTimings = ({
  timing,
  setOpenTime,
  setCloseTime,
  isModal = false,
  isShop,
  onRemoveTimingsField,
  showRemove = true,
  minTime,
  maxTime,
}) => {
  return (
    <div
      className="timings"
      style={(isModal && { width: "80%" }) || (isShop && { width: "60%" })}
    >
      <div className="timings__buttondiv">
        <div className="timeinput">
          <label>Open Time:</label>
          <br />
          <TimePicker
            value={timing?.openTime}
            onChange={setOpenTime}
            clearIcon={null}
            clockIcon="Clock"
            renderNumbers={true}
            minuteHandWidth={4}
            minuteHandLength={60}
            hourHandLength={40}
            minTime={minTime}
          />
        </div>
        <div className="timeinput">
          <label>Close Time:</label>
          <br />
          <TimePicker
            value={timing?.closeTime}
            onChange={setCloseTime}
            clearIcon={null}
            clockIcon="Clock"
            renderNumbers={true}
            minuteHandWidth={4}
            minuteHandLength={60}
            hourHandLength={40}
            maxTime={maxTime}
          />
        </div>
      </div>
      {showRemove && timing.label !== "Everyday" && (
        <p className="remove" onClick={onRemoveTimingsField}>
          Remove
        </p>
      )}
    </div>
  );
};

export default DefaultTimings;
