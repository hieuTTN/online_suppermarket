import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import vnpay from '../../assest/images/vnpay.jpg'
import { toast } from 'react-toastify'
import {getMethod,deleteMethod, postMethodPayload} from '../../services/request'
import Swal from 'sweetalert2'


function PaymentPage(){
    useEffect(()=>{
        createInvoice();
    }, []);

    async function createInvoice() {
        var uls = new URL(document.URL)
        var vnpOrderInfo = uls.searchParams.get("vnp_OrderInfo");

        const currentUrl = window.location.href;
        const parsedUrl = new URL(currentUrl);
        const queryStringWithoutQuestionMark = parsedUrl.search.substring(1);

        var obj = JSON.parse(window.localStorage.getItem("orderinfor"));
        obj.vnpOrderInfo = vnpOrderInfo
        obj.urlVnpay = queryStringWithoutQuestionMark
    
        var res = await postMethodPayload('/api/invoice/user/create', obj)
        if (res.status < 300) {
            document.getElementById("thanhcong").style.display = 'block'
        }
        if (res.status == 417) {
            var result = await res.json();
            document.getElementById("thatbai").style.display = 'block'
            document.getElementById("thanhcong").style.display = 'none'
            document.getElementById("errormess").innerHTML = result.defaultMessage
        }
    }
    
    

    return(
        <>
         <div class="contentmain"><br/><br/><br/>
            <div>
                <div id="thanhcong">
                    <h3>Payment success</h3>
                    <p>Thank you for trusting us to use our service.</p>
                    <p>Please check your order information in your order history</p>
                    <a href="account" class="btn btn-danger">View order history</a>
                </div>

                <div id="thatbai">
                    <h3>Notification</h3>
                    <p id="errormess">You have not completed payment.</p>
                    <p>Back <a href="/">Home</a></p>
                </div>
            </div>
        </div> 
        </>
    );
}

export default PaymentPage;
