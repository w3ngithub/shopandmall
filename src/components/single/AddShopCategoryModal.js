import classes from "./modal.module.css";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import Button from "../Button/Button";

const ShopCategoryModal = ({
  category,
  setCategory,
  subCategories,
  setSubCategories,
  onSubmit,
  setShowModal,
}) => {
  return (
    <>
      <div className={classes.modalBackground} onClick={setShowModal}></div>
      <div className={classes.modal}>
        <div className={classes.header}>
          <h3 className={classes.title}>Add New Category</h3>
          <span onClick={setShowModal}>
            <AiOutlineClose />
          </span>
        </div>

        <form onSubmit={onSubmit} className={classes.form}>
          <input
            type="text"
            className={classes.input}
            placeholder="Category Name"
            value={category.category}
            onChange={(e) =>
              setCategory({ ...category, category: e.target.value })
            }
          />
          {subCategories.length > 0 &&
            subCategories.map(({ id, subCategory }) => (
              <div className={classes.form__subcategory} key={id}>
                <input
                  type="text"
                  className={classes.input}
                  placeholder="Sub-Category Name"
                  value={subCategory}
                  onChange={(e) =>
                    setSubCategories([
                      ...subCategories.map((category) =>
                        category.id === id
                          ? { ...category, subCategory: e.target.value }
                          : category
                      ),
                    ])
                  }
                />
                <span
                  onClick={() =>
                    setSubCategories(
                      subCategories.filter((category) => category.id !== id)
                    )
                  }
                >
                  <AiOutlineClose />
                </span>
              </div>
            ))}
          <p
            className={classes.form__span}
            onClick={() =>
              setSubCategories([
                ...subCategories,
                { id: Date.now(), subCategory: "" },
              ])
            }
          >
            Add Sub Category{" "}
            <span>
              <AiOutlinePlus />
            </span>
          </p>

          <Button type="submit">Save</Button>
        </form>
      </div>
    </>
  );
};

export default ShopCategoryModal;
