import TimePicker from "react-time-picker";
import "./defaulttiming.css";
import { AiFillCloseCircle } from "react-icons/ai";

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
    <div className="timings" style={(isModal && { width: "100%" }) || null}>
      <div className="timings__buttondiv">
        <div className="timeinput">
          <label>Open Time:</label>
          <br />
          <div className="desktopTime">
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
          <div className="mobileTime">
            <TimePicker
              value={timing?.openTime}
              onChange={setOpenTime}
              clearIcon={null}
              clockIcon={false}
              renderNumbers={true}
              minuteHandWidth={4}
              minuteHandLength={60}
              hourHandLength={40}
              minTime={minTime}
            />
          </div>
        </div>
        <div className="timeinput">
          <label>Close Time:</label>
          <br />
          <div className="desktopTime">
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
          <div className="mobileTime">
            <TimePicker
              value={timing?.closeTime}
              onChange={setCloseTime}
              clearIcon={null}
              clockIcon={false}
              renderNumbers={true}
              minuteHandWidth={4}
              minuteHandLength={60}
              hourHandLength={40}
              maxTime={maxTime}
            />
          </div>
        </div>
      </div>
      {showRemove && timing.label !== "Everyday" && (
        <p className="remove" onClick={onRemoveTimingsField}>
          <AiFillCloseCircle />
        </p>
      )}
    </div>
  );
};

export default DefaultTimings;
