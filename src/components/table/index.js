/* eslint-disable */
import React, { useEffect, useState, useMemo } from "react";
import "./table.scss";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import PropTypes from "prop-types";
import classNames from "classnames";
import DeleteModal from "../Modal/DeleteModal";

function Table({
  backgroundColor,
  headerTextColor,
  width,
  fields,
  rowData,
  hasAction,
  tableInnerContent,
  isNestedTable,
  handleEditClick,
  handleDelete,
  ...props
}) {
  let gridTemplateColumns =
    `50px ${isNestedTable ? `50px ` : ``}` +
    fields
      .map((e, i) => e?.width + (i === fields.length - 1 && "px"))
      .join("px ");
  const [data, setData] = useState(rowData);
  let username = localStorage.getItem("username");
  const toggleRowExpand = (rowId) => {
    let newData = data.map((x) => {
      if (x.id === rowId) x.isExpanded = !x.isExpanded;
      return x;
    });
    setData(newData);
  };
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal((prev) => !prev);
  };
  useEffect(() => {
    let newData = [...rowData].map((x) => {
      x.isExpanded = data.find((d) => d.id === x.id)?.isExpanded ?? false;
      return x;
    });
    setData(newData);
  }, [rowData]);

  return (
    <div className="table">
      <div
        className="table__header"
        style={{ backgroundColor, color: headerTextColor, gridTemplateColumns }}
      >
        <span></span>
        <span>SN.</span>
        {fields.map((field, i) => (
          <span style={{ width: field.width + "%" }} key={i}>
            {field.headerText}
          </span>
        ))}
      </div>
      <div className="table__body">
        {data.length === 0 && (
          <span style={{ fontSize: "15px" }}>No records found</span>
        )}
        {data.map((row, i) => {
          return (
            <div
              className={classNames({
                "flex-column row-content": true,
                "is-row-expanded ": row.isExpanded,
              })}
              key={i}
            >
              <div className="table__body-row">
                {row?.subCategories?.length > 0 ? (
                  <div
                    onClick={() => toggleRowExpand(row.id)}
                    className="toggle-icon"
                  >
                    <IoIosArrowForward className="btn-arrow" />
                  </div>
                ) : (
                  <span></span>
                )}

                <span>{i + 1}</span>
                {fields.map((field, i) => (
                  <span key={`${row.id}${i}`}>{row[field.field]}</span>
                ))}
                {hasAction && (
                  <Actions
                    fields={fields}
                    handleEdit={handleEditClick}
                    handleDelete={handleDelete}
                    row={row}
                    modal={modal}
                    handleModal={handleModal}
                    index={i}
                  />
                )}
              </div>
              {row.rowContent && (
                <div
                  className={classNames({
                    "table-inner-row": true,
                    "fade-in": row.isExpanded,
                    "fade-out": !row.isExpanded,
                  })}
                >
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
const Actions = ({
  fields,
  handleEdit,
  handleDelete,
  modal,
  handleModal,
  row,
  index,
}) => {
  const fieldWidth = fields.length > 1 ? "" : "300%";
  const [currentIndex, setCurrentIndex] = useState(0);
  let username = localStorage.getItem("username");

  return (
    <>
      {username === "sadmin" ? (
        <div
          className="table-action flex justify-end"
          style={{ width: fieldWidth }}
        >
          <div
            className="table-action__grp flex"
            onClick={() => handleEdit(row)}
          >
            <BiEdit />
            <span className="table-action-label">Edit</span>
          </div>
          {row.Username === username ? (
            <span className="table-action-label">
              &emsp;&emsp;&emsp;&emsp;&emsp;
            </span>
          ) : (
            <div
              className="table-action__grp flex"
              onClick={(e) => {
                e.stopPropagation();
                handleModal();
                setCurrentIndex(index);
              }}
            >
              <RiDeleteBinLine />
              <span className="table-action-label">Delete</span>
              {modal && currentIndex === index && (
                <DeleteModal
                  datas={{
                    handleModal,
                    handleDelete: () => {
                      handleDelete(row);
                      handleModal();
                      setCurrentIndex(0);
                    },
                  }}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className="table-action flex justify-end"
          style={{ width: fieldWidth }}
        >
          {row.Username !== "sadmin" && (
            <>
              <div
                className="table-action__grp flex"
                onClick={() => handleEdit(row)}
              >
                <BiEdit />
                <span className="table-action-label">Edit</span>
              </div>
              {row.Username === username ? (
                <span className="table-action-label">
                  &emsp;&emsp;&emsp;&emsp;&emsp;
                </span>
              ) : (
                <div
                  className="table-action__grp flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModal();
                    setCurrentIndex(index);
                  }}
                >
                  <RiDeleteBinLine />
                  <span className="table-action-label">Delete</span>
                  {modal && currentIndex === index && (
                    <DeleteModal
                      datas={{
                        handleModal,
                        handleDelete: () => {
                          handleDelete(row);
                          handleModal();
                          setCurrentIndex(0);
                        },
                      }}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
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
