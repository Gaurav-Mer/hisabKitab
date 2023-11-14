// NOTE HERE IN DATE I M CONVERTIG DATE TO MILISECOND USING GETTME() & TO 
// TO CONVERT MILISECOMD TO ISO FROMAT I HAVE TO DO 
// -------------- NEW DATE(MILISECOND).TOISOSTRING().SLICE(0,16)
///HERE SLICE WILL SLICE TIME TILL "DD-MM-YYTHH-MM" AND SLICE SECOND AND Z FROM THE END 


"use client"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import NewBusiness from "../dialog/newBusiness";
import { categoryList } from "../../../helpers/constant";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { randomID } from "@/helpers/helper";


export default function Transaction({ open, handleClose, hisabDb, customer }) {
    const [defaultBusiness, setDefaultBusiness] = useState("first");
    const [handleDialog, setHandleDialog] = useState(false);
    const [newTransaction, setNewTransaction] = useState({ type: "cash_in", amount: 0, transaction_id: "", pType: "online", date: "", attachment: "", desc: "", category: 1 });

    const handleChage = (e) => {
        // console.log("e is =>", e.target.name, e.target.value)
        setNewTransaction((prev) => {
            let obj = { ...prev };
            obj[e.target.name] = e.target.value
            return obj
        })
    }


    const handeImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (c) {
                const base64String = c.target.result.split(',')[1]; // Extract the Base64 portion
                console.log("base64String", base64String);
                // console.log("reader is =>", reader.result)
                const i = reader.result;
                setNewTransaction((prev) => ({ ...prev, attachment: i }))
            }
            reader.readAsDataURL(file);

        }
    }
    const removeImg = () => {
        setNewTransaction((prev) => ({
            ...prev, attachment
                : ""
        }))
    }

    const validateData = (data) => {
        const errorList = {}
        if (!data?.amount) {
            errorList.amount = `Amount can not be empty`
        } else if (!data?.date) {
            errorList.date = "Date cannot be empty"
        } else if (!data?.category) {
            errorList.category = "Category cann't be empty"
        }
        return errorList
    }

    const submitData = async () => {
        const cashbook = {
            ...newTransaction, createdAt: new Date().getTime(), updateAt: new Date().getTime(),
            customer_id: customer, cashbook_id: randomID(),
        }
        const error = validateData(cashbook);
        console.log("submit data i=>", error);
        if (error && Object.keys(error)?.length < 1) {
            const res = await hisabDb["cashbook"].add(cashbook);
            if (res) {
                handleClose()
            }
        }
    }
    return (
        <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
            <DialogTitle style={{ fontWeight: 'bold', fontSize: 22, textAlign: "center" }}>
                Add new Cashbook
            </DialogTitle>
            <DialogContent>
                <TextField select label="Select Type" style={{ marginTop: 10 }} size="small" fullWidth name="type" value={newTransaction?.type} onChange={handleChage}
                ><MenuItem value={"cash_in"}>

                        Cash In
                    </MenuItem>
                    <MenuItem value={"cash_out"}>
                        Cash Out
                    </MenuItem>
                </TextField>
                <TextField label="Enter amount" style={{ marginTop: 10 }} size="small" fullWidth name="amount" value={newTransaction?.amount} onChange={handleChage} />
                <TextField label="Description" style={{ marginTop: 10 }} size="small" fullWidth minRows={2} multiline maxRows={4} name="desc" value={newTransaction?.desc} onChange={handleChage} />

                <TextField select label="Select Payment type" style={{ marginTop: 10 }} size="small" fullWidth name="pType" value={newTransaction?.pType} onChange={handleChage}>
                    <MenuItem value={"online"}>

                        Online
                    </MenuItem>
                    <MenuItem value={"offline"}>
                        Offline
                    </MenuItem>
                </TextField>
                <div style={{ marginTop: 10, border: "1px solid #d4cccc", padding: 10, borderRadius: 5 }}>
                    <label for="birthdaytime" style={{ color: 'grey', fontSize: 13 }}>Due Date :</label>
                    <input value={newTransaction?.date} name="date" onChange={handleChage} style={{ padding: 10, marginLeft: 10, border: 'none' }} type="datetime-local" id="birthdaytime" />
                </div>

                <TextField
                    style={{ marginTop: 10 }}
                    id="outlined-select-currency"
                    select
                    fullWidth
                    label="Category"
                    size="small"
                    helperText="Please select category"
                >
                    {categoryList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
                {newTransaction?.attachment ?
                    <div style={{ position: 'relative' }} onClick={removeImg}>
                        <img width={120} height={120} src={newTransaction?.attachment} />
                        <div style={{ position: "absolute", top: 0, width: 10, height: 10, left: 95, padding: 10, borderRadius: "50%", color: "red", fontWeight: 'bold', background: "white", justifyContent: 'center', alignContent: 'center', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            X
                        </div>
                    </div>
                    : <div class="upload-button" style={{ marginTop: 10, }}>
                        <input onChange={handeImage} type="file" id="fileInput" accept="image/*" />
                        <label for="fileInput">Upload Image</label>
                    </div>}
            </DialogContent>

            <DialogActions>
                <Button onClick={() => submitData()} style={{ padding: 10 }}
                    className="bg-blue" variant="contained" size="small">
                    Add kitab
                </Button>

            </DialogActions>
        </Dialog >
    )
}