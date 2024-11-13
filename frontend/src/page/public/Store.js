import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {getMethod} from '../../services/request'
import { useState, useEffect } from 'react'


const StorePage = () => {
    const [items, setItems] = useState([]);
    const [store, setStore] = useState(null);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);
    useEffect(()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
                setError(null); 
                getStore(position.coords.latitude, position.coords.longitude);
              },
              (err) => {
                setError(`Error: ${err.message}`);
              }
            );
        } 
        else {
            setError("Geolocation is not supported by this browser.");
        }
    }, []);

    async function getStore(latitude, longitude){ 
        var response = await getMethod('/api/store/public/findAll-list');
        var result = await response.json();
        for(var i=0; i< result.length; i++){
            var distance = getDistanceFromLatLonInKm(result[i].latitude, result[i].longitude, latitude, longitude)
            result[i].distance = distance
        }
        result.sort((a, b) => a.distance - b.distance);
        console.log(result);
        
        setItems(result)
        if(result.length > 0){
            setStore(result[0])
        }
    };

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; 
        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    return (
        <div className='container contentpage' style={{paddingBottom:'100px'}}>
            <div className="heading_container">
                <h2>List Store</h2>
            </div>
            <div className='row'>
                <div className='col-sm-4'>
                    <div className='headstore'>
                    There are {items.length} stores near your current location
                    </div>
                    <div className='liststores'>
                        {items.map((item, index)=>{
                            return <div onClick={()=>setStore(item)} className='singlestore'>
                                <span className='storename'>{item.name}</span>
                                <span className='addressstor'><i className='fa fa-map-marker'></i> {item.distance.toFixed(2)} Km</span>
                                <span className='addressstor'>{item.street}, {item.city}, {item.state}, {item.country}</span>
                            </div>
                        })}
                    </div>
                </div>
                <div className='col-sm-8'>
                    <div className='iframe-container' dangerouslySetInnerHTML={{__html:store?.mapLocation}}></div>
                </div>
            </div>
        </div>
    )
}

export default StorePage
