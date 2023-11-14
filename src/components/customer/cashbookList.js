"use client"
import { TableContainer, Typography, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Skeleton } from "@mui/material";

export default function CashbookList({ transtionList, loading }) {
    return (
        <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
                <Typography style={{ fontSize: 18, color: 'grey' }}>Transaction List</Typography>
            </Grid>
            <Grid item xs={12}>
                {loading ? <LoadingCom /> : transtionList?.length > 0 ?
                    <TableContainer style={{ background: '#fffafe', borderRadius: 10 }}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Payment mode</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Type</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Amount</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Due Date</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Attachment</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Description</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Category</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transtionList?.map((item, index) => {
                                    return (
                                        <SigleBookList item={item} index={index} />
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : <Typography style={{ alignItems: "center", marginTop: 180, fontWeight: "bold", display: "flex", justifyContent: 'center', fontSize: 20 }}>No Transaction Found!</Typography>}
            </Grid>

        </Grid>
    )
}


const SigleBookList = ({ item, index }) => {
    console.table(item)
    const bgWhite = index % 2 === 0
    return (

        <TableRow style={{ background: bgWhite ? "white" : "" }}>
            <TableCell> {new Date(item?.createdAt).toLocaleDateString()} </TableCell>
            <TableCell align="center">{item?.type}</TableCell>
            <TableCell align="center">{item?.pType}</TableCell>
            <TableCell align="center">{item?.amount}</TableCell>
            <TableCell align="center">{new Date(item?.date)?.toLocaleString()}</TableCell>
            <TableCell align="center">   {item?.attachment ? <img src={item?.attachment} width={40} /> : ""}</TableCell>
            <TableCell align="center">{item?.desc}</TableCell>
            <TableCell align="center">{item?.category}</TableCell>
            <TableCell align="center" style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer' }}>Delete </TableCell>
        </TableRow>
    )
}



const LoadingCom = () => {
    return (
        <>
            <TableContainer style={{ background: '#fffafe', borderRadius: 10 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Payment mode</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Amount</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Due Date</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Attachment</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
            <Skeleton height={40} />
        </>

    )
}