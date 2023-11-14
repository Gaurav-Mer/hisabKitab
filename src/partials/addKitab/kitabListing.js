import { Button, Grid, Typography } from "@mui/material"
import Link from "next/link"
import Swal from "sweetalert2";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';

export default function KitabListing({ kitabList, handleEdit, hisabDb, setKitabList }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "you want to delete this kitab",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                //deleting the kitab here :-
                const r = await hisabDb["kitab"].where("kitab_id").equals(id).delete();
                if (r) {
                    await Swal.fire({
                        title: "Deleted!",
                        text: "Your kitab has been deleted.",
                        icon: "success"
                    });

                    setKitabList((prev) => {
                        let obj = [...prev];
                        const index = obj.findIndex((data) => data?.kitab_id === id)
                        if (index) {
                            obj.splice(index, 1)
                        }
                        return obj
                    }
                    )
                }
            }
        });
    }
    return (
        <Grid container spacing={2}  >
            {kitabList && kitabList?.length > 0 ? kitabList?.map((item) => {
                return (
                    <Grid item xs={12} md={3}>
                        <SingleCard item={item} handleEdit={handleEdit} handleDelete={handleDelete} />
                    </Grid>

                )
            }) :
                <Grid item xs={12}>
                    <Typography className="text-bold text-grey" style={{ fontSize: 30, textAlign: 'center', color: 'grey', fontWeight: 'bold', marginTop: 20 }}>
                        No Kitab Found
                    </Typography>
                    <Typography className="text-bold text-grey" style={{ fontSize: 20, textAlign: 'center', color: 'grey', marginTop: 20 }}>
                        Click  Add Kitab button to add +
                    </Typography>

                </Grid>
            }
        </Grid>
    )
}


const SingleCard = ({ item, handleEdit, handleDelete }) => {
    return (
        <div className="b-shadow" style={{ border: "1px solid #ead2ea", background: "white", borderRadius: '10px', padding: "10px 20px", cursor: "pointer" }}>
            <Link className="link" style={{ textDecoration: 'none', color: 'grey' }} href={item?.kitab_id}>
                <Typography style={{ fontWeight: 'bold', fontSize: 22, textDecoration: "none", color: "purple" }}>{item?.name}</Typography>
                <Typography style={{ marginTop: 10, color: 'purple' }}>{item?.created_at.toLocaleString()}</Typography>
            </Link>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
                <Button startIcon={<EditNoteIcon />} onClick={() => handleEdit(item?.kitab_id)} style={{ textTransform: "none" }}>Edit</Button>
                <Button startIcon={<DeleteIcon />} onClick={() => handleDelete(item?.kitab_id)} style={{ color: 'red', textTransform: "none" }}>Delete</Button>
            </div>
        </div>
    )
}