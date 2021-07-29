import classes from "./modal.module.css";
import style from "./addShopCategoryModal.module.css";
import { IoClose } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";

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
      <div className={classes.modal}>
        <div className={classes.header}>
          <h3 className={classes.title}>Add New Category</h3>
          <span onClick={setShowModal}>
            <IoClose className={classes.closeIcon} />
          </span>
        </div>
        <div className={classes.line}></div>

        <form onSubmit={onSubmit} className={classes.form}>
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
          {subCategories.length > 0 &&
            subCategories.map(({ id, subCategory }) => (
              <div key={id}>
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

                  <span onClick={() => removeSubCategory(subCategory)}>
                    <IoClose className={style.closeIcon} />
                  </span>
                  <div className={classes.subCategoryError}>
                    {subCategoryError.id === id && (
                      <p>*{subCategoryError.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          <p
            className={classes.label}
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

          <button className={classes.submitBtn} type="submit">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default ShopCategoryModal;
