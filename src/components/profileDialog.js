// NOTE HERE IN DATE I M CONVERTIG DATE TO MILISECOND USING GETTME() & TO 
// TO CONVERT MILISECOMD TO ISO FROMAT I HAVE TO DO 
// -------------- NEW DATE(MILISECOND).TOISOSTRING().SLICE(0,16)
///HERE SLICE WILL SLICE TIME TILL "DD-MM-YYTHH-MM" AND SLICE SECOND AND Z FROM THE END :-

"use client"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from "sweetalert2";

export default function ProfileDialog({ open, handleClose, hisabDb, customer, src }) {
    const [image, setImage] = useState("");

    const handeImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (c) {
                const base64String = c.target.result.split(',')[1]; // Extract the Base64 portion
                const i = reader.result;
                setImage(i)
            }
            reader.readAsDataURL(file);

        }
    }

    const submitData = async () => {
        const isAlready = await hisabDb["avatar"].toArray();

        console.log("isAlready", isAlready);
        let data = "";
        if (Array.isArray(isAlready) && isAlready?.length > 0) {
            data = await hisabDb["avatar"].where({ img: isAlready[0]?.img }).modify({ img: image })
        } else {
            data = await hisabDb["avatar"].add({ img: image });
        }
        if (data) {
            Swal.fire({
                icon: 'success',
                title: 'Added successfully!',
                text: 'Avatar has been updated successfully!',
                showConfirmButton: false,
                timer: 2500,
                customClass: { container: "my-swal" }
            });
            handleClose();

        }

    }

    useEffect(() => {
        if (Array.isArray(src) && src?.length > 0) {
            console.log("Image is =>", src);
            setImage(src[0]?.img);
        }
    }, [src]);

    console.log("image", image);

    return (
        <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
            <DialogTitle style={{ fontWeight: 'bold', fontSize: 22, textAlign: "center", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AccountCircleIcon fontSize="medium" style={{ marginRight: 5 }} /> Add your Avatar
            </DialogTitle>
            <DialogContent style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="circular-input-container">
                    <input onChange={handeImage} type="file" className="circular-input" id="imageInput" accept="image/*" />
                    <label for="imageInput">{
                        image ?
                            <img src={image} alt="Upload Image" className="uploaded-image" /> :
                            <Typography style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', marginTop: 40, fontWeight: 'bold' }}>Upload Image</Typography>
                    }
                    </label>
                </div>
                {image ?
                    <Typography onClick={() => setImage("")}
                        style={{ color: 'red', cursor: 'pointer' }}><CancelIcon fontSize="medium" /></Typography>
                    : ""}

            </DialogContent>

            <DialogActions>
                <Button startIcon={<AccountCircleIcon />} onClick={() => submitData()} style={{ padding: 10 }}
                    className="bg-blue" variant="contained" size="small">
                    Add Avatar
                </Button>

            </DialogActions>
        </Dialog >
    )
}