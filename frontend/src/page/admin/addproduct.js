import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import { getMethod ,uploadSingleFile, uploadMultipleFile, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';


var token = localStorage.getItem("token");

var linkbanner = '';
var description = '';
const listFile = [];
async function saveProduct(event) {
    event.preventDefault();
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var listLinkImg = await uploadMultipleFile(listFile);
    var ims = await uploadSingleFile(document.getElementById("imgbanner"))
    if(ims != null){
        linkbanner = ims
    }
    var payload = {
        "id": id,
        "name": event.target.elements.tensp.value,
        "imageBanner": linkbanner,
        "price": event.target.elements.price.value,
        "unit": event.target.elements.unit.value,
        "quantity": event.target.elements.quantity.value,
        "description": description,
        "category": {
            "id":event.target.elements.category.value
        },
        "tradeMark": {
            "id":event.target.elements.trademark.value
        },
        "linkImages":listLinkImg,
    }
    const response = await postMethodPayload('/api/product/admin/create',payload)
    if (response.status < 300) {
        Swal.fire({
            title: "Notification",
            text: "Successful!",
            preConfirm: () => {
                window.location.href = 'product'
            }
        });
    } else {
        toast.error("Error");
        document.getElementById("loading").style.display = 'none'
    }
}


const AdminAddProduct = ()=>{
    const editorRef = useRef(null);
    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState([]);
    const [trademark, setTrademark] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTrademark, setSelectedTrademark] = useState(null);
    useEffect(()=>{
        const getProduct= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/product/admin/findById?id=' + id);
                var result = await response.json();
                setProduct(result)
                linkbanner = result.imageBanner
                description = result.description;
                setSelectedCategory(result.category)
                setSelectedTrademark(result.tradeMark)
            }
        };
        getProduct();

        const getSelect= async() =>{
            var response = await getMethod("/api/category/public/findAll-list");
            var list = await response.json();
            setCategory(list)
            var response = await getMethod("/api/trademark/public/findAll");
            var list = await response.json();
            setTrademark(list)
        };
        getSelect();
    }, []);

    function handleEditorChange(content, editor) {
        description = content;
    }

    function openChonAnh(){
        document.getElementById("choosefile").click();
    }


    async function deleteImage(id) {
        var con = window.confirm("Bạn muốn xóa ảnh này?");
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/product-image/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("xóa ảnh thành công!");
            document.getElementById("imgdathem" + id).style.display = 'none';
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }
    console.log(product);
    return (
        <div>
             <div class="col-sm-12 header-sps">
                    <div class="title-add-admin">
                        <h4>Add/ update product</h4>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                    <div class="form-add">
                        <form class="row" onSubmit={saveProduct} method='post'>
                            <div class="col-md-4 col-sm-12 col-12">
                                <label class="lb-form">Product name</label>
                                <input name="tensp" defaultValue={product?.name} class="form-control"/>
                                <label class="lb-form">Price</label>
                                <input name="price" defaultValue={product?.price} class="form-control"/>
                                <label class="lb-form">Unit</label>
                                <input name="unit" defaultValue={product?.unit} class="form-control"/>
                                <label class="lb-form">Quantity</label>
                                <input name="quantity" defaultValue={product?.quantity} class="form-control"/>
                                <label class="lb-form">Category</label>
                                <Select
                                    className="select-container" 
                                    options={category}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    getOptionLabel={(option) => option.name} 
                                    getOptionValue={(option) => option.id}    
                                    name='category'
                                    placeholder="Select category"
                                />
                                <label class="lb-form">Trademark</label>
                                <Select
                                    className="select-container" 
                                    options={trademark}
                                    value={selectedTrademark}
                                    onChange={setSelectedTrademark}
                                    getOptionLabel={(option) => option.name} 
                                    getOptionValue={(option) => option.id}    
                                    name='trademark'
                                    placeholder="Select trademark"
                                />
                                <br/>
                                <div class="loading" id="loading">
                                    <div class="bar1 bar"></div>
                                </div><br/>
                                <button class="btn btn-primary form-control">Add or update</button>
                            </div>
                            <div class="col-md-8 col-sm-12 col-12">
                                <label class="lb-form">Image banner</label>
                                <input id="imgbanner" type="file" class="form-control"/>
                                <img src={product==null?'':product.imageBanner} id="imgpreproduct" className='imgadmin'/>
                                <br/><br/><label class="lb-form">More photo</label>
                                <input accept="image/*" onChange={()=>previewImages()} id="choosefile" multiple type="file" className='hidden'/>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="row" id="preview">
                                            <div class="col-md-3" id="chon-anhs">
                                                <div id="choose-image" class="choose-image" onClick={()=>openChonAnh()}>
                                                    <p><i class="fas fa-camera" id="camera"></i></p>
                                                    <p id="numimage">Select more photos</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {
                                        product == null ? <></> : <div class="row">
                                        <div class="col-sm-12">
                                            <h4 className='lbanhdathem'>Photo added</h4>
                                        </div>
                                        <div id="listanhdathem" class="row">
                                            {product==null?'': 
                                            product.productImages.map((item=>{
                                                return <div id={"imgdathem"+item.id} class="col-md-3 col-sm-4 col-4">
                                                <img  src={item.linkImage} class="image-upload"/>
                                                <button type='button' onClick={()=>deleteImage(item.id)} class="btn btn-danger form-control">Xóa ảnh</button>
                                            </div>
                                            })) }
                                        </div>
                                    </div>
                                       
                                    }
                                </div>
                                <label class="lb-form lbmotadv">Description</label>
                                <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/f6s0gxhkpepxkws8jawvfwtj0l9lv0xjgq1swbv4lgcy3au3/tinymce/6/tinymce.min.js'}
                                        onInit={(evt, editor) => editorRef.current = editor} 
                                        initialValue={product==null?'':product.description}
                                        value={product==null?'':product.description}
                                        onEditorChange={handleEditorChange}/>
                            </div>
                        </form>
                    </div>
                    </div>
                </div>
        </div>
    );
}

