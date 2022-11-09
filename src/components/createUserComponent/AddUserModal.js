import classes from "./modal.module.css";
import { IoClose } from "react-icons/io5";
import style from "./addUserModal.module.css";

const UserModal = ({
  errors,
  allUsers,
  onSubmit,
  setShowModal,
  showEditModal,
  handleSubmit,
  reset,
  register,
  getValues,
}) => {
  const checkUser = () => {
    const user = getValues("Username");
    const found = allUsers.find((element) => {
      return element.Username === user;
    });
    if (found) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <>
      <div
        className={classes.modalBackground}
        onClick={() => {
          setShowModal();
          reset();
        }}
      ></div>
      <div className={style.modal}>
        <div className={classes.header}>
          {showEditModal ? (
            <h3 className={style.title}>Edit User</h3>
          ) : (
            <h3 className={style.title}>Add New User</h3>
          )}
          <span
            onClick={() => {
              setShowModal();
              reset();
            }}
          >
            <IoClose className={classes.closeIcon} />
          </span>
        </div>
        <div className={classes.line}></div>

        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <div className={style.form__category}>
            <input
              className={style.input}
              placeholder="User Name"
              {...register("Username", {
                required: true,
                minLength: 4,
                validate: checkUser,
              })}
            />
            {errors?.Username?.type === "required" && (
              <p className={classes.error}>* User Name is required</p>
            )}
            {errors?.Username?.type === "minLength" && (
              <p className={classes.error}>
                * User Name should be more than 4 characters
              </p>
            )}
            {errors?.Username?.type === "validate" && (
              <p className={classes.error}>* User Name already exists</p>
            )}
          </div>
          <div className={style.form__category}>
            <input
              className={style.input}
              placeholder="Password"
              {...register("Password", {
                required: true,
                minLength: 8,
                pattern: {
                  value: /[A-Za-z0-9][0-9]/,
                  message: "Password must consist of alphabets and numbers",
                },
              })}
            />
            {errors?.Password?.type === "required" && (
              <p className={classes.error}>* Password is required</p>
            )}
            {errors?.Password?.type === "pattern" && (
              <p className={classes.error}>
                * Password must contain at least 8 digits and a number!
              </p>
            )}
            {errors?.Password?.type === "minLength" && (
              <p className={classes.error}>
                * Password must contain at least 8 digits and a number!
              </p>
            )}
          </div>
          <div className={style.form__category}>
            <select
              className={style.input}
              {...register("Role", {
                required: true,
              })}
            >
              <option value="">-Select Role-</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            {errors?.Role?.type === "required" && (
              <p className={classes.error}>* Role is required</p>
            )}
          </div>
          {showEditModal ? (
            <button
              className={style.submitBtn}
              type="submit"
              onClick={checkUser}
            >
              Update
            </button>
          ) : (
            <button
              className={style.submitBtn}
              type="submit"
              onClick={checkUser}
            >
              Add
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default UserModal;
