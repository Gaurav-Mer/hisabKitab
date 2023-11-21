import { Button, Grid, Skeleton, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import Groups3Icon from '@mui/icons-material/Groups3';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCustomer from "../dialog/addCustomer";
import Swal from "sweetalert2";

export default function CustomerList({ customerList, loading, hisabDb, setCustomerList }) {
    const [filterVal, setFilterVal] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editData, setEditData] = useState({})
    const filterData = filterVal ? customerList?.filter((data) => data?.name?.includes(filterVal)) : customerList;

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "you want to delete this customer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // delete all transaction related to this customer_id
                const res = await hisabDb["customer"].where("customer_id").equals(id).delete();
                if (res) {
                    //deleting the kitab here :-
                    const r = await hisabDb["cashbook"].where({ customer_id: id }).delete();
                    if (r) {
                        await Swal.fire({
                            title: "Deleted!",
                            text: "Your kitab has been deleted.",
                            icon: "success"
                        });
                    }

                }
            }
        });
    }


    const handleEdit = async (id) => {
        const editd = await hisabDb["customer"].where({ customer_id: id }).toArray();
        if (editd && Array.isArray(editd) && editd?.length > 0) {
            setEditData(editd[0])
        }
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(prev => !prev)
    }

    return (
        <div style={{ marginTop: 10, }}>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <Typography style={{ color: 'grey', fontWeight: "bold", marginBottom: 10, display: 'flex', alignItems: 'center' }}><Groups3Icon style={{ marginRight: 5 }} /> Customer List</Typography>
            </div>
            {loading ? <Loader /> : filterData?.length > 0 ?
                <div style={{ display: 'flex', gap: 10, flexWrap: "wrap" }} >
                    {filterData?.map((item, i
                    ) => {
                        return (
                            <div key={i}>
                                <SingleCustomer handleEdit={handleEdit} handleDelete={handleDelete} item={item} />
                            </div>
                        )
                    })}
                </div>
                : <Typography style={{ alignItems: "center", marginTop: 20, fontWeight: "bold", display: "flex", justifyContent: 'center', fontSize: 20 }}>No customer Found!</Typography>}
            <AddCustomer isEdit={true} editData={editData} hisabDb={hisabDb} open={openDialog} handleClose={handleClose} setCustomerList={setCustomerList} />
        </div>
    )
}


const SingleCustomer = ({ item, handleDelete, handleEdit }) => {
    return (
        <>
            <Link href={`/${item?.kitab_id}/${item?.customer_id}`} style={{ textDecoration: "none", color: "black" }}>
                <div style={{
                    display: "flex", justifyContent
                        : 'center', alignContent: 'center', boxSizing: 'border-box', padding: 20, maxWidth: 170, borderRadius: 10, background: "#ead2ea", flexDirection: "column", gap: 10
                }}>
                    <Typography className="line-clamp-1"
                        style={{ textDecoration: "none" }}>{item?.name}</Typography>
                    <Typography style={{ fontSize: "10px", textTransform: 'none' }}>{new Date(item?.created_at).toLocaleString()}</Typography>
                </div>
            </Link>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
                <Button startIcon={<EditNoteIcon />} onClick={() => handleEdit(item?.customer_id)} style={{ textTransform: "none" }}>Edit</Button>
                <Button startIcon={<DeleteIcon />} onClick={() => handleDelete(item?.customer_id)} style={{ color: 'red', textTransform: "none" }}>Delete</Button>
            </div>
        </>
    )
}


const Loader = () => {
    const a = [1, 2, 34, 4]
    return (
        <Grid container spacing={2}>
            {a?.map((item, i) => {
                return (
                    <Grid key={i} item xs={12} md={2}>
                        <Skeleton height={150} />
                    </Grid>
                )
            })}

        </Grid>
    )
}