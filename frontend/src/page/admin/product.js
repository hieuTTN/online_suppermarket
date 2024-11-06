import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, deleteMethod ,uploadSingleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';



var size = 10;
var url = '';
const AdminProduct = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        getProduct();
    }, []);

    async function getProduct() {
        var response = await getMethod('/api/product/public/find-all-page?size='+size+'&sort=id,desc&page='+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/product/public/find-all-page?size='+size+'&sort=id,desc&page='
    }



    async function deleteProduct(id){
        var con = window.confirm("Confirm?");
        if (con == false) {
            return;
        }
        const response = await deleteMethod('/api/product/admin/delete?id=' + id)
        if (response.status < 300) {
            toast.success("Delete success!");
            getProduct();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }


    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-list'></i> Product Managment</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div class="search-container">
                    </div>
                    <a href='add-product' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">List product</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Image banner</th>
                                <th>Product name</th>
                                <th>Price</th>
                                <th>Unit</th>
                                <th>Trademark</th>
                                <th>Category</th>
                                <th class="sticky-col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td><img src={item.imageBanner} className='imgadmin'/></td>
                                    <td>{item.name}</td>
                                    <td>{item.price} $</td>
                                    <td>{item.unit}</td>
                                    <td>{item.tradeMark?.name}</td>
                                    <td>{item.category?.name}</td>
                                    <td class="sticky-col">
                                        <a href={"add-product?id="+item.id} class="edit-btn"><i className='fa fa-edit'></i></a>
                                        <button onClick={()=>deleteProduct(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>

                    <ReactPaginate 
                        marginPagesDisplayed={2} 
                        pageCount={pageCount} 
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'} 
                        pageClassName={'page-item'} 
                        pageLinkClassName={'page-link'}
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link' 
                        previousLabel='Trang trước'
                        nextLabel='Trang sau'
                        activeClassName='active'/>
                </div>
            </div>

        </>
    );
}

export default AdminProduct;