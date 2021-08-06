import classes from "./modal.module.css";
import { IoClose } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import style from "./addShopCategoryModal.module.css";

const ShopCategoryModal = ({
  categoryError,
  subCategoryError,
  category,
  setCategory,
  subCategories,
  setSubCategories,
  onSubmit,
  setShowModal,
  removeSubCategory,
}) => {
  return (
    <>
      <div className={classes.modalBackground} onClick={setShowModal}></div>
      <div className={style.modal}>
        <div className={classes.header}>
          <h3 className={style.title}>Add New Category</h3>
          <span onClick={setShowModal}>
            <IoClose className={classes.closeIcon} />
          </span>
        </div>
        <div className={classes.line}></div>

        <form onSubmit={onSubmit} className={classes.form}>
          <div className={style.form__category}>
            <input
              type="text"
              className={style.input}
              placeholder="Category Name"
              value={category.category}
              onChange={(e) =>
                setCategory({
                  ...category,
                  category: e.target.value,
                })
              }
            />
            {categoryError.invalid && (
              <p className={classes.categoryError}>*{categoryError.message}</p>
            )}
          </div>

          {subCategories.length > 0 &&
            subCategories.map(({ id, subCategory }) => (
              <div key={id} style={{ marginBottom: "10px" }}>
                <div className={classes.form__subcategory}>
                  <input
                    type="text"
                    className={style.input}
                    placeholder="Sub-Category Name"
                    value={subCategory}
                    onChange={(e) =>
                      setSubCategories([
                        ...subCategories.map((category) =>
                          category.id === id
                            ? {
                                ...category,
                                subCategory: e.target.value,
                              }
                            : category
                        ),
                      ])
                    }
                  />

                  <span onClick={() => removeSubCategory(id, subCategory)}>
                    <IoClose className={style.closeIcon} />
                  </span>
                </div>
                <div className={classes.subCategoryError}>
                  {subCategoryError.id === id && (
                    <p>*{subCategoryError.message}</p>
                  )}
                </div>
              </div>
            ))}
          <p
            className={style.label}
            onClick={() =>
              setSubCategories([
                ...subCategories,
                { id: Date.now(), subCategory: "" },
              ])
            }
          >
            Add Sub Category
            <span>
              <IoIosAddCircle className={classes.addIcon} />
            </span>
          </p>

          <button className={style.submitBtn} type="submit">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default ShopCategoryModal;
