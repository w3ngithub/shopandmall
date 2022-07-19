import "./manualtimings.css";
import DefaultTimings from "../DefaultTimings/DefaultTimings";

const ManualTimings = ({
  time,
  timings,
  setOpenTime,
  setCloseTime,
  days,
  setDays,
  isModal,
  isShop,
  mallTime,
  onRemoveTimingsField,
}) => {
  let filterDays = [];
  let filterTime = timings.filter((t) => t.id !== time.id);

  days.forEach((day) => {
    if (filterTime.filter((time) => time.label === day.label).length === 0) {
      filterDays.push(
        <option key={day.id} value={day.label}>
          {day.label}
        </option>
      );
    }
  });

  return (
    <div className="timings__manualdiv">
      <div className="dayinputfield">
        <label htmlFor="days">Days:</label>
        <br />
        <select id="days" onChange={setDays} value={time.label}>
          {filterDays}
        </select>
      </div>
      <DefaultTimings
        timing={time}
        timings={timings}
        setOpenTime={setOpenTime}
        setCloseTime={setCloseTime}
        isShop={isShop}
        isModal={isModal}
        onRemoveTimingsField={onRemoveTimingsField}
        minTime={mallTime?.openTime ?? "6:00"}
        maxTime={mallTime?.closeTime ?? "23:00"}
        mallTime={mallTime}
        // minTime={typeof mallTime !== "undefined" ? mallTime : "06:00"}
        // maxTime={typeof mallTime !== "undefined" ? mallTime : "23:00"}
      />
    </div>
  );
};

export default ManualTimings;
