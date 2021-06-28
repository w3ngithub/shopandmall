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
        <select id="days" onChange={setDays}>
          {filterDays}
        </select>
      </div>
      <DefaultTimings
        timing={time}
        setOpenTime={setOpenTime}
        setCloseTime={setCloseTime}
        isShop={isShop}
        isModal={isModal}
        onRemoveTimingsField={onRemoveTimingsField}
        minTime={mallTime?.openTime}
        maxTime={mallTime?.closeTime}
      />
    </div>
  );
};

export default ManualTimings;
