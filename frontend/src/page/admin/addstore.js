import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import { getMethod ,uploadSingleFile, uploadMultipleFile, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';




const AdminAddStore = ()=>{
    const [item, setItem] = useState(null);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);
    useEffect(()=>{
        const getItem= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/store/admin/findById?id=' + id);
                var result = await response.json();
                setItem(result)
            }
        };
        getItem();
        loadLocation();
    }, []);

    function loadLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
                setError(null); 
              },
              (err) => {
                setError(`Error: ${err.message}`);
              }
            );
          } else {
            setError("Geolocation is not supported by this browser.");
        }
    }


    async function saveStore(event) {
        event.preventDefault();
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var payload = {
            "id": id,
            "name": event.target.elements.name.value,
            "street": event.target.elements.street.value,
            "city": event.target.elements.city.value,
            "state": event.target.elements.state.value,
            "country": event.target.elements.country.value,
            "latitude": location.latitude,
            "longitude": location.longitude,
            "mapLocation": event.target.elements.mapLocation.value,
        }
        const response = await postMethodPayload('/api/store/admin/create',payload)
        if (response.status < 300) {
            Swal.fire({
                title: "Notification",
                text: "Successful!",
                preConfirm: () => {
                    window.location.href = 'store'
                }
            });
        } else {
            toast.error("Error");
        }
    }

    function setOldLocation(event){
        var check = event.target.checked;
        if(check == true){
            location.latitude = item.latitude
            location.longitude = item.longitude
        }
        else{
            loadLocation();
        }
    }

    return (
        <div>
             <div class="col-sm-12 header-sps">
                    <div class="title-add-admin">
                        <h4>Add/ update store</h4>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                    <div class="form-add">
                        <form class="row" onSubmit={saveStore} method='post'>
                            <div class="col-md-5 col-sm-12 col-12">
                                <label class="lb-form">Store name</label>
                                <input name="name" defaultValue={item?.name} class="form-control"/>
                                <label class="lb-form">street</label>
                                <input name="street" defaultValue={item?.street} class="form-control"/>
                                <label class="lb-form">city</label>
                                <input name="city" defaultValue={item?.city} class="form-control"/>
                                <label class="lb-form">state</label>
                                <input name="state" defaultValue={item?.state} class="form-control"/>
                                <label class="lb-form">country</label>
                                <input name="country" defaultValue={item?.country} class="form-control"/>
                                <label class="lb-form">Map Location</label>
                                <input name="mapLocation" defaultValue={item?.mapLocation} class="form-control"/>
                                <br/>
                                {
                                    item == null ? <></>:
                                    <label class="checkbox-custom">Use old latitude & longitude
                                        <input type="checkbox" onChange={setOldLocation} />
                                        <span class="checkmark-checkbox"></span>
                                    </label>
                                }
                                <br/>
                                <button class="btn btn-primary form-control">Add or update</button>
                            </div>
                        </form>
                    </div>
                    </div>
                </div>
        </div>
    );
}

export default AdminAddStore;