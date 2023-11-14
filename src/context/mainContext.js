"use client"

import { useState } from "react";
import MyContext from "./context";
import Dexie from "dexie";

const MainContext = (props) => {
    const [item, setItem] = useState(0);
    const hisabDb = new Dexie('hisabKitab');
    hisabDb.version(7).stores({
        kitab: '++id, name, kitab_id, created_at, updated_at', // Primary key and indexed props,
        customer: "++id, name, email, phone, customer_id, createdAt, updatedAt, kitab_id",
        cashbook: "++id, type, pType, amount, createdAt, cashbook_id , updateAt, desc, customer_id, category, attachment", //ptype is payment type is online/offline , type =>in/out,
        avatar: "img"
    });



    return (
        <MyContext.Provider value={{ item, setItem, hisabDb }}>
            {props.children}
        </MyContext.Provider>
    )
}

export default MainContext;