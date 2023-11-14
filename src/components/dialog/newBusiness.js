// "use client"
import { randomID } from "@/helpers/helper";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import BookIcon from '@mui/icons-material/Book';

export default function NewBusiness({ open, handleClose, hisabDb, setKitabList, edit }) {
    const [kitabData, setKitabData] = useState("");
    const addNewKitab = async () => {
        const kitabDataAdd = {
            name: kitabData,
            created_at: edit ? edit?.created_at : new Date(),
            update_at: edit ? edit?.update_at : new Date(),
            kitab_id: edit ? edit?.kitab_id : randomID()
        }
        let isAlready = await hisabDb["kitab"].where("kitab_id").equals(kitabDataAdd?.kitab_id).toArray();

        if (!isAlready || (isAlready && Array.isArray(isAlready) && isAlready?.length < 1 || edit)) {
            //addding the new kitab :- 
            if (edit) {
                const d = await hisabDb["kitab"].where("kitab_id").equals(kitabDataAdd?.kitab_id).modify(kitabDataAdd);
            } else {
                await hisabDb["kitab"].add(kitabDataAdd)
            }
            if (!edit) {
                setKitabList(prev => [kitabDataAdd, ...prev])
            }
            Swal.fire({
                icon: 'success',
                title: edit ? `Updated successfully` : 'Added successfully!',
                text: edit ? `Kitab has been edited successfully!` : 'New Kitab has been added successfully!',
                showConfirmButton: false,
                timer: 2500,
                customClass: { container: "my-swal" }
            });
            setKitabData("");
            handleClose()

        }

    }

    useEffect(() => {
        setKitabData(edit?.name)
    }, [edit]);

    return (
        <>
            <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
                <DialogTitle style={{ fontWeight: 'bold', fontSize: 22, textAlign: 'center', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}><BookIcon style={{ marginRight: 10 }} /> Add new Kitab</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="kitab"
                        label="Kitab name"
                        type="text"
                        fullWidth
                        onChange={(e) => setKitabData(e.target.value)}
                        value={kitabData}
                        name="name"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>Cancel</Button>
                    <Button startIcon={<BookIcon />} variant="contained" onClick={addNewKitab}> {edit ? "Edit kitab" : "Add Kitab"}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}