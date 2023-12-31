import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "./../pages/Register/Register";

const publicRoutes = [
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/", component: Home ,layout: DefaultLayout},
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
