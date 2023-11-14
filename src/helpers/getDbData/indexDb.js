import { useLiveQuery } from "dexie-react-hooks";

export const getKitabData = async (hisabDb) => {
    if (typeof window !== undefined) {
        const kitabData = useLiveQuery(
            async () => {
                const kitab = await hisabDb.kitab.toArray();
                return kitab;
            },
            []
        );
        return kitabData
    }


}