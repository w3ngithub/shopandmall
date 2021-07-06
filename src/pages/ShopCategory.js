import classes from "../styles/ShopCategory.module.css";
import useFirestore from "../hooks/useFirestore";
import Shop from "../components/shop/Shop";
import { useHistory, useLocation } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";

const ShopCategory = () => {
  let { docs } = useFirestore("Shopping Mall");
  const location = useLocation();
  const history = useHistory();

  //show category list according to selected path
  const category = location.pathname.split("/")[2];
  const subCategory = location.pathname.split("/")[3];
  const categories =
    location.pathname.split("/").length === 3 ? (
      <>
        <p>{category}</p>
        <p
          className={classes.deleteicon}
          onClick={() => history.push("/shops/")}
        >
          X
        </p>
      </>
    ) : (
      <>
        <p>{category}</p>
        <AiOutlineRight className={classes.righticon} />
        <p>{subCategory}</p>
        <p
          className={classes.deleteicon}
          onClick={() => history.push("/shops/" + category)}
        >
          X
        </p>
      </>
    );

  return (
    <div className={classes.main}>
      <div className={classes.mallContainer}>
        <div className={classes.search}>
          <input
            className={classes.searchBar}
            type="text"
            placeholder="Search..."
          />
        </div>
        <div className={classes.categoryLists}>{categories}</div>

        <div className={classes.header}>
          <h4 className={classes.heading}>Shops</h4>
        </div>
        {docs?.length !== 0 ? (
          <Shop docs={docs} />
        ) : (
          <h3>No Shops Added Yet</h3>
        )}
        <div className={classes.link}></div>
      </div>
    </div>
  );
};

export default ShopCategory;
