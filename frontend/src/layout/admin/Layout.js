import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom';
function Header({ children }){
     // Ensure useLocation is called at the top level of the component
     const location = useLocation();

     // Function to check if the current path matches the given pathname
     const isActive = (pathname) => {
         for(var i=0; i<pathname.length; i++){
            if(location.pathname === pathname[i]){
                return 'activenavbar';
            }
         }
         return '';
     };
     
    const [isCssLoaded, setCssLoaded] = useState(false);
    useEffect(()=>{
        import('../admin/layout.scss').then(() => setCssLoaded(true));
    }, []);
    if (!isCssLoaded) {
        return <></>
    }

    var user = window.localStorage.getItem("user")
    if(user != null){
        user = JSON.parse(user);
    }

    function openClose(){
        document.getElementById("sidebar").classList.toggle("toggled");
        document.getElementById("page-content-wrapper").classList.toggle("toggled");
        document.getElementById("navbarmain").classList.toggle("navbarmainrom");
    }

    return(
        <div class="d-flex" id="wrapper">
        <nav id="sidebar" class="bg-dark">
            <div class="sidebar-header p-3 text-white">
            <i class="fa fa-bars pointer" id="iconbaradmin" onClick={openClose}></i>
            ADIMIN
            </div>
            <ul class="list-unstyled components">
                <li className={isActive(["/admin/user"])}>
                    <a href="user" class="text-white text-decoration-none">
                        <i class="fa fa-user"></i> Account
                    </a>
                </li>
                <li className={isActive(["/admin/category"])}>
                    <a href="category" class="text-white text-decoration-none">
                        <i class="fa fa-list"></i> Category
                    </a>
                </li>
                <li className={isActive(["/admin/trademark"])}>
                    <a href="trademark" class="text-white text-decoration-none">
                        <i class="fab fa-apple"></i> Trademark
                    </a>
                </li>
                <li className={isActive(["/admin/product", "/admin/add-product"])}>
                    <a href="#colproduct" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-t-shirt"></i> Product
                    </a>
                    <ul class="collapse list-unstyleds" id="colproduct">
                        <li class="nav-item">
                            <a href="product" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> List product</a>
                        </li>
                        <li class="nav-item">
                            <a href="add-product" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Add product</a>
                        </li>
                    </ul>
                </li>
                <li className={isActive(["/admin/store", "/admin/add-store"])}>
                    <a href="#colstore" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-map-marker"></i> Store
                    </a>
                    <ul class="collapse list-unstyleds" id="colstore">
                        <li class="nav-item">
                            <a href="store" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> List store</a>
                        </li>
                        <li class="nav-item">
                            <a href="add-store" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Add store</a>
                        </li>
                    </ul>
                </li>
                <li className={isActive(["/admin/order"])}>
                    <a href="order" class="text-white text-decoration-none">
                        <i class="fa fa-list"></i> Order
                    </a>
                </li>
                <li>
                    <a href="#" onClick={logout} class="text-white text-decoration-none">
                        <i class="fa fa-sign-out"></i> Logout
                    </a>
                </li>
            </ul>
        </nav>

        <div id="page-content-wrapper" class="w-100">
            <nav id='navbarmain' class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <div class="container-fluid">
                    <button class="btn btn-link" id="menu-toggle"><i class="fas fa-bars" onClick={openClose}></i></button>
                    <div class="dropdown ms-auto">
                    </div>
            
                    <div class="dropdown ms-3">
                        <a class="dropdown-toggle d-flex align-items-center text-decoration-none" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="navbar-text me-2">Hello: {user?.fullname}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li onClick={logout}><a class="dropdown-item" href="#">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="container-fluid py-4" id='mainpageadmin'>
                {children}
            </div>
        </div>
    </div>
    );
}

async function checkAdmin(){
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/admin/check-role-admin';
    const response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('../login')
    }
}


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('../login')
}

export default Header;