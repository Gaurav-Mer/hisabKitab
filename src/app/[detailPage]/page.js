"use client"
import CustomerList from "@/components/detail/customerList";
import KitabDashboard from "@/components/detail/kitabDashboard";
import Navbar from "@/components/navbar";
import MyContext from "@/context/context";
import { Grid, Typography } from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useContext, useState } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function Dashboard({ params }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const { hisabDb } = useContext(MyContext);
    const [loading, setLoading] = useState(true);
    const router = useRouter()
    const handleClose = () => {
        setOpenDialog((prev) => !prev)
    }
    const { detailPage } = params;
    const fetchCustomerDetail = async () => {
        const fetchData = await hisabDb.customer.where({ kitab_id: detailPage }).toArray()
        setCustomerList(fetchData);
        setLoading(false);
    }

    //fetching the list of customer:
    useEffect(() => {
        if (detailPage) {
            fetchCustomerDetail();
        }
    }, [detailPage]);



    //fetching the data on the basis of search:-

    async function handleSearch(e) {
        const name = e.target.value;
        const fetchData = await hisabDb.customer.where({ kitab_id: detailPage }).filter(data => data?.name?.toLowerCase()?.includes(name)).toArray()
        setCustomerList(fetchData)
    }
    const validateData = async () => {
        const isCustomer = await hisabDb.kitab.where({ kitab_id: detailPage }).toArray();
        if (isCustomer?.length < 1) {
            //redirect 
            console.log("redirect->");
            router.push("/")
        }
    }
    //validating that if there is no customer with customer id redirect it
    useEffect(() => {
        validateData();
    }, [])


    return (
        <>
            <Navbar pageType={"customer"} handleSearch={handleSearch} detailPage={detailPage} />
            <Grid container spacing={2} p={2}>
                <Grid item xs={12} >
                    <Link href={"/"} style={{ textDecoration: 'none' }}>
                        <Typography style={{ color: 'grey', display: "flex", alignItems: 'center' }}> <ArrowBackIosIcon /> Back to home</Typography>
                    </Link>
                    <KitabDashboard hisabDb={hisabDb} detailPage={detailPage} setCustomerList={setCustomerList} handleClose={handleClose} openDialog={openDialog} setOpenDialog={setOpenDialog} />
                </Grid>
                <Grid item xs={12} >
                    <CustomerList loading={loading} customerList={customerList} />
                </Grid>
            </Grid>
        </>
    )
}
