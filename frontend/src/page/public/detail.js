import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {getMethod,uploadMultipleFile, postMethodPayload} from '../../services/request'
import Swal from 'sweetalert2'


var token = localStorage.getItem("token");

function DetailProduct(){
    const [product, setProduct] = useState(null);
    const [productImage, setProductImage] = useState([]);
    const [comments, setComment] = useState([]);
    const [productLq, setProductLq] = useState([]);
    useEffect(()=>{
      getProduct();
      const getComment = async() =>{
        initComment();
      };
      getComment();
      const getProductLq = async() =>{
        // var uls = new URL(document.URL)
        // var id = uls.searchParams.get("id");
        // var result = await getMethod('http://localhost:8080/api/product/public/san-pham-lien-quan?id=' + id);
        // setProductLq(result)
      };
      getProductLq();
  }, []);

  async function getProduct(){ 
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var response = await getMethod('/api/product/public/findById?id=' + id);
    var result = await response.json();
    setProduct(result)
    setProductImage(result.productImages)
  };


  const initComment = async() =>{
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    const response = await getMethod('/api/product-comment/public/find-by-product?idproduct=' + id)
    var result = await response.json();
    setComment(result)
  };


  async function saveComment() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var comment = {
        "content": document.getElementById("noidungbl").value,
        "product": {
            "id": id
        }
    }
    const response = await postMethodPayload('http://localhost:8080/api/product-comment/user/create', comment)
    if (response.status < 300) {
        toast.success("Post comment success!");
    } else {
        toast.error("Error!");
    }
}

async function deleteComment(id){
    var con = window.confirm("Confirm?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/product-comment/user/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toast.success("xóa thành công!");
        initComment();
    }
    if (response.status == 417) {
        var result = await response.json()
        toast.warning(result.defaultMessage);
    }
}


const addToCart = async () => {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    const result = await postMethodPayload('/api/cart/user/create?idproduct='+id);
    if(result.status < 300){
        toast.success("Add to cart success");
        const response = await getMethod('/api/cart/user/count-cart');
        var numc = await response.text();
        document.getElementById("numbercartheader").innerHTML = numc
    }
    else{
        toast.warning("Hãy đăng nhập");
    }
};

const muaNgay = async () => {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    const result = await postMethodPayload('http://localhost:8080/api/cart/user/create?idproduct='+id);
    if(result.status < 300){
        window.location.href = 'cart'
    }
    else{
        toast.warning("Hãy đăng nhập");
    }
};

function changeImage(link){
    document.getElementById("imgdetailpro").src = link
}

    return(
        <>
        <div className='container divdetailproduct'>
        <div class="row">
            <div class="col-sm-8">
                <div className='sessioncontent'>
                <h4 class="pronamedetail" id="detailnamepro">{product == null?'':product.name}</h4>
                <div class="row">
                    <div class="col-sm-5">
                        <img id="imgdetailpro" src={product == null?'':product.imageBanner} class="imgprodetail"/>
                        <div class="listimgdetail row" id="listimgdetail">
                        <div class="col-lg-2 col-md-2 col-sm-2 col-2 singdimg">
                        <img onClick={()=>changeImage(product == null?'':product.imageBanner)} src={product == null?'':product.imageBanner} className='imgldetail'/>
                        </div>
                        {productImage.map((item, index)=>{
                            return <div class="col-lg-2 col-md-2 col-sm-2 col-2 singdimg">
                                <img onClick={()=>changeImage(item.linkImage)} src={item.linkImage} className={index != 0 ? 'imgldetail':'imgldetail'}/>
                            </div>
                        })}
                        </div>
                    </div>
                    <div class="col-sm-7">
                        <div>
                            <strong class="newpricestr" id="pricedetail">{product == null?'':product.price} $</strong>
                            <span class="oldpricestr" id="oldpricestr">{product == null?'':product.oldPrice == null?'':formatMoney(product.oldPrice)}</span>
                        </div>
                        <div className='divcommit'>
                            <h5>All products we sell are guaranteed</h5>
                            <span className='spcommit'><i className='fa fa-check'></i> Product origin determined</span>
                            <span className='spcommit'><i className='fa fa-check'></i> Long shelf life</span>
                            <span className='spcommit'><i className='fa fa-check'></i> Return the product if found to be expired</span>
                        </div>
                        <div class="btnbuynow">
                            <button onClick={()=>muaNgay()} class="btnbuynowac">Buy Now <span class="lbgiaotannha">Home delivery</span></button>
                            <button onClick={()=>addToCart()} class="btnaddtocart"><i class="fa fa-shopping-cart iconcartdt"></i> Add to cart</button>
                        </div>
                    </div>
                </div>
                <div class="divdesctiption">
                    <h5 className='tieudecamket'>Product description</h5>
                    <div id="descriptiondetail" dangerouslySetInnerHTML={{__html:product == null?'':product.description}}></div>
                </div>
                <div class="phanhoisanpham">
                    <p class="titledes">Product comment</p>
                    <div class="listcautlct" id="listcautlct">
                    {comments.map((item, index)=>{
                        return <div class="singlectlct">
                            <div class="row">
                                <div class="col-11">
                                    <div class="d-flex nguoidangctl">
                                        <span class="usernamedangctl">{item.user.fullName == null ?item.user.email:item.user.fullName}</span>
                                        <span class="ngaytraloi">{item.createdTime}, {item.createdDate}</span>
                                        {item.isMyComment==true?<span class="deletecmt"><i onClick={()=>deleteComment(item.id)} class="fa fa-trash pointer"></i></span>:''}
                                    </div>
                                    <div>{item.content}</div>
                                </div>
                            </div>
                        </div>
                        })}
                    </div>
    
                    {token != null && (
                    <div className='divpostcomment'>
                        <label class="titledes">Post your comment</label>
                        <textarea id="noidungbl" class="form-control"></textarea>
                        <button onClick={()=>saveComment()} class="btn btn-primary form-control">Comment</button>
                    </div>
                    )}
                </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div className=''>
                    <h5>Sản phẩm liên quan</h5>
                    <div className='row'>
                    {productLq.map((item, index)=>{
                        return <div className='col-6'>
                            <div className='singleproduct'>
                            <a href={"detail?id="+item.id}><img src={item.imageBanner} className='imgproductindex'/></a>
                            <div className='contentprodiv'>
                                <a href={"detail?id="+item.id} className='tenspindex tenspid'>{item.name}</a>
                                <p className='tenspindex giaspindex'>{formatMoney(item.price)} <span className='giacuspindex'>{item.oldPrice == null?'':formatMoney(item.oldPrice)}</span> </p>
                                <button onClick={()=>addToCart(item.id)} className='btngiohang'>Giỏ hàng</button>
                            </div>
                            </div>
                        </div>
                        })}
                    </div>
                </div>
            </div>
           </div>
        </div>
        </>
    );
}

export default DetailProduct;
