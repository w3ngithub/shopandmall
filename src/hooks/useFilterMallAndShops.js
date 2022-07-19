import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useFilterMallAndShops = (
  malls,
  isAdmin,
  isShopCategorySelected
) => {
  const location = useLocation();
  const [filteredMalls, setFilteredMalls] = useState([]);

  const handleFilterShops = () => {
    const selectedCategory = isAdmin
      ? location.pathname.split("/")[4]
      : location.pathname.split("/")[3];
    const selectedSubCategory = isAdmin
      ? location.pathname.split("/")[5]
      : location.pathname.split("/")[4];

    let filtering = [];

    malls.forEach((mall) => {
      const shopsWithTheCategory = mall.shops.filter(
        (shop) => shop.category === selectedCategory
      );
      const shopsWithTheCategoryAndSubCategory = mall.shops.filter(
        (shop) =>
          shop.category === selectedCategory &&
          shop.subCategory === selectedSubCategory
      );

      if (shopsWithTheCategory.length > 0 && !Boolean(selectedSubCategory)) {
        filtering = [...filtering, { ...mall, shops: shopsWithTheCategory }];
      }

      if (shopsWithTheCategoryAndSubCategory.length > 0) {
        filtering = [
          ...filtering,
          { ...mall, shops: shopsWithTheCategoryAndSubCategory },
        ];
      }
    });

    setFilteredMalls(filtering);
  };

  useEffect(() => {
    if (isShopCategorySelected) {
      handleFilterShops();
    } else {
      setFilteredMalls(malls);
    }
  }, [location.pathname, malls]);

  return { filteredMalls };
};
