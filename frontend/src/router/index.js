import layoutAdmin from "../layout/admin/Layout";

//admin
import AdminUser from '../page/admin/user'
import AdminCateory from '../page/admin/category'
import AdminTrademark from '../page/admin/trademark'
import AdminProduct from '../page/admin/product'
import AdminAddProduct from '../page/admin/addproduct'
import AdminStore from '../page/admin/store'
import AdminAddStore from '../page/admin/addstore'
import AdminInvoice from '../page/admin/order'

//public
import LoginPage from "../page/public/LoginPage";
import Index from "../page/public/Index";
import Product from "../page/public/Product";
import Comment from "../page/public/Comment";
import Contact from "../page/public/Contact";
import RegisterPage from "../page/public/Register";
import ConfirmPage from "../page/public/Confirm";
import ForgotPage from "../page/public/Forgotpass";
import ResetPassPage from "../page/public/ResetPass";
import DetailProduct from "../page/public/detail";
import Cart from "../page/public/Cart";
import AccountPage from "../page/public/Account";
import StorePage from "../page/public/Store";

const publicRoutes = [
    {path: "/", component: Index},
    {path: "/login", component: LoginPage},
    {path: "/product", component: Product},
    {path: "/contact", component: Contact},
    {path: "/comment", component: Comment},
    {path: "/register", component: RegisterPage},
    {path: "/confirm", component: ConfirmPage},
    {path: "/forgot", component: ForgotPage},
    {path: "/resetpassword", component: ResetPassPage},
    {path: "/detail", component: DetailProduct},
    {path: "/cart", component: Cart},
    {path: "/account", component: AccountPage},
    {path: "/store", component: StorePage},
];

const adminRoutes = [
    // { path: "/admin/index", component: homeAdmin, layout: layoutAdmin },
    { path: "/admin/user", component: AdminUser, layout: layoutAdmin },
    { path: "/admin/category", component: AdminCateory, layout: layoutAdmin },
    { path: "/admin/trademark", component: AdminTrademark, layout: layoutAdmin },
    { path: "/admin/product", component: AdminProduct, layout: layoutAdmin },
    { path: "/admin/add-product", component: AdminAddProduct, layout: layoutAdmin },
    { path: "/admin/store", component: AdminStore, layout: layoutAdmin },
    { path: "/admin/add-store", component: AdminAddStore, layout: layoutAdmin },
    { path: "/admin/order", component: AdminInvoice, layout: layoutAdmin },
];




export {publicRoutes, adminRoutes};
