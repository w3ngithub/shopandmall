import { useState } from "react";
import ManualTimings from "../ManualTimings/ManualTimings";
import DefaultTimings from "../DefaultTimings/DefaultTimings";
import "./alltimings.css";

const AllTimings = ({
  state,
  onManualTimeChange,
  onDefaultTimeChange,
  isShop,
  addMoreTimingsFields,
  onRemoveTimingsField,
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

  return (
    <div className="timingsform">
      <div className="input__radio" style={isShop && { width: "35%" }}>
        <div>
          <input
            type="radio"
            id="every day"
            value="every day"
            name={isShop ? "shopTimings" : "mallTimings"}
            onChange={() => setShowManualTimings(false)}
            defaultChecked
          />
          <label htmlFor="every day">Every Day</label>
        </div>
        <div>
          <input
            type="radio"
            id="manual"
            value="manual timing"
            name={isShop ? "shopTimings" : "mallTimings"}
            onChange={() => setShowManualTimings(true)}
          />
          <label htmlFor="manual ">Manual Timing</label>
        </div>
      </div>
      {showManualTimings ? (
        <>
          {state.timings.map((time) => (
            <ManualTimings
              key={time.id}
              time={time}
              timings={state.timings}
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
              onRemoveTimingsField={() => onRemoveTimingsField(time.id)}
            />
          ))}
        </>
      ) : (
        <DefaultTimings
          timing={state.timings[0]}
          setOpenTime={(value) => onDefaultTimeChange("openTime", value)}
          setCloseTime={(value) => onDefaultTimeChange("closeTime", value)}
          isShop={isShop}
          showRemove={showManualTimings}
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
