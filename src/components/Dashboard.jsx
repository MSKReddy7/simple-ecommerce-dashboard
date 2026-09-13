import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter, Toast, ToastBody, ToastContainer } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

const Dashboard = () =>
{
    
    let currentUser = localStorage.getItem("currentUser");
	const [foods, setFoods] = useState(JSON.parse(localStorage.getItem("foods")));
    const [currentUserData,setCurrentUserData] = useState(JSON.parse(localStorage.getItem(currentUser)) || { purchasedFoods: []});
    const [selectedFood,setSelectedFood] = useState(null);
    
    const [showMessage, setShowMessage] = useState(false);
    const [message,setMessage] = useState("");
    
    
    useEffect(() =>  localStorage.setItem(currentUserData.name, JSON.stringify(currentUserData)) , [currentUserData]);
    useEffect(() => localStorage.setItem("foods", JSON.stringify(foods)), [foods]);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { setShowMessage(true); setMessage(`Welcome ${currentUserData.name} (${currentUserData.userType})`) }, []);
    
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const handleSubmittedData =(data) =>
    {
        setFoods(foods.map((food)=> food.id==selectedFood.id ? {...food, quantity: Number(food.quantity)- Number(data.value)} : food))
        
        let index = currentUserData.purchasedFoods.findIndex((food)=>food.id == selectedFood.id)
        if(index!=-1)
            setCurrentUserData( { ...currentUserData, purchasedFoods: currentUserData.purchasedFoods.map((food,i)=> i==index ? { ...food, quantity: parseInt(food.quantity) + parseInt(data.value) } : food) } )
        else
            setCurrentUserData( { ...currentUserData, purchasedFoods: [ ...currentUserData.purchasedFoods, { ...selectedFood, quantity: parseInt(data.value) } ] } )
        
        setMessage(`Successfully Purchased ${data.value} quantity of ${selectedFood.name} ✅  `);
        setSelectedFood(null);
        setShowMessage(true);
    }

        const [logout, setLogout] = useState(false);
        const [show, setShow] = useState(false);
        const navigateTo = useNavigate();
        
        if (!currentUser) 
            return <Navigate to="/login" replace />;
        
        if(currentUserData.userType == "admin")
            return <Navigate to="/admin" replace />;
        
        const handleLogout = () => {
            localStorage.removeItem("currentUser");
            navigateTo("/login");
        };
        

    return(
        <>
            <div className="bg-primary d-flex align-items-center justify-content-between position-relative w-100">
                <p className="fs-2 ms-3">Dashboard </p>
                <p className="fs-1 me-3">
                    <span className="fs-3 me-5"> {"Hello, "+currentUserData.name+" ("+currentUserData.userType+")"} </span>
                    <FontAwesomeIcon icon={faUser} style={{ cursor: "pointer" }} onClick={() => setLogout(!logout)}/>
                    {logout &&
                        <button
                        className="position-absolute shadow p-2 rounded btn btn-danger"
                            style={{ top: "60px", right:"5px" }} onClick={()=>setShow(true)}>Logout</button>
                    }
                </p>

                <Modal show={show} backdrop="static" keyboard={false} centered>
                    <ModalBody>
                        <p className="fs-3 mb-5 text-center fw-medium text-primary">Are You Sure Want To Quit ?</p>
                        <div className="d-flex align-items-center justify-content-between m-4 ">
                            <Button variant="success" size="lg" onClick={ handleLogout }>Yes</Button>
                            <Button variant="danger" size="lg" onClick={ ()=> { setShow(false); setLogout(false) } }>NO</Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>

            <div className="d-flex align-items-center flex-column justify-content-center text-primary p mt-5">
			    <h1>Purchased List</h1>
				{currentUserData.purchasedFoods.length==0 && <p>Empty</p>}
			</div>

			<div className="d-flex align-items-center justify-content-center">
				<table className="table table-bordered w-50 text-center">
					<thead>
						{currentUserData.purchasedFoods.length>0 &&
							<tr className="table-success">
								<th>S.No</th>
								<th>Name</th>
								<th>Quality</th>
								<th>Quantity Purchased</th>
							</tr>
						}
					</thead>
					<tbody>
						{currentUserData.purchasedFoods.map((food, i) => (
							<tr key={food.id}>
								<td>{i + 1}</td>
								<td>{food.name}</td>
								<td>{food.quality}</td>
								<td>{food.quantity}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
            
            <div className="d-flex align-items-center flex-column justify-content-center text-danger p mt-5">
			    <h1>Products List</h1>
				{foods.length==0 && <p>Empty</p>}
			</div>

			<div className="d-flex align-items-center justify-content-center">
				<table className="table table-bordered mt-3 w-50 text-center">
					<thead>
						{foods.length>0 &&
							<tr className="table-success">
								<th>S.No</th>
								<th>Name</th>
								<th>Quality</th>
								<th>Quantity Available</th>
								<th>Actions</th>
							</tr>
						}
					</thead>
					<tbody>
						{foods.map((food, i) =>
							<tr className={food.quantity == 0 ? "table-danger" : ""} key={food.id}>
								<td>{i + 1}</td>
								<td>{food.name}</td>
								<td>{food.quality}</td>
								<td>{food.quantity}</td>

								{food.quantity>0 && <td><button className="btn btn-warning btn-sm me-2" onClick={() => setSelectedFood(food)}>Buy</button></td>}
								{food.quantity==0 && <td>Unavailable</td>}
							</tr>
						)}
					</tbody>
				</table>
			</div>

            <Modal show={selectedFood!=null}  onHide={()=>setSelectedFood(null)} >
                <form onSubmit={handleSubmit(handleSubmittedData)}>
                    <ModalBody className="d-flex justify-content-center align-items-center flex-column" >
                        {selectedFood!=null && 
                            <input className="form-control w-75 m-1" autoFocus placeholder={`Enter Value  (1-${selectedFood.quantity})`} {...register("value",
                            {
                                required: "Value is required",
                                min:{ value:1, message:"min value is 1" },
                                max:{ value:selectedFood.quantity, message:`max value is ${selectedFood.quantity}` },
                            })}/>}
                    {errors.value && <p className="text-danger" style={{ position:"relative", left:"-120px"}}>{errors.value.message}</p>}
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit">Add</Button>
                    </ModalFooter>
                </form>
            </Modal>

            <ToastContainer position="top-center"  className="p-3">
                <Toast show={showMessage} onClose={() => setShowMessage(false)} delay={2000} autohide bg="success" >
                    <ToastBody>
                        {message}
                    </ToastBody>
                </Toast>
            </ToastContainer>

        </>
    );
};

export default Dashboard;
