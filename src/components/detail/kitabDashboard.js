import { Fab, Typography, useMediaQuery } from "@mui/material";
import AddCustomer from "../dialog/addCustomer";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import Transaction from "../customer/transaction";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { priceFormat } from "@/helpers/helper";
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import FunctionsIcon from '@mui/icons-material/Functions';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function KitabDashboard({ openDialog, handleClose, setOpenDialog, setCustomerList, detailPage, hisabDb, type, customer }) {
    const [dasboardData, setDashBoardDat] = useState({ cCount: 0, cashIn: 0, cashOut: 0, total: 0 });
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    // const matches = useMediaQuery(theme.breakpoints.up("md"));
    // here fetch data of customer and dashboard using proimse.all()
    const fetchDashboardData = async () => {
        let cashCount = 0;
        let cashoCount = 0;
        let total = 0;
        const cCount = customer ? await hisabDb.cashbook.count() : await hisabDb.customer.count();
        const cashIn = customer ? await hisabDb["cashbook"].where({ customer_id: customer }).toArray() : await hisabDb["cashbook"].toArray();
        if (cashIn && Array.isArray(cashIn)) {
            cashIn?.map((item) => {
                if (item?.type === "cash_in") {
                    total += parseFloat(item?.amount)
                    cashCount = cashCount + parseFloat(item?.amount)
                } else if (item?.type === "cash_out") {
                    cashoCount += parseFloat(item?.amount);
                    total -= parseFloat(item?.amount)

                }
            });
        }
        setDashBoardDat(prev => ({ ...prev, cCount, cashIn: cashCount, cashOut: cashoCount, total }))
    }
    const data = useLiveQuery(() => {
        fetchDashboardData();
    }, []);


    return (
        <>
            <div style={{ marginTop: 10 }}>
                {matches ?
                    <Dashb dasboardData={dasboardData} customer={customer} detailPage={detailPage} type={type} setCustomerList={setCustomerList} handleClose={handleClose} openDialog={openDialog} setOpenDialog={setOpenDialog} hisabDb={hisabDb} matches={matches} />
                    : <MobileView setOpenDialog={setOpenDialog} type={type} />}
            </div>
            {openDialog ? !type ? <AddCustomer matches={matches} hisabDb={hisabDb} kitab_id={detailPage} open={openDialog} handleClose={handleClose} setCustomerList={setCustomerList} /> : type === "customer" ?
                <Transaction customer={customer} hisabDb={hisabDb} open={openDialog} handleClose={handleClose} />
                : "" : ""}
        </>
    )
}


const Dashb = ({ handleClose, openDialog, setOpenDialog, setCustomerList, detailPage, hisabDb, type, customer, dasboardData, matches }) => {

    return (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center' }}>
            <div style={{
                display: "flex", justifyContent
                    : 'center', alignContent: 'center', boxSizing: 'border-box', padding: 20, minWidth: 200, borderRadius: 10, border: "1px dashed purple"
            }}>
                <div onClick={() => setOpenDialog(true)}>
                    <Typography style={{ color: 'purple', cursor: 'pointer' }}> {type && type === "customer" ? "Create Transaction" : "Create Customer"}</Typography>
                    <Typography style={{ textAlign: 'center', fontWeight: 'bold', color: 'purple' }}>+ Add</Typography>
                </div>
            </div>

            <div style={{
                display: "flex", justifyContent
                    : 'center', alignContent: 'center', padding: 20, minWidth: 200, borderRadius: 10, background: "#ead2ea"
            }}>
                <div>
                    <Typography style={{ color: 'purple' }}> {customer ? "Transation Count" : "Customer Count"}</Typography>
                    <Typography style={{ textAlign: 'center', fontWeight: 'bold', color: 'purple' }}>{dasboardData?.cCount}</Typography>
                </div>
            </div>

            <div style={{
                display: "flex", justifyContent
                    : 'center', alignContent: 'center', padding: 20, minWidth: 200, borderRadius: 10, background: "#ead2ea"
            }}>
                <div>
                    <Typography style={{ color: 'green' }}>Cash In</Typography>
                    <Typography style={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>{priceFormat(dasboardData?.cashIn)}</Typography>
                </div>
            </div>

            <div style={{
                display: "flex", justifyContent
                    : 'center', alignContent: 'center', padding: 20, minWidth: 200, borderRadius: 10, background: "#ead2ea"
            }}>
                <div>
                    <Typography style={{ color: 'red' }}>Cash out</Typography>
                    <Typography style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>{priceFormat(dasboardData?.cashOut)}</Typography>
                </div>
            </div>

            <div style={{
                display: "flex", justifyContent
                    : 'center', alignContent: 'center', padding: 20, minWidth: 200, borderRadius: 10, background: "#ead2ea"
            }}>
                <div>
                    <Typography style={{ color: 'purple' }}>Total</Typography>
                    <Typography style={{ textAlign: 'center', fontWeight: 'bold', color: dasboardData?.total > 0 ? 'purple' : "red" }}>{priceFormat(dasboardData?.total)}</Typography>
                </div>
            </div>
        </div>
    )
}



const MobileView = ({ setOpenDialog, type }) => {
    return (
        <>
            <div style={{
                display: "flex", justifyContent
                    : 'center', alignContent: 'center', boxSizing: 'border-box', padding: 20, minWidth: 200, borderRadius: 10, border: "1px dashed purple"
            }}>
                <div onClick={() => setOpenDialog(true)}>
                    <Typography style={{ color: 'purple', cursor: 'pointer' }}> {type && type === "customer" ? "Create Transaction" : "Create Customer"}</Typography>
                    <Typography style={{ textAlign: 'center', fontWeight: 'bold', color: 'purple' }}>+ Add</Typography>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Fab style={{ boxShadow: 'none', background: "#4f2f80", color: 'white' }} disableFocusRipple disableRipple aria-label="edit">
                        <PersonIcon />
                    </Fab>
                    <Typography style={{ fontWeight: 'bold' }}>Customer</Typography>
                </div>
                <div style={{ display: "flex", justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Fab style={{ boxShadow: 'none', background: "#4f2f80", color: 'white' }} disableFocusRipple disableRipple aria-label="edit">
                        <CreditCardIcon />
                    </Fab>
                    <Typography style={{ fontWeight: 'bold' }}>Cash In</Typography>
                </div>

                <div style={{ display: "flex", justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Fab style={{ boxShadow: 'none', background: "#4f2f80", color: 'white' }} disableFocusRipple disableRipple aria-label="edit">
                        <MoveDownIcon />
                    </Fab>
                    <Typography style={{ fontWeight: 'bold' }}>Cash Out</Typography>
                </div>

                <div style={{ display: "flex", justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Fab style={{ boxShadow: 'none', background: "#4f2f80", color: 'white' }} disableFocusRipple disableRipple disableTouchRipple aria-label="edit">
                        <AccountBalanceWalletIcon />
                    </Fab>
                    <Typography style={{ fontWeight: 'bold' }}>Total</Typography>
                </div>
            </div>
        </>
    )
}