// "use client"
import { randomID, validateEmail } from "@/helpers/helper";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Groups3Icon from '@mui/icons-material/Groups3';
import { styled } from "@mui/material/styles";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
    "& .MuiDialog-container": {
        alignItems: "start",
        marginTop: "30px",
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle  {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                >
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};



export default function AddCustomer({ matches, open, handleClose, hisabDb, setCustomerList, kitab_id, isEdit = false, editData }) {
    const [customerData, setCustomerData] = useState({ name: "", phone: "", email: "" });
    const [errorList, setErrorList] = useState({});

    const validateData = (data) => {
        let er = {};
        if (!data?.name) {
            er.name = "Kitab name can not be empty"
        } else if (data?.name?.length < 3) {
            er.name = "Minimum 3 length required"
        } else if (data?.name?.length > 31) {
            er.name = "Maximum 31 character allowed"
        }

        if (!data?.email) {
            er.email = "Email name can not be empty"
        } else if (!validateEmail(data?.email)) {
            er.email = "Invalid email"
        } else if (data?.name?.length > 31) {
            er.name = "Maximum 31 character allowed"
        }

        if (!data?.phone) {
            er.phone = "Phone Number can not be empty"
        } else if (data?.phone?.toString()?.length !== 10) {
            er.phone = "Number should have 10 digit"
        }

        return er
    }


    const addNewKitab = async () => {
        const cData = {
            name: customerData?.name,
            email: customerData?.email,
            phone: customerData?.phone,
            created_at: isEdit ? editData?.created_at : new Date(),
            update_at: new Date(),
            customer_id: isEdit ? editData?.customer_id : randomID(),
            kitab_id: isEdit ? editData?.kitab_id : kitab_id
        }

        const error = validateData(cData);

        if (Object.keys(error)?.length < 1) {
            let isAlready = await hisabDb["customer"].where("customer_id").equals(cData?.customer_id).toArray();

            if (!isAlready || (isAlready && Array.isArray(isAlready) && isAlready?.length < 1) || isEdit) {
                //addding the new kitab :- 
                if (isEdit) {
                    const r = await hisabDb["customer"].where({ customer_id: editData?.customer_id }).modify(cData);
                    if (r) {
                        setCustomerList(prev => {
                            let obj = [...prev];
                            let cIndex = obj.findIndex(data => data?.customer_id === editData?.customer_id);
                            if (cIndex > -1) {
                                obj[cIndex] = cData
                            }
                            return obj;
                        })
                    }
                } else {
                    await hisabDb["customer"].add(cData);
                    setCustomerList(prev => [cData, ...prev])
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Added successfully!',
                    text: 'New Kitab has been added successfully!',
                    showConfirmButton: false,
                    timer: 2500,
                    customClass: { container: "my-swal" }
                });
                handleClose();
            }
        } else {
            setErrorList(error)
        }

    }

    const handleChange = (e) => {
        setCustomerData((prev) => {
            let obj = { ...prev };
            obj[e.target.name] = e.target.value
            return obj
        })
    }

    useEffect(() => {
        if (isEdit) {
            setCustomerData((prev) => ({
                ...prev, name: editData
                    ?.name, email: editData?.email, phone: editData?.phone
            }))
        }
    }, [isEdit, editData]);
    return (
        <div>
            <BootstrapDialog
                onClose={(_, reason) => {
                    if (reason !== "backdropClick") {
                        handleClose();
                    }
                }}
                aria-labelledby="customized-dialog-title"
                open={open}
                disableScrollLock
                maxWidth={"sm"}
            >
                {/* <DialogTitle style={{ fontWeight: 'bold', fontSize: 22, textAlign: 'center', display: 'flex', alignItems: 'center' }}><Groups3Icon style={{ marginRight: 15 }} /> {isEdit ? "Edit Customer" : "Add new Customer"}</DialogTitle> */}
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    Add Address
                </BootstrapDialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12}>
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
                                error={errorList?.name}
                                helperText={errorList?.name ?? ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                error={errorList?.email}
                                helperText={errorList?.email ?? ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                error={errorList?.phone}
                                helperText={errorList?.phone ?? ""}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>Cancel</Button>
                    <Button startIcon={<Groups3Icon />} variant="contained" onClick={addNewKitab}>{isEdit ? "Edit Customer" : "Add Customer"} </Button>
                </DialogActions>
            </BootstrapDialog >
        </div>
    )
}