import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { db } from "@/services/firebase";
import ICountyClient from "@/models/county/ICountyClient";

export const FirebaseCountyClient: ICountyClient = {
    async getIssueGroups(county) {
        const querySnapshot = await getDocs(collection(db, 'counties', county, 'issue-groups'));
        const issueGroups = [];
        querySnapshot.forEach((doc) => { issueGroups.push(doc.data()) });
        return issueGroups;
    },

    async getAuthority(id) {
        const authorityRef = doc(db, 'authorities', id);
        const authoritySnap = await getDoc(authorityRef);

        if (authoritySnap.exists()) {
            const data = authoritySnap.data();
            return {
                id: data.id,
                name: data.name
            };
        }
        throw new Error(`Could not find Authority with id: ${id}`);
    },
}
