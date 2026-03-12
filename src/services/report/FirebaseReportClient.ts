import { collection, addDoc, Timestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "@/services/firebase";
import IReportClient from "@/models/report/IReportClient";

export const FirebaseReportClient: IReportClient = {
    // TODO: improve creation of new report so one part fails others are not added with missing info
    async createReport(report) {
        const newReport = {
            ...report,
            timeCreated: Timestamp.fromDate(new Date()),
        };

        const reportRef = await addDoc(collection(db, 'reports'), newReport);

        // Upload Images to Cloud Storage
        const images = report.images;
        for (var i = 0; i < images.length; i++) {
            const blob = await getBlobAsync(images[i].uri);
            const filePath = `reports/${reportRef.id}/${reportRef.id}-initial-${i}`;

            const imageRef = ref(storage, filePath);
            const uploadResult = await uploadBytes(imageRef, blob);
            blob.close();

            const downloadURL = await getDownloadURL(uploadResult.ref);

            await updateDoc(reportRef, {
                id: reportRef.id,
                images: arrayUnion({
                    id: reportRef.id,
                    url: downloadURL,
                    uri: uploadResult.metadata.fullPath
                })
            });
        }
        return;
    }
}

async function getBlobAsync(uri: string): Promise<any> {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
    return blob;
}