import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FormImage from "../assets/images/form.svg";
import classes from "../styles/contactUs.module.css";
import { ToastContainer, toast, Slide } from "react-toastify";

const AboutUs = () => {
  const [inputData, setInputData] = useState(null);
  console.log("input")
  console.log(inputData)

  const customId = "custom-id-yes";

  const notify = () => toast.success("Successful!", { toastId: customId });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  return (
    <div className={classes.container}>
      <div className={classes.formWrapper}>
        <div className={classes.formTitle}>
          <img src={FormImage} alt="" />
          <p>Say Hello!</p>
        </div>

        <form action="" className={classes.form}>
          <div>
            <div>
              <div className={classes.firstRow}>
                <p>
                  <label htmlFor="name">Your name *</label>
                </p>
                <input
                  className={errors.name ? classes.errorInput : classes.input}
                  {...register("name", { required: true })}
                  id="name"
                  type="text"
                />
                {errors.name && (
                  <p className={classes.error}>This is required </p>
                )}
              </div>
              <div className={classes.firstRow}>
                <p>
                  <label htmlFor="email">Contact email *</label>
                </p>
                <input
                  className={errors.email ? classes.errorInput : classes.input}
                  {...register("email", {
                    required: true,
                    pattern: /\S+@\S+\.\S+/,
                  })}
                  name="email"
                  id="email"
                  type="text"
                />
                {errors?.email?.type === "required" && (
                  <p className={classes.error}>This is required </p>
                )}
                {errors?.email?.type === "pattern" && (
                  <p className={classes.error}>Invalid Email </p>
                )}
              </div>
            </div>
            <p>
              <label htmlFor="message">Your message *</label>
            </p>
            <textarea
              className={
                errors.message ? classes.errorTextarea : classes.textarea
              }
              {...register("message", { required: true })}
              id="message"
              cols="30"
              rows="10"
            ></textarea>
            {errors.message && (
              <p className={classes.errorArea}>This is required </p>
            )}
          </div>
          <button
            className={classes.formButton}
            onClick={handleSubmit((data) => {
              setInputData(data);
              notify();
              reset();
            })}
          >
            Submit
          </button>
        </form>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          transition={Slide}
        />
      </div>
    </div>
  );
};

export default AboutUs;
