import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {postMethod} from '../../services/request'

async function forgorPassword(event) {
    event.preventDefault();
    var email = document.getElementById("email").value
    const res = await postMethod('/api/user/public/init-forgotpasss?email=' + email)
    if (res.status < 300) {
        Swal.fire({
            title: "Notification",
            text: "Check your email",
            preConfirm: () => {
                window.location.replace("login")
            }
        });
    }
    if (res.status == 417) {
        var result = await res.json()
        toast.warning(result.defaultMessage);
    }
}

const ForgotPage = () => {
      
    return (
        <section className="login_section layout_padding">
        <div className="container">
        <div className="heading_container heading_center">
            <h2>Forgot password</h2>
        </div>
        <div className="row justify-content-center">
            <div className="col-md-6">
            <div className="login_box">
                <form onSubmit={forgorPassword} autocomplete="off">
                <div className="input-box">
                    <label class="lbform">Enter your email</label>
                    <input name='email' id="email" class="inputlogin"/>
                </div>
                <div className="btn-box">
                    <button  className="login-btn">Confirm</button>
                </div>
                <a href='login' class="text-center">Login</a>
                </form>
            </div>
            </div>
        </div>
        </div>
    </section>
    )
}

export default ForgotPage
