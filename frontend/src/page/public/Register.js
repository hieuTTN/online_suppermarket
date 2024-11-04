import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {postMethodPayload} from '../../services/request'

async function handleRegis(event) {
    event.preventDefault();
    if(event.target.elements.password.value != event.target.elements.repassword.value){
        toast.error("Password not match");
        return;
    }
    const payload = {
        email: event.target.elements.email.value,
        password: event.target.elements.password.value,
        fullName: event.target.elements.fullName.value,
        phone: event.target.elements.phone.value,
        street: event.target.elements.street.value,
        city: event.target.elements.city.value,
        state: event.target.elements.state.value,
        country: event.target.elements.country.value,
    };
    const res = await postMethodPayload('/api/user/regis',payload)
    var result = await res.json()
    console.log(result);
    if (res.status == 417) {
        toast.error(result.defaultMessage);
    }
    if(res.status < 300){
        Swal.fire({
            title: "Notification",
            text: "Regis success! Check your email!",
            preConfirm: () => {
                window.location.href = 'confirm?email=' + result.email
            }
        });
    }
};

const RegisterPage = () => {
      
    return (
        <section className="login_section layout_padding">
        <div className="container">
        <div className="heading_container heading_center">
            <h2>Register</h2>
        </div>
        <div className="row justify-content-center">
            <div className="col-md-6">
            <div className="login_box">
                <form onSubmit={handleRegis} className='row'>
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
                            <input name='repassword' type="password" placeholder="RePassword" required />
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
