"use client"
import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { useContext, useState } from "react";
import NewBusiness from "../dialog/newBusiness";
import MainContext from "@/context/mainContext";
import MyContext from "@/context/context";
import { getKitabData } from "@/helpers/getDbData/indexDb";

export default function BusinessHeader({ kitabList, hisabDb }) {
    const businessList = [{ name: "first" }, { name: 'second' }];
    const [defaultBusiness, setDefaultBusiness] = useState("first");
    const [handleDialog, setHandleDialog] = useState(false);


    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
                id="outlined-select-currency"
                select
                label="Select"
                defaultValue="EUR"
                size="small"
                helperText="Please select your currency"
            >
                {kitabList.map((option) => (
                    <MenuItem key={option.name} value={option.name}>
                        {option.name}
                    </MenuItem>
                ))}
            </TextField>
            <Button onClick={() => setHandleDialog(true)} style={{ width: 160, height: 50 }} className="mainColor" variant="contained" size="small">
                Add kitab
            </Button>

            <NewBusiness hisabDb={hisabDb} open={handleDialog} handleClose={() => setHandleDialog((prev) => !prev)} />
        </div >
    )
}