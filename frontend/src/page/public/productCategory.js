import React from 'react'
import { useState, useEffect } from 'react'
import {getMethod, postMethodPayload} from '../../services/request'
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Select from 'react-select';

var sizepro = 12
var url = '';
const ProductCategory = () => {
  const [itemProduct, setItemProduct] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [payload, setPayload] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(()=>{
    getInitProduct();
    getCate();
  }, []);

  async function getCate() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("category");
    var response = await getMethod('/api/category/public/findById?id='+id);
    var result = await response.json();
    console.log(result);
    
    setCategory(result)
  }

  async function getInitProduct() {
    var uls = new URL(document.URL)
    var category = uls.searchParams.get("category");
    var arrCategory = [];
    if(category != null){
      arrCategory.push(category)
    }
    var obj = {
      categoryId:arrCategory
    }
    setPayload(obj)
    var sort = document.getElementById("sort").value
    var response = await postMethodPayload('/api/product/public/find-search-full?size='+sizepro+'&sort='+sort+'&page='+0, obj);
    var result = await response.json();
    setItemProduct(result.content)
    setpageCount(result.totalPages)
    url = '/api/product/public/find-search-full?size='+sizepro+'&sort='+sort+'&page='
  }

  const handlePageClick = async (data)=>{
    var currentPage = data.selected
    var response = await postMethodPayload(url+currentPage, payload)
    var result = await response.json();
    setItemProduct(result.content)
    setpageCount(result.totalPages)
  }




  return (
    <div className='container'>
      <div className='row contentpage'>
      <div className="heading_container heading_center">
        <h2>{category?.name}</h2>
      </div>
      <div className='col-sm-12'>
        <div className='row'>
            <div className='col-sm-3'>
                <label>Sort by</label>
                <select onChange={getInitProduct} id='sort' className='form-control'>
                    <option value="price,asc">Prices range from low to high</option>
                    <option value="price,desc">Prices range from high to low</option>
                    <option value="name,asc">Name a to z</option>
                    <option value="name,desc">Name z to a</option>
                </select>
            </div>
        </div>
      </div>
      <div className='col-sm-12'>
        <section className="shop_section layout_padding">
          <div className="container">
            <div className="row">
              {itemProduct.map((product, index) => (
                <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
                  <div className="box">
                    <a href={'detail?id='+product.id} className='taga'>
                      <div className="img-box">
                        <img src={product.imageBanner} alt={product.name} />
                      </div>
                      <div className="detail-box">
                        <h6 className='product-name'>{product.name}</h6>
                        <h6>
                          <span>${product.price}</span>
                        </h6>
                      </div>
                      <div className="new">
                        <span>New</span>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="btn-box">
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
        </section>
      </div>
    </div>
    </div>
  )
}

export default ProductCategory