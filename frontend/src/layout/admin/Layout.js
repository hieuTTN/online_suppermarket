import {handleChangePass} from '../../services/auth'
import '../admin/layout.scss'
import lich from '../../assest/images/lich.png'
import avatar from '../../assest/images/user.svg'
import { useState, useEffect } from 'react'

function Header({ children }){
    checkAdmin();
    useEffect(()=>{
        getDateTime();

    }, []);
    function getDateTime() {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds(); //
            var a = 0;
            //
            if (month.toString().length == 1) {
                month = '0' + month;
            }
            if (day.toString().length == 1) {
                day = '0' + day;
            }
            if (hour.toString().length == 1) {
                hour = '0' + hour;
            }
            if (minute.toString().length == 1) {
                minute = '0' + minute;
            }
            if (second.toString().length == 1) {
                second = '0' + second;
            }
            var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' +
                minute + ':' + second;
            return dateTime;
        }
        setInterval(function() {
            var currentTime = getDateTime();
            document.getElementById("digital-clock").innerHTML = currentTime;
        }, 1000);
        
        var date = new Date();
        
        var current_day = date.getDay();
        
        var day_name = '';
        
    return(
        <>
         <div class="navleft" id="navleft">
         <div class="divroot">
                <h3>ADMIN</h3>
            </div>
            <div class="listmenumain">
                <a href="user"><i className='fa fa-user'></i> Account</a>
                <a href="category"><i className='fa fa-list'></i> Category</a>
                <a href="product"><i className='fa fa-t-shirt'></i> Product</a>
                <a href="#" onClick={()=>logout()}><i className='fa fa-sign-out'></i> Logout</a>
            </div>
         </div>
    <div class="contentadminweb">
        <div class="headerweb" id="headerweb">
        <div class="lichheader">
        <img class="iconlich" src={lich} />
        <p class="text-gray fst-italic mb-0">
            <p id="digital-clock"></p>
        </p>
    </div>
    <div class="userheader">
        <a class="nav-link dropdown-toggle menucha" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="tendangnhap"></span>
            <img src={avatar} class="userlogo"/>
        </a>
        <ul class="dropdown-menu listitemtk" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" onClick={()=>logout()} href="#"><i class="fa fa-sign-out"></i> Logout</a></li>
        </ul>
    </div>
        </div>
        <div class="contentmain">
            {children}
        </div>
    </div>
        </>
    );
}

async function checkAdmin(){
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/user/admin/check-role-admin';
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