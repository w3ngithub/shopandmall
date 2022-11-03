import "./index.css";
import Nav from "./components/NavBar";
import Footer from "./components/Footer";
import ProtectedRoute from "./ProtectedRoute";
import { useLocation } from "react-router-dom";
import AddShopCategory from "./pages/addShopCategory";
import allDataReducer from "./reducers/allDataReducer";
import { Switch, Route, Redirect } from "react-router-dom";
import React, { useState, useReducer } from "react";
import { MyContext } from "./Context";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "react-toastify/dist/ReactToastify.css";
import SingleClassTry from "./pages/checkSingleShop";

import {
  Login,
  AboutUs,
  HomePage,
  AllMalls,
  AllShops,
  MallForm,
  EditMall,
  ContactUs,
  SingleMall,
  PageNotFound,
} from "./pages";
import CreateUser from "./pages/CreateUser";

function App() {
  const allData = [];
  const location = useLocation();

  //State

  const [allDataState, allDataDispatch] = useReducer(allDataReducer, allData);
  const [sideImageWithFooter, setSideImageWithFooter] = useState(false);
  const [showSearchExtended, setShowSearchExtended] = useState(false);

  const showSideImage = () => {
    setSideImageWithFooter(true);
  };

  const hideSideImage = () => {
    setSideImageWithFooter(false);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <MyContext.Provider
        value={{
          allDataState,
          allDataDispatch,
          sideImageWithFooter,
          showSideImage,
          hideSideImage,
          showSearchExtended,
          setShowSearchExtended,
        }}
      >
        {location.pathname !== "/login" && (
          <Nav {...{ setShowSearchExtended }} />
        )}
        <div className="body">
          <Switch>
            {/* ------------------User------------------ */}
            <Route exact path="/" component={HomePage} />
            <Route exact path="/malls" component={AllMalls} />
            <Route exact path="/shops" component={AllShops} />
            <Route exact path="/malls/:id" component={SingleMall} />
            <Route exact path="/:id/shops/:type" component={SingleClassTry} />
            <Route
              exact
              path="/mall/:id/shops/:type"
              component={SingleClassTry}
            />
            <Route
              exact
              path="/shops/category/:category"
              component={AllShops}
            />

            <Route exact path="/Home/category/:category" component={HomePage} />
            <Route
              exact
              path="/Home/category/:category/:subCategory"
              component={HomePage}
            />
            <Route
              exact
              path="/shops/category/:category/:subCategory"
              component={AllShops}
            />
            <Route
              exact
              path="/malls/category/:category"
              component={AllMalls}
            />
            <Route
              exact
              path="/malls/category/:category/:subCategory"
              component={AllMalls}
            />
            <Route exact path="/about-us" component={AboutUs} />
            <Route exact path="/contact-us" component={ContactUs} />

            {/* ------------------Admin------------------ */}
            <ProtectedRoute exact path="/admin/about-us" component={AboutUs} />
            <ProtectedRoute
              exact
              path="/admin/contact-us"
              component={ContactUs}
            />
            <ProtectedRoute
              exact
              path="/admin/addshopcategories"
              component={AddShopCategory}
              page="/login"
            />
            <ProtectedRoute
              exact
              path="/admin/shops/category/:category"
              component={AllShops}
              page="/login"
            />
            <ProtectedRoute
              exact
              path="/admin/malls/category/:category"
              component={AllMalls}
              page="/login"
            />
            <ProtectedRoute
              exact
              path="/admin/malls/category/:category/:subcategory"
              component={AllMalls}
              page="/login"
            />
            <ProtectedRoute
              exact
              path="/admin/shops/category/:category/:subcategory"
              component={AllShops}
              page="/login"
            />
            <Route
              exact
              path="/login"
              render={() => <Login isAuth={localStorage.getItem("isAuth")} />}
            />
            <ProtectedRoute
              path="/admin/dashboard"
              component={HomePage}
              page="/login"
              exact
            />
            <ProtectedRoute
              exact
              // path="/admin/category/:category"
              path="/admin/home/category/:category"
              component={HomePage}
            />
            <ProtectedRoute
              exact
              // path="/admin/category/:category/:subCategory"
              path="/admin/home/category/:category/:subCategory"
              component={HomePage}
            />
            <ProtectedRoute
              path="/admin/newMall"
              component={MallForm}
              page="/"
              exact
            />
            <ProtectedRoute exact path="/admin/shops" component={AllShops} />
            <ProtectedRoute exact path="/admin/malls" component={AllMalls} />
            <ProtectedRoute
              exact
              path="/admin/editMall/:mallId"
              component={EditMall}
            />
            <ProtectedRoute
              exact
              path="/admin/malls/:id"
              component={SingleMall}
            />
            <ProtectedRoute
              exact
              path="/admin/:id/shops/:type"
              component={SingleClassTry}
            />
            <ProtectedRoute
              exact
              path="/admin/createuser"
              component={CreateUser}
            />

            {/* ----------No Url------------------ */}
            <Route exact path="/pageNotFound" component={PageNotFound} />
            <Redirect to="/pageNotFound" />
          </Switch>
        </div>
        {location.pathname !== "/login" && sideImageWithFooter === false && (
          <Footer />
        )}
      </MyContext.Provider>
    </div>
  );
}

export { MyContext };
export default App;

// eslint-disable-next-line
