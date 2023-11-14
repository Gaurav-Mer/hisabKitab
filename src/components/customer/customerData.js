import { capitalizeFirst } from "@/helpers/helper";
import { Grid, Typography } from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function CustomerData({ hisabDb, detailPage, customer }) {
    const customerDetail = useLiveQuery(() => {
        return hisabDb["customer"].where({ customer_id: customer }).toArray();
    }, []);
    return (
        <>
            {customerDetail && <Grid container spacing={2} p={2}>
                <Grid item xs={12} style={{ display: "flex", justifyContent: 'space-between' }}>
                    <Link href={`/${detailPage}`}><Typography style={{ fontWeight: 'bold' }}> {capitalizeFirst(customerDetail[0]?.name)}</Typography></Link>
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <a href={`mailto:${customerDetail[0]?.email}`}>{<EmailIcon style={{ color: "red" }} />}</a>
                        {customerDetail[0]?.phone ?
                            <a href={`tel:${customerDetail[0]?.phone}`}>{<PhoneIcon style={{ color: "purple" }} />}</a>
                            : ""}
                    </div>
                </Grid>
            </Grid>}
        </>
    )
}