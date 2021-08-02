import { useEffect, useState } from "react";
import Button from "../components/Button/Button";
import ShopCategoryModal from "../components/single/AddShopCategoryModal";
import Table from "../components/table";
import styles from "../styles/addShopCategories.module.css";
import useFirestore from "../hooks/useFirestore";
import {
  addShopCategory,
  deleteShopCategory,
  editShopCategory,
} from "../firebase/addshopcategoryAPI";

const AddShopCategory = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [category, setCategory] = useState({ category: "" });
  const [subCategories, setSubCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [categoryError, setCategoryError] = useState({
    invalid: false,
    message: "",
  });
  const [subCategoryError, setSubCategoryError] = useState({
    invalid: false,
    message: "",
  });
  const { docs } = useFirestore("Shop Categories");
  const allMalls = useFirestore("Shopping Mall");

  const handleAddShopCategorySubmit = (e) => {
    e.preventDefault();

    setCategoryError({});
    setSubCategoryError({});

    const isCategoryEmpty = category?.category === "";
    const emptySubCategory = subCategories?.find(
      (category) => category?.subCategory === ""
    );
    const isSubCategoryEmpty = emptySubCategory?.subCategory === "";

    if (isCategoryEmpty) {
      setCategoryError({
        invalid: true,
        message: "please fill the category name",
      });
    } else if (isSubCategoryEmpty) {
      setSubCategoryError({
        id: emptySubCategory.id,
        invalid: true,
        message: "either fill the sub-category name or remove the field",
      });
    } else {
      setShowAddModal(false);

      addShopCategory(category, subCategories);
    }
  };

  const handleEditShopCategorySubmit = (e) => {
    e.preventDefault();
    setShowEditModal(false);
    editShopCategory(category, subCategories);
  };

  const handleDelete = (data) => {
    const response = window.confirm("Are you sure?");
    if (response) {
      const allShops = [...allMalls.docs.map((mall) => mall.shops)].flat();
      const isCategoryUsedInShop = allShops.some(
        (shop) => shop.category === data.category
      );

      if (isCategoryUsedInShop) {
        alert("Category cannot be deleted because it is being used");
        return;
      }

      deleteShopCategory(data);
    }
  };

  const removeSubCategory = (id, subCategory) => {
    const allShops = [...allMalls.docs.map((mall) => mall.shops)].flat();
    const isSubCategoryUsedInShop = allShops.some(
      (shop) => shop.subCategory === subCategory
    );

    if (isSubCategoryUsedInShop) {
      alert("SubCategory cannot be removed because it is used in shop");
      return;
    }

    setSubCategories(subCategories.filter((category) => category.id !== id));
  };

  useEffect(() => {
    if (!showAddModal && !showEditModal) {
      setCategory({ category: "" });
      setSubCategories([]);
      setCategoryError({});
      setSubCategoryError({});
    }
  }, [showAddModal, showEditModal]);

  useEffect(() => {
    const transformedData = [
      ...docs.map((data) => ({
        ...data,
        subCategories: data.rowContent.rowData,
        rowContent: (
          <Table
            rowData={data.rowContent.rowData}
            fields={[
              {
                field: "subCategory",
                headerText: "Sub Category",
              },
            ]}
            onClick={() => {}}
            hasAction={false}
            width={100}
            isNestedTable={true}
          />
        ),
      })),
    ];

    setAllCategories(transformedData);
  }, [docs]);

  return (
    <div className={styles.container}>
      <h1>Shop Categories</h1>
      <Button onClick={() => setShowAddModal(true)} type="button">
        Add New Category
      </Button>

      <Table
        rowData={allCategories}
        fields={[{ headerText: "Category", field: "category", width: 250 }]}
        onClick={() => {}}
        width={50}
        hasAction={true}
        isNestedTable={true}
        handleEditClick={(data) => {
          setShowEditModal(true);
          setCategory(data);
          setSubCategories(data?.subCategories || []);
        }}
        handleDeleteClick={handleDelete}
      />
      {(showAddModal || showEditModal) && (
        <ShopCategoryModal
          categoryError={categoryError}
          subCategoryError={subCategoryError}
          subCategories={subCategories}
          setSubCategories={setSubCategories}
          category={category}
          setCategory={setCategory}
          setShowModal={() =>
            showAddModal ? setShowAddModal(false) : setShowEditModal(false)
          }
          onSubmit={
            showAddModal
              ? handleAddShopCategorySubmit
              : handleEditShopCategorySubmit
          }
          removeSubCategory={removeSubCategory}
        />
      )}
    </div>
  );
};

export default AddShopCategory;
