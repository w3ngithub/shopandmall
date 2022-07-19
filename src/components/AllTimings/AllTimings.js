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
  const [checkEveryday, setCheckEveryDay] = useState(true);
  const [checkManualTiming, setCheckManualTiming] = useState(false);

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
    if (edit) {
      if (
        state.timings.length > 1 &&
        state.timings[1].hasOwnProperty("label")
      ) {
        setCheckEveryDay(false);
        setCheckManualTiming(true);
        setShowManualTimings(true);
      } else if (state.timings.length === 1 && showManualTimings) {
        setCheckEveryDay(false);
        setCheckManualTiming(true);
        setShowManualTimings(true);
      } else if (state.timings.length === 1 && !showManualTimings) {
        setCheckEveryDay(true);
        setCheckManualTiming(false);
        setShowManualTimings(false);
      }
    }
  }, [state.timings]);

  const showSpecificTimings = (event) => {
    setShowManualTimings(true);
    setCheckEveryDay(false);
    setCheckManualTiming(true);
  };

  const showDefaultTimings = (event) => {
    setShowManualTimings(false);
    setCheckEveryDay(true);
    setCheckManualTiming(false);
  };

  return (
    <div className="timingsform">
      {`Please note that the ${
        !isShop
          ? "mall cannot open before 6am and should be closed before 11pm."
          : "shop timing has to be under the range of mall timings."
      } `}
      <div className="input__radio">
        <div>
          <input
            type="radio"
            id="every day"
            value="every day"
            name={isShop ? `shopTimings${index}` : "mallTimings"}
            onChange={showDefaultTimings}
            checked={checkEveryday}
          />
          <label htmlFor="every day">Every Day</label>
        </div>
        <div>
          <input
            type="radio"
            id="manual"
            value="manual timing"
            name={isShop ? `shopTimings${index}` : "mallTimings"}
            onChange={showSpecificTimings}
            checked={checkManualTiming}
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
                    ? mallTime[index]
                    : mallTime[0]
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
          minTime={
            typeof mallTime !== "undefined" ? mallTime[0].openTime : "06:00"
          }
          maxTime={
            typeof mallTime !== "undefined" ? mallTime[0].closeTime : "23:00"
          }
        />
      )}
      {showManualTimings && (
        <p className="button__showmore" onClick={addMoreTimingsFields}>
          Show More Timing +
        </p>
      )}
    </div>
  );
};

export default AllTimings;
