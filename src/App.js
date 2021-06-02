import Nav from "./components/Nav";
import ProtectedRoute from "./ProtectedRoute";
import EditMall from "./components/mall/EditMall";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import React, { useState, useEffect, useReducer, createContext } from "react";
import {
  Login,
  MallForm,
  ShopForm,
  AllMalls,
  AllShops,
  Dashboard,
  SingleMall,
  SingleShop,
  PageNotFound,
} from "./components";
import allDataReducer from "./reducers/allDataReducer";
import "./index.css";

const MyContext = createContext();

function App() {
  const location = useLocation();
  const allData = [];

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
    <div className="dsds">
    <MyContext.Provider value={{ allDataState, allDataDispatch }}>
      {location.pathname.split("/")[1] === "admin" && <Nav />}

      <Switch>
        {/* ------------------User------------------ */}
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/malls" component={AllMalls} />
        <Route exact path="/shops" component={AllShops} />
        <Route exact path="/malls/:id" component={SingleMall} />
        <Route exact path="/:id/shops/:type" component={SingleShop} />
        <Route exact path="/mall/:id/shops/:type" component={SingleShop} />

        {/* ------------------Admin------------------ */}
        <Route
          exact
          path="/login"
          render={() => <Login isAuth={isAuth} setIsAuth={setIsAuth} />}
        />
        <ProtectedRoute
          path="/admin/dashboard"
          component={Dashboard}
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
        <ProtectedRoute exact path="/admin/malls/:id" component={SingleMall} />
        <ProtectedRoute
          exact
          path="/admin/:id/shops/:type"
          component={SingleShop}
        />
        <ProtectedRoute
          path="/admin/newShop"
          component={ShopForm}
          page="/"
          exact
        />

        {/* ----------No Url------------------ */}
        <Route exact path="/pageNotFound" component={PageNotFound} />
        <Redirect to="/pageNotFound" />
      </Switch>
    </MyContext.Provider>
  </div>
  );
}

export { MyContext };
export default App;
