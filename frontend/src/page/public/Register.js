import React, { useState, useEffect } from 'react';
const RegisterPage = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);
    useEffect(() => {
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
      }, []);
      console.log(location);
      
    return (
        <section className="login_section layout_padding">
        <div className="container">
        <div className="heading_container heading_center">
            <h2>Register</h2>
        </div>
        <div className="row justify-content-center">
            <div className="col-md-6">
            <div className="login_box">
                <form className='row'>
                    <div className='col-sm-6'>
                        <div className="input-box">
                            <label className='lb-bold'>Fullname</label>
                            <input name='fullName' placeholder="Fullname" required />
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="input-box">
                            <label className='lb-bold'>Phone</label>
                            <input name='phone' placeholder="Phone" required />
                        </div>
                    </div>
                    <div className="input-box">
                        <label className='lb-bold'>Email</label>
                        <input name='email' type="email" placeholder="Email" required />
                    </div>
                    <div className='col-sm-6'>
                        <div className="input-box">
                            <label className='lb-bold'>Password</label>
                            <input name='password' type="password" placeholder="Password" required />
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="input-box">
                            <label className='lb-bold'>Re-password</label>
                            <input name='password' type="password" placeholder="RePassword" required />
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="input-box">
                            <label className='lb-bold'>Street</label>
                            <input name='street' placeholder="street" required />
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="input-box">
                            <label className='lb-bold'>City</label>
                            <input name='city' placeholder="city" required />
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="input-box">
                            <label className='lb-bold'>State</label>
                            <input name='state' placeholder="state" required />
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="input-box">
                            <label className='lb-bold'>Country</label>
                            <input name='country' placeholder="country" required />
                        </div>
                    </div>
                <div className="btn-box">
                    <button type="submit" className="login-btn">Regis</button>
                </div>
                </form>
            </div>
            </div>
        </div>
        </div>
    </section>
    )
}

export default RegisterPage
