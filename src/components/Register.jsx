import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Register = () => 
{
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigateTo = useNavigate();

    const Submit = (data) => 
    {
        let id = crypto.randomUUID();
        let _data = data.userType==="user" ? {...data, Id:id, purchasedFoods:[]} : {...data, Id:id};
        console.log("Form Submitted:", _data);
        alert("Registration Successful!");
        localStorage.setItem(data.name.trim(),JSON.stringify(_data));
        navigateTo("/login");
    };

    const password = watch("password");

    return (
        <div className="d-flex align-items-center justify-content-center flex-column mt-5 pt-3 p-5 rounded-4 shadow-lg mx-auto" style={{ backgroundColor: "rgba(255, 255, 255, 1)", width: "35%" }}>
            <h1 className="mb-4 text-primary">Register</h1>
            <form onSubmit={handleSubmit(Submit)} className="d-flex flex-column gap-4 w-75">
                
                <div>
                    <input className="form-control" placeholder="Enter Username" autoFocus {...register("name", 
                    {
                        required: { value: true, message: "Name is required", },
                        minLength: { value: 5, message: "Name must be at least 5 characters", },
                        maxLength: { value: 12, message: "Name cannot exceed 12 characters", },
                        pattern: { value: /^[A-Za-z0-9_ ]+$/, message: "Only letters, numbers, spaces, and underscores are allowed", },
                        validate: (value) => localStorage.getItem(value.trim()) == null || "User Already exists"
                    })}/>
                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                </div>

                <div className="mt-3">
                    <input className="form-control" placeholder="Enter Email" {...register("email", 
                    {
                            required: { value: true, message: "Email is required" },
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid Gmail address" },
                            setValueAs: (value) => value.trim()
                    })}/>
                    {errors.email &&  <span className="text-danger"> {errors.email.message} </span> }
                </div>

                <div className="mt-3">
                    <input type="password" className="form-control" placeholder="Enter Password" {...register("password", 
                    {
                        required: { value: true, message: "Password is required" },
                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                        // eslint-disable-next-line no-useless-escape
                        pattern: { value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).+$/, message: "Password must contain at least one uppercase and one special character"},
                        setValueAs: (value) => value.trim()
                    })} />
                    {errors.password && <span className="text-danger"> {errors.password.message} </span> }
                </div>

                <div className="mt-3">
                    <input type="password" className="form-control" placeholder="Re-enter Password" {...register("confirmPassword", 
                    {
                            required: { value: true, message: "Please confirm your password" },
                            validate: (value) => value === password || "Passwords do not match",
                            setValueAs: (value) => value.trim()
                    })}/>
                    {errors.confirmPassword && <span className="text-danger"> {errors.confirmPassword.message}</span>}
                </div>

                <div className="mt-3">
                    <input className="form-control" placeholder="Enter Mobile Number" {...register("mobile", 
                    {
                        required: { value: true, message: "Mobile number is required" },
                        pattern: { value: /^[0-9]{10}$/, message: "Mobile number must be 10 digits" },
                        setValueAs: (value) => value.trim()
                    })} />
                    {errors.mobile && <span className="text-danger"> {errors.mobile.message} </span> }
                </div>

                <div className="mt-3">
                    <select className="form-select" defaultValue="user"{...register("userType")}>
                        <option value="user" className="text-black">User</option>
                        <option value="admin" className="text-black">Admin</option>
                    </select>
                </div>

                <div className="mt-1">
                    <span className="text-center text-black-50">
                        already have an account?{" "}
                        <Link to="/login" className="text-danger">Login Now </Link>
                    </span>
                </div>

                <Button type="submit" variant="primary" size="lg">Submit</Button>
            </form>
        </div>
    );
};

export default Register;
