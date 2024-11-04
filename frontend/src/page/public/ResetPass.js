import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {postMethod} from '../../services/request'

async function forgorPassword(event) {
    event.preventDefault();
    var password = event.target.elements.password.value
    var repassword = event.target.elements.repassword.value
    var uls = new URL(document.URL)
    var email = uls.searchParams.get("email");
    var key = uls.searchParams.get("key");
    if(password != repassword){
        toast.warning("Password not match");
        return;
    }
    const res = await postMethod('/api/user/public/finish-reset-pass?email=' + email+"&key="+key+"&password="+password)
    if (res.status < 300) {
        Swal.fire({
            title: "Notification",
            text: "Reset password success",
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

const ResetPassPage = () => {
      
    return (
        <section className="login_section layout_padding">
        <div className="container">
        <div className="heading_container heading_center">
            <h2>Reset password</h2>
        </div>
        <div className="row justify-content-center">
            <div className="col-md-6">
            <div className="login_box">
                <form onSubmit={forgorPassword} autocomplete="off">
                <div className="input-box">
                    <label class="lbform">Enter new password</label>
                    <input type='password' name='password' class="inputlogin"/>
                </div>
                <div className="input-box">
                    <label class="lbform">Enter renew password</label>
                    <input type='password' name='repassword' class="inputlogin"/>
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

export default ResetPassPage
