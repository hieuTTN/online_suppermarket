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
const Product = () => {
  const [itemProduct, setItemProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trademark, setTrademark] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [payload, setPayload] = useState(null);
  const [price, setPrice] = useState([10, 300]); 
  const [selectedCategory, setSelectedCategory] = useState([]); 
  const [selectedTrademark, setSelectedTrademark] = useState([]); 

  useEffect(()=>{
    getInitProduct();
    getCategory();
    getTrademark();
  }, []);

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
    var response = await postMethodPayload('/api/product/public/find-search-full?size='+sizepro+'&sort=id,desc&page='+0, obj);
    var result = await response.json();
    setItemProduct(result.content)
    setpageCount(result.totalPages)
    url = '/api/product/public/find-search-full?size='+sizepro+'&sort=id,desc&page='
  }

  const handlePageClick = async (data)=>{
    var currentPage = data.selected
    var response = await postMethodPayload(url+currentPage, payload)
    var result = await response.json();
    setItemProduct(result.content)
    setpageCount(result.totalPages)
  }

  const handleChange = (event, newValue) => {
    setPrice(newValue);
  };
  
  async function getCategory() {
    var response = await getMethod('/api/category/public/findAll-list');
    var result = await response.json();
    setCategories(result)
  }
  async function getTrademark() {
    var response = await getMethod('/api/trademark/public/findAll');
    var result = await response.json();
    setTrademark(result)
  }

  return (
    <div className='container'>
      <div className='row contentpage'>
      <div className="heading_container heading_center">
        <h2>Product</h2>
      </div>
      <div className='col-sm-4'>
        <div>
            <Typography variant="h6">Price Range</Typography>
            <Slider
                value={price}
                onChange={handleChange}
                valueLabelDisplay="auto"
                min={0}
                max={2000}
            />
            <Typography>Selected range: ${price[0]} - ${price[1]}</Typography>
        </div><br/>
        <h5>Choose categories</h5>
          <Select
              className="select-container selectheader" 
              options={categories}
              onChange={setSelectedCategory}
              value={selectedCategory}
              getOptionLabel={(option) => option.name} 
              getOptionValue={(option) => option.id}    
              isMulti
              placeholder="Choose categories"
          /><br/>
        <h5>Choose trademarks</h5>
          <Select
              className="select-container selectheader" 
              options={trademark}
              onChange={setSelectedTrademark}
              value={selectedTrademark}
              getOptionLabel={(option) => option.name} 
              getOptionValue={(option) => option.id}    
              isMulti
              placeholder="Choose trademarks"
          />

          <br/><br/>
          <button className='btn btn-primary form-control'>Filter</button>
      </div>
      <div className='col-sm-8'>
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
                        <h6>{product.name}</h6>
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

export default Product