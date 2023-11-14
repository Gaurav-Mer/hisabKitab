"use client"
import Navbar from "@/components/navbar";
import { Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import MyContext from "@/context/context";
import KitabDashboard from "@/components/detail/kitabDashboard";
import { useLiveQuery } from "dexie-react-hooks";
import CashbookList from "@/components/customer/cashbookList";
import { useRouter } from "next/navigation";
import CustomerData from "@/components/customer/customerData";

export default function Customer({ params }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const { hisabDb } = useContext(MyContext);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const handleClose = () => {
        setOpenDialog((prev) => !prev)
    }
    const { detailPage, customer } = params;
    const router = useRouter();
    console.log("router", router);
    const fetchCustomerDetail = async () => {
        const fetchData = await hisabDb.customer.where({ kitab_id: detailPage }).toArray()
        setCustomerList(fetchData);
    }

    //fetching the list of customer:
    useEffect(() => {
        if (detailPage) {
            fetchCustomerDetail()
        }
    }, [detailPage]);

    const transtionList = useLiveQuery(async () => {
        const data = await hisabDb["cashbook"].where({ customer_id: customer }).filter((data) => data?.desc?.toLowerCase()?.includes(name)).toArray();
        setLoading(false);
        return data;
    }, [name]);

    async function handleSearch(e) {
        const nameData = e.target.value;
        setName(nameData)
    }

    const validateData = async () => {
        const isCustomer = await hisabDb.customer.where({ customer_id: customer }).toArray();
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
            <Navbar handleSearch={handleSearch} pageType={"cashbook"} />
            <Grid container>
                <Grid item xs={12}>
                    <KitabDashboard customer={customer} type="customer" hisabDb={hisabDb} detailPage={detailPage} setCustomerList={setCustomerList} handleClose={handleClose} openDialog={openDialog} setOpenDialog={setOpenDialog} />
                </Grid>

                <Grid item xs={12}>
                    <CustomerData hisabDb={hisabDb} customer={customer} detailPage={detailPage} />
                </Grid>
                <Grid item xs={12}>
                    <CashbookList loading={loading} transtionList={transtionList} />
                </Grid>
            </Grid>
        </>
    )
}