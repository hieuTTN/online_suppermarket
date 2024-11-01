import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,postMethodPayload, deleteMethod} from '../../services/request';
import Swal from 'sweetalert2';


async function saveTrademark(event) {
    event.preventDefault();
    const payload = {
        id: event.target.elements.idcate.value,
        name: event.target.elements.catename.value,
    };
    const res = await postMethodPayload('/api/trademark/admin/create', payload)
    if(res.status < 300){
        toast.success('Success!');
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
    }
    if (res.status == 417) {
        var result = await res.json()
        toast.error(result.defaultMessage);
    }
};

var size = 10;
var url = '';
const AdminTrademark = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [trademark, setTrademark] = useState(null);
    useEffect(()=>{
        const getCategrory = async() =>{
            var response = await getMethod('/api/trademark/public/find-all-page?size='+size+'&sort=id,desc&page='+0);
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
            url = '/api/trademark/public/find-all-page?size='+size+'&sort=id,desc&page='
        };
        getCategrory();
    }, []);


    async function deleteTrademark(id){
        var con = window.confirm("Confirm?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/trademark/admin/delete?id=' + id)
        if (response.status < 300) {
            toast.success("Delete success!");
            var response = await getMethod('/api/trademark/public/find-all-page?size='+size+'&sort=id,desc&page='+0);
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
            url = '/api/trademark/public/find-all-page?size='+size+'&sort=id,desc&page='
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    function clearInput(){
        setTrademark(null);
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
                <strong class="text-left"><i className='fa fa-list'></i> Trademark Managment</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div class="search-container">
                    </div>
                    <button onClick={()=>clearInput()} data-bs-toggle="modal" data-bs-target="#addcate" class="btn btn-primary ms-2"><i className='fa fa-plus'></i></button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">List trademark</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Trademark name</th>
                                <th class="sticky-col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td class="sticky-col">
                                        <a onClick={()=>setTrademark(item)} data-bs-toggle="modal" data-bs-target="#addcate" class="edit-btn"><i className='fa fa-edit'></i></a>
                                        <button onClick={()=>deleteTrademark(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
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

        <div class="modal fade" id="addcate" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
            <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Add or update trademark</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                <div class="modal-body">
                    <form class="col-sm-5 marginauto" onSubmit={saveTrademark} method='post'>
                        <input defaultValue={trademark==null?'':trademark.id} name="idcate" id='idcate' type="hidden" />
                        <label>Name</label>
                        <input defaultValue={trademark==null?'':trademark.name} name="catename" id='catename' type="text" class="form-control" />
                        <br/><br/>
                        <button class="btn btn-success form-control action-btn">Submit</button>
                    </form>
                </div>
            </div>
            </div>
        </div>
        </>
    );
}

export default AdminTrademark;