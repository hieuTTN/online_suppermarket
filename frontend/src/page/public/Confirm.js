import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {postMethod} from '../../services/request'

async function handleConfirm(event) {
    event.preventDefault();
    var uls = new URL(document.URL)
    var email = uls.searchParams.get("email");
    var key = event.target.elements.maxacthuc.value
    const res = await postMethod('/api/user/active-account?email=' + email + '&key=' + key);
    if (res.status == 417) {
        var result = await res.json()
        toast.error(result.defaultMessage);
    }
    if(res.status < 300){
        Swal.fire({
            title: "Notification",
            text: "Confirm account success!",
            preConfirm: () => {
                window.location.href = 'login'
            }
        });
    }
};

const ConfirmPage = () => {
      
    return (
        <section className="login_section layout_padding">
        <div className="container">
        <div className="heading_container heading_center">
            <h2>Confirm Account</h2>
        </div>
        <div className="row justify-content-center">
            <div className="col-md-6">
            <div className="login_box">
                <form onSubmit={handleConfirm} autocomplete="off">
                <div className="input-box">
                    <label class="lbform">Enter activation code</label>
                    <input name='key' id="maxacthuc" class="inputlogin"/>
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

export default ConfirmPage
