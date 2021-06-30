import { useState, useEffect } from "react";
import ManualTimings from "../ManualTimings/ManualTimings";
import DefaultTimings from "../DefaultTimings/DefaultTimings";
import "./alltimings.css";

const AllTimings = ({
  state,
  index,
  onManualTimeChange,
  onDefaultTimeChange,
  isShop,
  addMoreTimingsFields,
  onRemoveTimingsField,
  mallTime,
  edit,
  isModal = false,
}) => {
  const [showManualTimings, setShowManualTimings] = useState(false);
  const [days, setDays] = useState([
    { label: "", id: 8 },
    { label: "Sunday", id: 7 },
    { label: "Monday", id: 1 },
    { label: "Tuesday", id: 2 },
    { label: "Wednesday", id: 3 },
    { label: "Thursday", id: 4 },
    { label: "Friday", id: 5 },
    { label: "Saturday", id: 6 },
  ]);

  useEffect(() => {
    setShowManualTimings(
      state.timings.every((time) => time.hasOwnProperty("openTime")) &&
        state.timings.length > 1
    );
  }, []);

  let isEveryDayChecked =
    state.timings.length === 1 ||
    state.timings.every((time) => !time.hasOwnProperty("openTime"));

  return (
    <div className="timingsform">
      <div
        className="input__radio"
        style={(isModal && { width: "50%" }) || (isShop && { width: "35%" })}
      >
        <div>
          <input
            type="radio"
            id="every day"
            value="every day"
            name={isShop ? `shopTimings${index}` : "mallTimings"}
            onChange={() => setShowManualTimings(false)}
            defaultChecked={isEveryDayChecked}
          />
          <label htmlFor="every day">Every Day</label>
        </div>
        <div>
          <input
            type="radio"
            id="manual"
            value="manual timing"
            name={isShop ? `shopTimings${index}` : "mallTimings"}
            onChange={() => setShowManualTimings(true)}
            defaultChecked={!isEveryDayChecked}
          />
          <label htmlFor="manual ">Manual Timing</label>
        </div>
      </div>
      {showManualTimings ? (
        <>
          {state?.timings?.map((time, index) => (
            <ManualTimings
              key={time?.id}
              time={time}
              timings={state?.timings}
              setOpenTime={(value) =>
                onManualTimeChange(time.id, "openTime", value)
              }
              setCloseTime={(value) =>
                onManualTimeChange(time.id, "closeTime", value)
              }
              days={time.id === 1 ? [{ label: "Everyday", id: 1 }] : days}
              setDays={(e) => {
                onManualTimeChange(time.id, "label", e.target.value);
              }}
              isShop={isShop}
              isModal={isModal}
              onRemoveTimingsField={() => onRemoveTimingsField(time.id)}
              mallTime={
                mallTime?.length > 1
                  ? mallTime[index]
                  : typeof mallTime !== "undefined"
                  ? mallTime[0]
                  : null
              }
            />
          ))}
        </>
      ) : (
        <DefaultTimings
          timing={state?.timings[0]}
          setOpenTime={(value) => onDefaultTimeChange("openTime", value)}
          setCloseTime={(value) => onDefaultTimeChange("closeTime", value)}
          isShop={isShop}
          isModal={isModal}
          showRemove={showManualTimings}
          minTime={typeof mallTime !== "undefined" && mallTime[0].openTime}
          maxTime={typeof mallTime !== "undefined" && mallTime[0].closeTime}
        />
      )}
      {showManualTimings && (
        <p className="button__showmore" onClick={addMoreTimingsFields}>
          Show More Timing +
        </p>
      )}
      {/* {state.mallTimeError && (
        <p className="error">* Please fill the day and time field</p>
      )} */}
    </div>
  );
};

export default AllTimings;
