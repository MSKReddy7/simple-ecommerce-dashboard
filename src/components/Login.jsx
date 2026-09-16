import { useState } from "react";
import { Button, Toast, ToastBody, ToastContainer } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

const Login = () => 
{

    const { register, handleSubmit } = useForm();
    const navigateTo = useNavigate();
    
    const [showMessage, setShowMessage] = useState(false);
    const [message,setMessage] = useState("");

    const onSubmit = (data) => 
    {
        const username = data.name.trim();
        const password = data.password.trim();
        const userType = data.userType;
 
        const UserRegistredData = localStorage.getItem(username);

        if (UserRegistredData!=null)
        {
            const userData = JSON.parse(UserRegistredData);
            if (userData.password === password && userType === userData.userType) 
            {
                localStorage.setItem("currentUser",username);
                setMessage(`Login Success ✅`);
                setShowMessage(true);
                setTimeout(() => { navigateTo(userType === "user" ? "/dashboard" : "/admin", { replace: true })}, 1000);
            }
            else
            {
                setMessage("Login failed wrong credentials ❌");
                setShowMessage(true);
            }
        }
        else
        {
            setMessage("Login failed wrong credentials ❌");
            setShowMessage(true);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center flex-column mt-5 pt-3 p-5  rounded-4 shadow-lg mx-auto" style={{ backgroundColor: "rgba(255, 255, 255, 1)", width: "35%"}}>
            <h1 className="mb-4 text-primary">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-4 w-75">
                <div className="mt-3">
                    <input className="form-control" placeholder="Enter Username" autoFocus {...register("name",
                    {
                        setValueAs: (value) => value.trim()
                    })}/>
                </div>

                <div className="mt-2">
                    <input type="password" className="form-control" placeholder="Enter Password" {...register("password")} />
                </div>

                <div className="mt-2">
                    <select className="form-select" defaultValue="user"{...register("userType")}>
                        <option value="user" className="text-black">User</option>
                        <option value="admin" className="text-black">Admin</option>
                    </select>
                </div>

                <div>
                    <span className="text-center text-black-50">don't have an account before ? <Link to="/register" className="text-danger">Register Now</Link></span>
                </div>
                <Button type="submit" variant="primary" size="lg">Login</Button>
            </form>
            <ToastContainer position="top-center"  className="p-3">
                <Toast show={showMessage} onClose={() => setShowMessage(false)} delay={2000} autohide bg="success" >
                    <ToastBody>
                        {message}
                    </ToastBody>
                </Toast>
            </ToastContainer>
        </div>
        
    );
};

export default Login;