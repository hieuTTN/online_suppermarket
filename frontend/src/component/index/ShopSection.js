import React from 'react';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useState, useEffect } from 'react'
import {getMethod} from '../../services/request'

var sizepro = 12
var url = '';
function ShopSection() {
  const [itemProduct, setItemProduct] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  useEffect(()=>{
    getProduct();
}, []);

async function getProduct() {
  var response = await getMethod('/api/product/public/find-all-page?size='+sizepro+'&sort=id,desc&page='+0);
  var result = await response.json();
  setItemProduct(result.content)
  setpageCount(result.totalPages)
  url = '/api/product/public/find-all-page?size='+sizepro+'&sort=id,desc&page='
}

  return (
    <section className="shop_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Latest Products</h2>
        </div>
        <div className="row">
        {itemProduct.map((item, index)=>{
           })}
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
          <a href="#">View All Products</a>
        </div>
      </div>
    </section>
  );
}

export default ShopSection;
