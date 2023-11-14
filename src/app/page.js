"use client"
import Image from 'next/image'
import styles from './page.module.css'
import { Button, Card, Divider, Grid, Skeleton, Typography } from '@mui/material'
import LeftSide from '@/components/homePage/leftSide'
import Navbar from '@/components/navbar'
import BusinessHeader from '@/components/addBusiness/businessHeader'
import KitabListing from '@/partials/addKitab/kitabListing'
import { useContext, useEffect, useState } from 'react'
import MyContext from '@/context/context'
import { getKitabData } from '@/helpers/getDbData/indexDb'
import NewBusiness from '@/components/dialog/newBusiness';
import BookIcon from '@mui/icons-material/Book';


export default function Home() {
  const { item, hisabDb } = useContext(MyContext);
  const [kitabList, setKitabList] = useState([]);
  const [handleDialog, setHandleDialog] = useState(false);
  const [editData, setEditData] = useState({ open: false, data: "" });
  const [loading, setLoading] = useState(true);


  const handleEdit = async (data) => {
    const eData = await hisabDb["kitab"].where({ kitab_id: data }).toArray()
    setEditData(prev => ({ ...prev, open: true, data: eData[0] }))
  }



  const fetchDbData = async () => {
    let x = await hisabDb.kitab.toArray();
    if (x && Array.isArray(x)) {
      setKitabList(x);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== undefined && hisabDb) {
      fetchDbData();
    }
  }, [hisabDb])

  async function handleSearch(e) {
    let name = e.target.value;
    const kitabData = await hisabDb.kitab.filter((data) => data?.name?.toLowerCase()?.includes(name?.toLowerCase())).toArray();
    setKitabList(kitabData);
  }

  return (
    <div style={{ minHeight: "100vh" }} className='bg'>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Navbar pageType={"kitab"} handleSearch={handleSearch} />
        </Grid>
        <Grid item xs={12} >
          {/* <BusinessHeader kitabList={kitabList} hisabDb={hisabDb} /> */}
          <LeftSide />
        </Grid>
        <Grid item xs={12} style={{ margin: "0 10px" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography style={{ fontSize: 25, fontWeight: "bold", margin: "0px 10px 20px 10px" ,display:'flex',justifyContent:'center',alignItems:'center'}}><BookIcon style={{marginRight:5}} /> Kitab List</Typography>
            <Button onClick={() => setHandleDialog(true)} style={{ width: 160, height: 50, color: "#4f2f80", fontWeight: "bold", fontSize: 16 }} variant="text" size="small">
              + Add kitab
            </Button>

          </div>
          {loading ? <LoadingCom /> :
            <KitabListing setKitabList={setKitabList} hisabDb={hisabDb} handleEdit={handleEdit} kitabList={kitabList} />
          }
        </Grid>
        <NewBusiness setKitabList={setKitabList} hisabDb={hisabDb} open={editData?.open ? editData?.open : handleDialog} handleClose={() => editData?.open ? setEditData((prev) => ({ ...prev, open: false, data: "" })) : setHandleDialog((prev) => !prev)} edit={editData?.data} />
      </Grid >

    </div>
  )
}


const LoadingCom = () => {
  let arr = [1, 2, 4, 2, 3, 3, 32, 1]
  return (
    <>
      <Grid container spacing={2}>
        {arr?.map((item) => {
          return (
            <Grid item xs={12} md={3}>
              <Skeleton height={180} style={{ borderRadius: 10 }} />
            </Grid>
          )
        })}

      </Grid>
    </>
  )
}
