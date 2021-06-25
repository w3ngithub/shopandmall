import Nav from "./components/NavBar";
import Footer from "./components/Footer";
import ProtectedRoute from "./ProtectedRoute";
import { Switch, Route, Redirect } from "react-router-dom";
import React, { useState, useEffect, useReducer, createContext } from "react";
import allDataReducer from "./reducers/allDataReducer";
import "./index.css";
import { useLocation } from "react-router-dom";

import {
  HomePage,
  AllMalls,
  Login,
  AllShops,
  SingleMall,
  SingleShop,
  MallForm,
  EditMall,
  PageNotFound,
  AboutUs,
  ContactUs,
} from "./pages";
import AddShopCategory from "./pages/addShopCategory";

const MyContext = createContext();

function App() {
  const allData = [];
  const location = useLocation();

  //State
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [allDataState, allDataDispatch] = useReducer(allDataReducer, allData);

  //Local Storage Thing
  useEffect(() => {
    if (localStorage.getItem("isAuth") === null) {
      localStorage.setItem("isAuth", "false");
    } else {
      localStorage.getItem("isAuth");
    }
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <MyContext.Provider value={{ allDataState, allDataDispatch }}>
        {location.pathname !== "/login" && <Nav />}

        <Switch>
          {/* ------------------User------------------ */}
          <Route exact path="/" component={HomePage} />
          <Route exact path="/malls" component={AllMalls} />
          <Route exact path="/shops" component={AllShops} />
          <Route exact path="/malls/:id" component={SingleMall} />
          <Route exact path="/:id/shops/:type" component={SingleShop} />
          <Route exact path="/mall/:id/shops/:type" component={SingleShop} />

          {/*------------------ Both ------------------ */}
          <Route exact path="/about-us" component={AboutUs} />
          <Route exact path="/contact-us" component={ContactUs} />

          {/* ------------------Admin------------------ */}
          <Route
            exact
            path="/admin/addshopcategories"
            component={AddShopCategory}
          />
          <Route
            exact
            path="/login"
            render={() => <Login isAuth={isAuth} setIsAuth={setIsAuth} />}
          />
          <ProtectedRoute
            path="/admin/dashboard"
            component={HomePage}
            page="/login"
            exact
          />
          <ProtectedRoute
            path="/admin/newMall"
            component={MallForm}
            page="/"
            exact
          />
          <ProtectedRoute exact path="/admin/shops" component={AllShops} />
          <ProtectedRoute exact path="/admin/malls" component={AllMalls} />
          <ProtectedRoute exact path="/admin/editMall" component={EditMall} />
          <ProtectedRoute
            exact
            path="/admin/malls/:id"
            component={SingleMall}
          />
          <ProtectedRoute
            exact
            path="/admin/:id/shops/:type"
            component={SingleShop}
          />

          {/* ------------------Admin------------------ */}
          <Route
            exact
            path="/admin/addshopcategories"
            component={AddShopCategory}
          />
          <Route
            exact
            path="/login"
            render={() => <Login isAuth={isAuth} setIsAuth={setIsAuth} />}
          />
          <ProtectedRoute
            path="/admin/dashboard"
            component={HomePage}
            page="/login"
            exact
          />
          <ProtectedRoute
            path="/admin/newMall"
            component={MallForm}
            page="/"
            exact
          />
          <ProtectedRoute exact path="/admin/shops" component={AllShops} />
          <ProtectedRoute exact path="/admin/malls" component={AllMalls} />
          <ProtectedRoute exact path="/admin/editMall" component={EditMall} />
          <ProtectedRoute
            exact
            path="/admin/malls/:id"
            component={SingleMall}
          />
          <ProtectedRoute
            exact
            path="/admin/:id/shops/:type"
            component={SingleShop}
          />

          {/* ----------No Url------------------ */}
          <Route exact path="/pageNotFound" component={PageNotFound} />
          <Redirect to="/pageNotFound" />
        </Switch>
        {location.pathname !== "/login" && <Footer />}
      </MyContext.Provider>
    </div>
  );
}

export { MyContext };
export default App;

// eslint-disable-next-line
