// "use client"
import { randomID } from "@/helpers/helper";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import Groups3Icon from '@mui/icons-material/Groups3';
import { Groups3 } from "@mui/icons-material";


export default function AddCustomer({ open, handleClose, hisabDb, setCustomerList, kitab_id }) {
    const [customerData, setCustomerData] = useState({ name: "", phone: "", email: "" });
    const [error, setError] = useState({});

    const addNewKitab = async () => {
        const cData = {
            name: customerData?.name,
            email: customerData?.email,
            phone: customerData?.phone,
            created_at: new Date(),
            update_at: new Date(),
            customer_id: randomID(),
            kitab_id: kitab_id
        }
        let isAlready = await hisabDb["customer"].where("customer_id").equals(cData?.customer_id).toArray();

        if (!isAlready || (isAlready && Array.isArray(isAlready) && isAlready?.length < 1)) {
            //addding the new kitab :- 
            await hisabDb["customer"].add(cData);
            setCustomerList(prev => [cData, ...prev])
            Swal.fire({
                icon: 'success',
                title: 'Added successfully!',
                text: 'New Kitab has been added successfully!',
                showConfirmButton: false,
                timer: 2500,
                customClass: { container: "my-swal" }
            });
            handleClose()

        }

    }

    const handleChange = (e) => {
        setCustomerData((prev) => {
            let obj = { ...prev };
            obj[e.target.name] = e.target.value
            return obj
        })
    }

    return (
        <>
            <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
                <DialogTitle style={{ fontWeight: 'bold', fontSize: 22, textAlign: 'center', display: 'flex', alignItems: 'center' }}><Groups3Icon style={{ marginRight: 15 }} /> Add new Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Customer name"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        value={customerData?.name}
                        name="name"
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        onChange={handleChange}
                        value={customerData?.email}
                        name="email"
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="phone"
                        label="Phone"
                        type="number"
                        fullWidth
                        onChange={handleChange}
                        value={customerData?.phone}
                        name="phone"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>Cancel</Button>
                    <Button startIcon={<Groups3Icon /> } variant="contained" onClick={addNewKitab}>Add Customer</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}