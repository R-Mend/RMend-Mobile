import { collection, getDocs } from "firebase/firestore";

import { db } from "@/services/firebase";
import ICountyClient from "@/models/county/ICountyClient";

export const FirebaseCountyClient: ICountyClient = {
    async getIssueGroups(county) {
    const querySnapshot = await getDocs(collection(db, 'counties', county, 'issue-groups'));
    const issueGroups = [];
    querySnapshot.forEach((doc) => { issueGroups.push(doc.data()) });
    return issueGroups;
    }
}
