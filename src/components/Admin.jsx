import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Button, Modal, ModalBody, Toast, ToastContainer, ToastBody } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";


const Admin = () => 
{
	const [foods, setFoods] = useState(JSON.parse(localStorage.getItem("foods")) || []);
	const [editFoodIndex, setEditFoodIndex] = useState(null);
	const [formData, setFormData] = useState({name:"",quality:"",quantity:""});
	
	useEffect(() => {localStorage.setItem("foods", JSON.stringify(foods)); }, [foods]);

	const [showMessage, setShowMessage] = useState(false);
    const [message,setMessage] = useState("");

	const handle_add_edit = () => 
	{
		if (!formData.name || !formData.quality || !formData.quantity) 
			return;
		let updatedFoods = [...foods];
		if (editFoodIndex !== null)
		{
			updatedFoods[editFoodIndex] = {...updatedFoods[editFoodIndex], ...formData , quantity: Math.max(0,Number(formData.quantity))}
			setMessage(`✅ successfully edited food`);
			setEditFoodIndex(null);
		}
		else
		{
			const index = foods.findIndex((food) => food.name === formData.name && food.quality === formData.quality);

			if (index!=-1)
			{
				updatedFoods[index] = {...updatedFoods[index], quality: formData.quality, quantity: Math.max(0, Number(updatedFoods[index].quantity)+Number(formData.quantity))}
				setMessage(`✅ ${formData.quantity} quantity added to existing ${formData.name}`);
			}
			else
			{
				updatedFoods = [...foods, { id: crypto.randomUUID(), ...formData, quantity: Math.max(0,Number(formData.quantity)) }];
				setMessage(`✅ new food added`);
			}
		}
		handleDuplicateFood(updatedFoods);
		setFormData({ name:"", quality:"", quantity:""});	
	};

	const handleEdit = (food,i) =>
	{
		setFormData({ name: food.name, quality: food.quality, quantity: food.quantity });
    	setEditFoodIndex(i);
	}

	const handleDelete = (id) => setFoods(foods.filter((item)=>item.id !=id))

	const handleDuplicateFood = (updatedFoods) =>
	{
		let deleteFoods = new Set();
		for(let i=0; i<updatedFoods.length; i++)
		{
			for(let j=i+1; j<updatedFoods.length;j++)
			{
				if(updatedFoods[i].name === updatedFoods[j].name && updatedFoods[i].quality === updatedFoods[j].quality)
				{
					updatedFoods[i].quantity = Math.max(0, Number(updatedFoods[i].quantity) + Number(updatedFoods[j].quantity) )
					deleteFoods.add(updatedFoods[j].id)
				}
			}
		}
		if(deleteFoods.size!=0) setMessage(`foods data merged `)
		updatedFoods = updatedFoods.filter((food) => !deleteFoods.has(food.id))
		setFoods(updatedFoods)
		setShowMessage(true);
	}

	const [logout, setLogout] = useState(false);
	const [show, setShow] = useState(false);
    const navigateTo = useNavigate();
	
    let currentUser = localStorage.getItem("currentUser");
	let currentUserData = localStorage.getItem(currentUser)?JSON.parse(localStorage.getItem(currentUser)) : {purchasedFoods: [] };

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => { setMessage(currentUserData==null ? "" : `Welcome ${currentUserData.name} (${currentUserData.userType})`); setShowMessage(true)} , []);
	
	if (!currentUser)
		return <Navigate to="/login" replace />;

	if(currentUserData.userType === "user")
	{
		return (
			<>
				<Modal show={true} backdrop="static" keyboard={false} centered>
					<ModalBody>
						<p className="fs-3 mb-3 text-center fw-medium text-danger">Only for Admin's</p>
						<p className="fs-6 mb-5 text-center fw-medium text-black">Access Restricted to Users</p>
						<div className="d-flex align-items-center justify-content-center m-4">
							<Button variant="success" size="lg" onClick={() => navigateTo("/dashboard",{ replace:true }) }>Okay</Button>
						</div>
					</ModalBody>
				</Modal>
			</>
		);
	}

	const handleLogout = () => {
		localStorage.removeItem("currentUser");
		navigateTo("/login", { replace: true });
	};
	
    return (
		<>
			<div className="bg-primary d-flex align-items-center justify-content-between position-relative w-100">
				<p className="fs-2 ms-3"> Admin Panel </p>
				<p className="fs-1 me-3">
					<span className="fs-3 me-5"> {"Hello, "+currentUserData.name} </span>
					<FontAwesomeIcon icon={faUser} style={{ cursor: "pointer" }} onClick={() => setLogout(!logout)}/>
					{logout &&
						<button
							className="position-absolute shadow p-2 rounded btn btn-danger"
							style={{ top: "60px", right: "5px" }} onClick={()=>setShow(true)}>Logout</button>
					}
				</p>

				<Modal show={show} backdrop="static" keyboard={false} centered>
					<ModalBody>
						<p className="fs-3 mb-5 text-center fw-medium text-primary">Are You Sure Want To Quit ?</p>
						<div className="d-flex align-items-center justify-content-between m-4">
							<Button variant="success" size="lg" onClick={ handleLogout }>Yes</Button>
							<Button variant="danger" size="lg" onClick={ ()=> { setShow(false); setLogout(false) } }>NO</Button>
						</div>
					</ModalBody>
				</Modal>
			</div>

			<div className="d-flex align-items-center justify-content-center flex-column mt-5 pt-3 p-5  mx-auto" style={{ width: "35%" }}>				
					<input type="text" className="form-control mb-4 w-75" placeholder="Enter Product Name" value={formData.name} autoFocus onChange={(event)=>setFormData({...formData,name: event.target.value.toLowerCase()})}/>
					<input type="number" className="form-control mb-4 w-75" placeholder="Enter Quality " value={formData.quality} onChange={(event)=>setFormData({...formData, quality: event.target.value})}/>
					<input type="number" className="form-control mb-4 w-75" placeholder="Enter Quantity Availalbe" value={formData.quantity} onChange={(event)=>setFormData({...formData,quantity: event.target.value})}/>
					<Button type="submit" variant="primary"onClick={()=>handle_add_edit()} >{!editFoodIndex?"Add Product":"Update Product"}</Button>
			</div>

			<div className="d-flex align-items-center flex-column justify-content-center text-danger p">
				<h1>Products List</h1>
				{foods.length===0 && <p>Empty</p>}
			</div>

			<div className="d-flex align-items-center justify-content-center">
				<table className="table table-bordered mt-3 w-50 text-center">
					{foods.length>0 &&
						<thead>
							<tr className="table-success">
								<th>S.No</th>
								<th>Name</th>
								<th>Quality</th>
								<th>Quantity Available</th>
								<th>Actions</th>
							</tr>
						</thead>
					}
					<tbody>
						{foods.map((food, i) => 
							<tr key={food.id} className={food.quantity == 0 ? "table-danger" : ""}>
							<td>{i + 1}</td>
							<td>{food.name}</td>
							<td>{food.quality}</td>
							<td>{food.quantity}</td>
							<td>
								<button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(food,i)}>Edit</button>
								<button className="btn btn-danger btn-sm" onClick={() => handleDelete(food.id)}>Delete</button>
							</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			
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

export default Admin;