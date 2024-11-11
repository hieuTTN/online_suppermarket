import { useState, useEffect } from 'react'
import { getMethod ,postMethodPayload, postMethod} from '../../services/request';
import {handleChangePass} from '../../services/auth';
import { toast } from 'react-toastify'


async function checkUser(){
    var url = '/api/user/user/check-role-user';
    const response = await getMethod(url)
    if (response.status > 300) {
        window.location.replace('/login')
    }
}

function AccountPage(){
    const [items, setItems] = useState([]);
    const [itemDetail, setItemDetail] = useState([]);
    const [item, setItem] = useState(null);
    useEffect(()=>{
        checkUser();
        getInvoice();
    }, []);
    const getInvoice = async() =>{
        var response = await getMethod('/api/invoice/user/find-by-user')
        var list = await response.json();
        setItems(list);
    };
    
    function changeLink(e, idtab, idtabdong){
        document.getElementById(idtab).style.display = 'block';
        document.getElementById(idtabdong).style.display = 'none';
        var tabs = document.getElementsByClassName("tabdv");
        for (var i = 0; i < tabs.length; i++) {
            document.getElementsByClassName("tabdv")[i].classList.remove("activetabdv");
        }
        e.target.classList.add('activetabdv')
    }

    const getInvoiceDetail = async(item) =>{
        var response = await getMethod('/api/invoice-detail/user/find-by-invoice?idInvoice='+item.id)
        var list = await response.json();
        setItemDetail(list);
        setItem(item)
      };

    const cancelInvoice = async(id) =>{
        var con = window.confirm("Confirm cancel?");
        if (con == false) {
            return;
        }
        var response = await postMethod('/api/invoice/user/cancel-invoice?idInvoice='+id)
        if(response.status < 300){
            toast.success("Cancel success1");
            getInvoice()
        }
        else{
            toast.warning("Error");
        }
    };


    return(
        <div class="container contentaccount">
        <div class="row">
            <div class="col-lg-3 col-md-3 col-sm-12 col-12 collistcart">
                <div class="navleftacc">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-6 col-6 sinv">
                            <div onClick={(event)=>changeLink(event,'invoice', "changepass")} class="tabdv activetabdv">
                                <i className='fa fa-file'></i> My invoice
                            </div>
                            <div onClick={(event)=>changeLink(event,'changepass','invoice')} class="tabdv">
                                <i className='fa fa-clock'></i> Change password
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-12 col-12 collistcart">
                <div class="navrightacc">
                    <div class="tab-content contentab">
                        <div role="tabpanel" class="tab-pane active" id="invoice">
                            <div class="headeraccount">
                                <div class="right_flex">
                                    <span class="totalInvoice">{items.length} invoice</span>
                                </div>
                            </div>
                            <hr></hr>
                            <table class="table table-cart table-order" id="my-orders-table">
                                <thead class="thead-default">
                                    <tr>
                                        <th>Order code</th>
                                        <th>Order date</th>
                                        <th>Recipient name</th>
                                        <th>Recipient phone</th>
                                        <th>Recipient address</th>
                                        <th>Note</th>
                                        <th>Order status</th>
                                        <th>Total amount</th>
                                        <th>PayType</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {items.map((item, index)=>{
                                return <tr>
                                    <td>{item.id}</td>
                                    <td>{item.createdTime}, {item.createdDate}</td>
                                    <td>{item.receiverName}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>{item.note}</td>
                                    <td>{item.statusInvoice}</td>
                                    <td>{item.totalAmount} $</td>
                                    <td>{item.payType}</td>
                                    <td>
                                    {((item.statusInvoice == "WAITING" || item.statusInvoice== "CONFIRMED") && item.payType == 'COD')?
                                    <i onClick={()=>cancelInvoice(item.id)} class="fa fa-trash pointer"></i>:''}
                                    <i onClick={()=>getInvoiceDetail(item)} data-bs-toggle="modal" data-bs-target="#modaldeail" className='fa fa-eye iconcancel'></i>
                                    </td>
                                </tr>
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="changepass">
                            <div class="col-lg-6 col-md-6 col-sm-12 col-12 passacc">
                                <form onSubmit={handleChangePass}>
                                    <label class="lbacc">Current password *</label>
                                    <input name="currentpass" type="password" class="form-control"/>
                                    <label class="lbacc">New password *</label>
                                    <input name="newpass" type="password" class="form-control"/>
                                    <label class="lbacc">Confirm password *</label>
                                    <input name="renewpass" type="password" class="form-control"/>
                                    <br/>
                                    <button type="submit" class="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modaldeail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Order Detail</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row headerdetail">
                        <div class="col-lg-4 col-md-4 col-sm-12 col-12">
                            <br/><span>Order date: <span class="yls">{item?.createdDate}</span></span>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-12 col-12">
                            <br/><span>Current Order Status: <span class="yls">{item?.statusInvoice}</span></span>
                        </div>
                    </div>
                    <div class="row shipinfor">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                            <span class="ttshipinfor">Address</span>
                            <div class="blockinfor">
                                <p class="reciverName">{item?.receiverName}</p>
                                <span>Delivery address: <span>{item?.address}</span></span>
                                <br/><span class="phoneacc">Phone: <span>{item?.phone}</span></span>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                            <span class="ttshipinfor">Payment</span>
                            <div class="blockinfor">
                                <span id="loaithanhtoan">Payment upon receipt </span>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                            <span class="ttshipinfor">Note</span>
                            <div class="blockinfor">
                                <span id="ghichunh">{item?.note}</span>
                            </div>
                        </div>
                    </div><br/>
                    <h5>Orders Status</h5>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Created date</th>
                                <th>Status</th>
                                <th>Created by</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item?.invoiceStatuses.map((stt, index)=>{
                                return <tr>
                                    <td>{stt.createdDate}</td>
                                    <td>{stt.statusInvoice}</td>
                                    <td>{stt.createdBy.email}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <table class="table table-cart table-order" id="detailInvoice">
                        <thead class="thead-default theaddetail">
                            <tr>
                                <th>Image</th>
                                <th>Product name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                        {itemDetail.map((item, index)=>{
                            return <tr>
                            <td><img src={item.product.imageBanner} className='imgdetailhd'/></td>
                            <td>{item.product.name}</td>
                            <td>{item.price} $</td>
                            <td>{item.quantity}</td>
                        </tr>
                        })}
                        </tbody>
                    </table><br/><br/>
                </div>
            </div>
        </div>
        </div>
    </div>
    );
}

export default AccountPage;
