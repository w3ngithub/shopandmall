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
  const { docs } = useFirestore("Shop Categories");

  const handleAddShopCategorySubmit = (e) => {
    e.preventDefault();

    setShowAddModal(false);

    addShopCategory(category, subCategories);
  };

  const handleEditShopCategorySubmit = (e) => {
    e.preventDefault();

    setShowEditModal(false);

    editShopCategory(category, subCategories);
  };

  const handleDelete = (data) => {
    const response = window.confirm("Are You Sure?");
    if (response) {
      deleteShopCategory(data);
    }
  };

  useEffect(() => {
    if (!showAddModal && !showEditModal) {
      setCategory({ category: "" });
      setSubCategories([]);
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
        openEditModal={(data) => {
          setShowEditModal(true);
          setCategory(data);
          setSubCategories(data?.subCategories || []);
        }}
        openConfirmationModal={handleDelete}
      />
      {(showAddModal || showEditModal) && (
        <ShopCategoryModal
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
        />
      )}
    </div>
  );
};

export default AddShopCategory;
