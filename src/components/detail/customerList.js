import { Grid, Skeleton, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import Groups3Icon from '@mui/icons-material/Groups3';


export default function CustomerList({ customerList, loading }) {
    const [filterVal, setFilterVal] = useState("")
    const filterData = filterVal ? customerList?.filter((data) => data?.name?.includes(filterVal)) : customerList

    return (
        <div style={{ marginTop: 10, }}>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <Typography style={{ color: 'grey', fontWeight: "bold", marginBottom: 10, display: 'flex', alignItems: 'center' }}><Groups3Icon style={{ marginRight: 5 }} /> Customer List</Typography>
            </div>
            {loading ? <Loader /> : filterData?.length > 0 ?
                <div style={{ display: 'flex', gap: 50, minWidth: 1900 }} >
                    {filterData?.map((item, i) => {
                        return (
                            <div key={i}>
                                <SingleCustomer item={item} />
                            </div>
                        )
                    })}
                </div>
                : <Typography style={{ alignItems: "center", marginTop: 20, fontWeight: "bold", display: "flex", justifyContent: 'center', fontSize: 20 }}>No customer Found!</Typography>}
        </div>
    )
}


const SingleCustomer = ({ item }) => {
    return (
        <Link href={`/${item?.kitab_id}/${item?.customer_id}`} style={{ textDecoration: "none", color: "black" }}>
            <div style={{
                display: "flex", justifyContent
                    : 'center', alignContent: 'center', boxSizing: 'border-box', padding: 20, minWidth: 200, borderRadius: 10, background: "#ead2ea", flexDirection: "column", gap: 10
            }}>
                <Typography className="line-clamp-1"
                    style={{ textDecoration: "none" }}>{item?.name}</Typography>
                <Typography style={{ fontSize: "10px", textTransform: 'none' }}>{new Date(item?.created_at).toLocaleString()}</Typography>
            </div>
        </Link>
    )
}


const Loader = () => {
    const a = [1, 2, 34, 4]
    return (
        <Grid container spacing={2}>
            {a?.map((item) => {
                return (
                    <Grid item xs={12} md={2}>
                        <Skeleton height={150} />
                    </Grid>
                )
            })}

        </Grid>
    )
}