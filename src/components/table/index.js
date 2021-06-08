import React, { useState } from "react";
import "./table.scss";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import PropTypes from "prop-types";
import classNames from "classnames";

function Table({
  backgroundColor,
  headerTextColor,
  width,
  fields,
  rowData,
  hasAction,
  tableInnerContent,
  isNestedTable,
  ...props
}) {
  let gridTemplateColumns =
    `50px ${isNestedTable ? `50px ` : ``}` +
    fields
      .map((e, i) => e?.width + (i === fields.length - 1 && "px"))
      .join("px ");
  //console.log(gridTemplateColumns);
  const [data, setData] = useState(rowData);
  const toggleRowExpand = (rowId) => {
    let newData = data.map((x) => {
      if (x.id === rowId) x.isExpanded = !x.isExpanded;
      return x;
    });
    setData(newData);
  };
  return (
    <div className="table" style={{ width: width + "%" }}>
      <div
        className="table__header"
        style={{ backgroundColor, color: headerTextColor, gridTemplateColumns }}
      >
        {isNestedTable && <span></span>}
        <span>SN.</span>
        {fields.map((field, i) => (
          <span style={{ width: field.width + "%" }} key={i}>
            {field.headerText}
          </span>
        ))}
      </div>
      <div className="table__body">
        {data.map((row, i) => {
          return (
            <div
              className={classNames({
                "flex-column row-content": true,
                "is-row-expanded ": row.isExpanded,
              })}
              key={row.id}
            >
              <div className="table__body-row" style={{ gridTemplateColumns }}>
                {isNestedTable && (
                  <div
                    onClick={() => toggleRowExpand(row.id)}
                    className="toggle-icon"
                  >
                    <IoIosArrowForward className="btn-arrow" />
                  </div>
                )}

                <span>{i + 1}</span>
                {fields.map((field, i) => (
                  <span key={`${row.id}${i}`}>{row[field.field]}</span>
                ))}

                {hasAction && <Actions />}
              </div>
              {row.rowContent && (
                <div
                  className={classNames({
                    "table-inner-row": true,
                    "fade-in": row.isExpanded,
                    "fade-out": !row.isExpanded,
                  })}
                >
                  {" "}
                  {row.rowContent}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Actions = () => (
  <div className="table-action flex justify-end">
    <div className="table-action__grp flex">
      <BiEdit />
      <span className="table-action-label">Edit</span>
    </div>
    <div className="table-action__grp flex">
      <RiDeleteBinLine />
      <span className="table-action-label">Delete</span>
    </div>
  </div>
);

export default Table;

Table.propTypes = {
  /**
   * What header text color to use
   */
  headerTextColor: PropTypes.string,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the grid be?
   */
  width: PropTypes.number,
  /**
   * Table header columns, column width, data field
   */
  fields: PropTypes.array.isRequired,

  /**
   * Table row content
   */
  rowData: PropTypes.array.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  /**
   * Optional props to show actions column
   */
  hasAction: PropTypes.bool,
  /**
   * Optional props to show add nested table feature
   */
  isNestedTable: PropTypes.bool,
};

Table.defaultProps = {
  headerTextColor: null,
  backgroundColor: null,
  width: 100,
  fields: [],
  rowData: [],
  onClick: undefined,
  hasAction: true,
  isNestedTable: false,
};
