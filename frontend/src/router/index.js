import layoutAdmin from "../layout/admin/Layout";

//admin
// import homeAdmin from '../pages/admin/index'
import AdminUser from '../page/admin/user'
// import AdminCateory from '../pages/admin/category'
// import AdminProduct from '../pages/admin/product'
// import AdminAddProduct from '../pages/admin/addproduct'

//public
import LoginPage from "../page/public/LoginPage";
import Index from "../page/public/Index";
import Product from "../page/public/Product";
import Comment from "../page/public/Comment";
import Contact from "../page/public/Contact";

const publicRoutes = [
    {path: "/", component: Index},
    {path: "/login", component: LoginPage},
    {path: "/product", component: Product},
    {path: "/contact", component: Contact},
    {path: "/comment", component: Comment},
];

const adminRoutes = [
    // { path: "/admin/index", component: homeAdmin, layout: layoutAdmin },
    { path: "/admin/user", component: AdminUser, layout: layoutAdmin },
    // { path: "/admin/category", component: AdminCateory, layout: layoutAdmin },
    // { path: "/admin/product", component: AdminProduct, layout: layoutAdmin },
    // { path: "/admin/addproduct", component: AdminAddProduct, layout: layoutAdmin },
];




export {publicRoutes, adminRoutes};
