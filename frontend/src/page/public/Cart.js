import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import vnpay from '../../assest/images/vnpay.jpg'
import { toast } from 'react-toastify'
import {getMethod,deleteMethod, postMethodPayload} from '../../services/request'
import Swal from 'sweetalert2'
import Select from 'react-select';


function Cart(){
    const [items, setItems] = useState([]);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    const [numCart, setNumCart] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [user, setUser] = useState(null);
    const [selectProvince, setSelectProvince] = useState(null);
    const [selectDistrict, setSelectDistrict] = useState(null);
    const [selectWard, setSelectWard] = useState(null);

    useEffect(()=>{
        initCart();
        const getUser = async() =>{
            var response = await getMethod('/api/user/user/user-logged')
            var us = await response.json();
            setUser(us);
        };
        getUser();
        getProvince();
    }, []);

    async function initCart(){
        var response = await getMethod('/api/cart/user/my-cart');
        var list = await response.json();
        setItems(list);
        var num = 0;
        var total = 0;
        for (let i = 0; i < list.length; i++) {
            num += list[i].quantity;
            total += list[i].quantity * list[i].product.price;
        }
        setNumCart(num);
        setTotalAmount(total);
    }

    async function deleteCart(id){
        var con = window.confirm("Confirm?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/cart/user/delete?id=' + id)
        if (response.status < 300) {
            toast.success("Delete success!");
            initCart();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }


    async function upOrDownCart(id, quantity){
        var response = await getMethod('/api/cart/user/up-and-down-cart?id='+id+'&quantity='+quantity);
        initCart();
    }

    async function checkout() {
        var con = window.confirm("Confirm!");
        if (con == false) {
            return;
        }
        var paytype = document.querySelector('input[name="paytype"]:checked').value;
        if (paytype == "vnpay") {
            requestPayMentVnpay();
        }
        if (paytype == "cod") {
            paymentCod();
        }
    }

    async function requestPayMentVnpay() {
        var address = document.getElementById("address").value + ", "+selectWard.WardName+", "+selectDistrict.DistrictName+", "+selectProvince.ProvinceName
        var orderDto = {
            "payType": "VNPAY",
            "fullname": document.getElementById("fullname").value,
            "phone": document.getElementById("phone").value,
            "address": address,
            "note": document.getElementById("note").value,
        }
        window.localStorage.setItem('orderinfor', JSON.stringify(orderDto));
        var returnurl = 'http://localhost:3000/payment';
        var paymentDto = {
            "content": "Payment vnpay",
            "returnUrl": returnurl,
            "notifyUrl": returnurl,
        }
        var res = await postMethodPayload('http://localhost:8080/api/vnpay/urlpayment', paymentDto)
        if (res.status < 300) {
            var result = await res.json();
            window.open(result.url, '_blank');
        }
        else{
            if(res.status == 417){
                var result = await res.json();
                toast.error(result.defaultMessage);
            }
            else{
                toast.error("Error create payment_url");
            }
        }
    }

    async function paymentCod() {
        var address = document.getElementById("address").value + ", "+selectWard.WardName+", "+selectDistrict.DistrictName+", "+selectProvince.ProvinceName
        var orderDto = {
            "payType": "COD",
            "fullname": document.getElementById("fullname").value,
            "phone": document.getElementById("phone").value,
            "address": address,
            "note": document.getElementById("note").value,
        }
        console.log(orderDto);
        var res = await postMethodPayload('/api/invoice/user/create', orderDto)
        if (res.status < 300) {
            Swal.fire({
                title: "Notification",
                text: "Order successful!",
                preConfirm: () => {
                    window.location.href = 'account';
                }
            });
        }
        else{
            if(res.status == 417){
                var result = await res.json();
                toast.error(result.defaultMessage);
            }
            else{
                toast.error("Order error");
            }
        }
    }

    async function getProvince() {
        var response = await getMethod("/api/address/public/province")
        var result = await response.json();
        setProvince(result.data)
        getDistrict(result.data[0].ProvinceID)
        setSelectProvince(result.data[0])
    }

    function loadDistrict(item){
        setSelectDistrict(null)
        getDistrict(item.ProvinceID)
        setSelectProvince(item)
    }

    async function getDistrict(idprovince) {
        var response = await getMethod("/api/address/public/district?provinceId="+idprovince)
        var result = await response.json();
        setDistrict(result.data)
        setSelectDistrict(result.data[0])
        getWard(result.data[0].DistrictID)
        
    }

    function loadWard(item){
        setSelectWard(null)
        getWard(item.DistrictID)
        setSelectDistrict(item)
    }


    async function getWard(iddistrict) {
        var response = await getMethod("/api/address/public/wards?districtId="+iddistrict)
        var result = await response.json();
        console.log(result);
        setWard(result.data != null?result.data:[])
        setSelectWard(result.data != null ?result.data[0]: null)
    }

    
    

    return(
        <>
        <div class="container divcart">
                <div class="row">
                    <div class="col-sm-8">
                        <p class="titlecart">Cart <span class="soluonggiohang">({numCart}) item</span></p>
                        <hr/>
                        <table class="table tablecart">
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                            </tr>
                            <tbody id="listcartDes">
                            {items.map((item, index)=>{
                                return <tr>
                                    <td>
                                        <a href=""><img class="imgprocart" src={item.product.imageBanner}/></a>
                                        <div class="divnamecart">
                                            <a href="" class="nameprocart">{item.product.name}</a>
                                        </div>
                                    </td>
                                    <td>
                                        <p class="boldcart">{item.product.price} $</p>
                                    </td>
                                    <td>
                                        <div class="clusinp">
                                            <button onClick={()=>upOrDownCart(item.id, -1)} class="cartbtn"> - </button>
                                            <input class="inputslcart" value={item.quantity}/>
                                            <button onClick={()=>upOrDownCart(item.id, 1)} class="cartbtn"> + </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="tdpricecart">
                                            <p class="boldcart">{item.product.price * item.quantity} $</p>
                                            <p onClick={()=>deleteCart(item.id)} class="delcart"><i class="fa fa-trash facartde"></i></p>
                                        </div>
                                    </td>
                                </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div class="col-sm-4">
                        <div class="totalbill">
                            <span class="tds">Total Amount: </span><span class="totalamount">{totalAmount} $</span>
                            <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btncheckout">Payment</button>
                        </div>
                        <p class="freeship">FREE SHIPPING WITH ALL ORDERS ON THE WEBSITE</p>
                        <p>You can review your placed orders in your account section</p>
                    </div>
                </div>
            </div>


            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Confirm checkout</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div className='row'>
                        <div className='col-sm-6'>
                            <label className='lbcheckout'>Full name of recipient</label>
                            <input defaultValue={user==null?'':user.fullName} id="fullname" class="form-control fomd"/>

                            <label className='lbcheckout'>Recipient phone number</label>
                            <input defaultValue={user==null?'':user.phone} id="phone" class="form-control fomd"/>

                            <label className='lbcheckout'>Province</label>
                            <Select
                                className="select-container" 
                                onChange={loadDistrict}
                                options={province}
                                value={selectProvince}
                                getOptionLabel={(option) => option.ProvinceName} 
                                getOptionValue={(option) => option.ProvinceID}    
                                closeMenuOnSelect={false}
                                placeholder="Province"
                            />

                            <label className='lbcheckout'>District</label>
                            <Select
                                className="select-container" 
                                onChange={loadWard}
                                options={district}
                                value={selectDistrict}
                                getOptionLabel={(option) => option.DistrictName} 
                                getOptionValue={(option) => option.DistrictID}    
                                closeMenuOnSelect={false}
                                placeholder="District"
                            />

                            <label className='lbcheckout'>Ward</label>
                            <Select
                                className="select-container" 
                                onChange={setSelectWard}
                                options={ward}
                                value={selectWard}
                                getOptionLabel={(option) => option.WardName} 
                                getOptionValue={(option) => option.WardCode}    
                                closeMenuOnSelect={false}
                                placeholder="Ward"
                            />
                            <label className='lbcheckout'>Address detail</label>
                            <input id="address" class="form-control fomd"/>

                            <label className='lbcheckout'>Note</label>
                            <textarea id="note" class="form-control fomd"></textarea>
                        </div>
                        <div className='col-sm-6'>
                        <span class="titlecheckout">Payment type</span>
                            <table class="table table-bordered">
                                <tr onclick="momo.click()">
                                    <td><label class="radiocustom">
                                            <input value="vnpay" id="vnpay" type="radio" name="paytype" checked/>
                                            <span class="checkmark"></span></label></td>
                                    <td><label for="vnpay">Vnpay payment</label></td>
                                    <td><img src={vnpay} class="vnpayimg"/></td>
                                </tr>

                                <tr onclick="code.click()">
                                    <td><label class="radiocustom">
                                            <input value="cod" id="code" type="radio" name="paytype"/>
                                            <span class="checkmark"></span></label></td>
                                    <td><label for="code">Payment upon receipt (COD)</label></td>
                                    <td><i class="fa fa-money paycode"></i></td>
                                </tr>
                            </table>
                            <table className='table table-borderless'>
                                <tr>
                                    <td><span class="boldtext">Total amount to be paid</span></td>
                                    <td><span className='boldtext'>{totalAmount} $</span></td>
                                </tr>
                            </table>
                            <br/><br/>
                            <button onClick={()=>checkout()} type="button" class="btn btn-primary form-control">Order confirmation</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default Cart;
