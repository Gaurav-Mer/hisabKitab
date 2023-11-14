"use client"
import { Avatar, Skeleton, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import ProfileDialog from "./profileDialog";
import MyContext from "@/context/context";
import { useLiveQuery } from "dexie-react-hooks";

export default function Navbar({ handleSearch, pageType }) {
    const [loading, setLoading] = useState(true);
    const { hisabDb } = useContext(MyContext);
    const [openProfile, setOpenProfile] = useState(false);
    let clear = ""
    const searchWithDelay = (e) => {
        clearTimeout(clear)
        clear = setTimeout(() => {
            handleSearch(e)
        }, 1000);
    }

    const openDialog = () => {
        setOpenProfile(prev => !prev)
    }

    let pData = pageType === "kitab" ? "Search Kitab" : pageType === "customer" ? "Search Customer" : pageType === "cashbook" ? "Search by Description" : "search data"


    const image = useLiveQuery(async () => {
        const data = await hisabDb["avatar"].toArray();
        setLoading(false)
        return data;
    }, []);


    return (
        <div style={{ background: '#4f2f80', padding: 20, color: "white", display: 'flex', justifyContent: 'space-between', textAlign: 'center', justifyItems: 'center', justifyItems: 'center' }}>
            <Link style={{ display: "flex", justifyContent: 'center' }} className="link" href={"/"}> <Typography style={{ fontWeight: 'bold', textAlign: 'center', display: 'flex', alignItems: "center", color: 'white', padding: 0 }}>HisabKitab</Typography>
            </Link>
            <div style={{ display: 'flex', gap: 20 ,}}>
                <TextField onChange={searchWithDelay} size="small" name="search" placeholder={pData} style={{ background: 'white', borderRadius: 5, marginLeft:10 }} />
                {loading ? <Skeleton
                    animation="wave"
                    height={40}
                    color="red"
                    variant="rectangular"
                    width="40px"
                />
                    :
                    <Avatar
                        onClick={openDialog}
                        style={{ cursor: 'pointer' }}
                        sx={{ bgcolor: "navy" }}
                        alt="Hisa"
                        src={Array.isArray(image) && image?.length > 0 ? image[0]?.img : ""}
                        variant="rounded"
                    />
                }
            </div>
            <ProfileDialog src={image} hisabDb={hisabDb} open={openProfile} handleClose={openDialog} />
        </div>
    )
}