function previewImages() {
    var files = document.getElementById("choosefile").files;
    for (var i = 0; i < files.length; i++) {
        listFile.push(files[i]);
    }

    var preview = document.querySelector('#preview');

    for (i = 0; i < files.length; i++) {
        readAndPreview(files[i]);
    }

    function readAndPreview(file) {

        var reader = new FileReader(file);

        reader.addEventListener("load", function() {
            document.getElementById("chon-anhs").className = 'col-sm-3';
            document.getElementById("chon-anhs").style.height = '100px';
            document.getElementById("chon-anhs").style.marginTop = '5px';
            document.getElementById("choose-image").style.height = '120px';
            document.getElementById("numimage").innerHTML = '';
            document.getElementById("camera").style.fontSize = '20px';
            document.getElementById("camera").style.marginTop = '40px';
            document.getElementById("camera").className = 'fas fa-plus';
            document.getElementById("choose-image").style.width = '90%';

            var div = document.createElement('div');
            div.className = 'col-md-3 col-sm-6 col-6';
            div.style.height = '120px';
            div.style.paddingTop = '5px';
            div.marginTop = '100px';
            preview.appendChild(div);

            var img = document.createElement('img');
            img.src = this.result;
            img.style.height = '85px';
            img.style.width = '90%';
            img.className = 'image-upload';
            img.style.marginTop = '5px';
            div.appendChild(img);

            var button = document.createElement('button');
            button.style.height = '30px';
            button.style.width = '90%';
            button.innerHTML = 'xóa'
            button.className = 'btn btn-warning';
            div.appendChild(button);

            button.addEventListener("click", function() {
                div.remove();
                console.log(listFile.length)
                for (i = 0; i < listFile.length; i++) {
                    if (listFile[i] === file) {
                        listFile.splice(i, 1);
                    }
                }
                console.log(listFile.length)
            });
        });

        reader.readAsDataURL(file);

    }

}

export default AdminAddProduct;