import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {getMethod} from '../../services/request'
import { useState, useEffect } from 'react'


const StorePage = () => {
    const [items, setItems] = useState([]);
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
        setItems(result)
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
        <div className='container contentpage'>
            <div className="heading_container">
                <h2>List Store</h2>
            </div>
            <div className='row'>
                {items.map((item, index)=>{
                    return <div className='col-sm-4'>
                        <div className='single-store'>
                            <div dangerouslySetInnerHTML={{__html:item.mapLocation}}></div>
                            <div className='contentstore'>
                                <h4>{item.name}</h4>
                                <strong>
                                    Address: {item.street}, {item.city}, {item.state}, {item.country}
                                </strong><br/>
                                Distance to you: <span>{item.distance.toFixed(2)} Km</span>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default StorePage
