import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/functions';
import * as geofirex from 'geofirex';

import { app as firebaseApp } from '../services/firebase';

export const geo = geofirex.init(firebase);

async function getBlobAsync(uri) {
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

export const createReport = async ({
  images,
  details,
  senderInfo,
  location: { latitude, longitude },
  authorityId,
}) => {
  const date = new Date();
  const timestamp = date.toDateString();
  const geoPoint = geo.point(latitude, longitude);
  const data = {
    location: { latitude, longitude },
    timestamp: timestamp,
    details: { ...details, authorityId },
    senderInfo,
    geoData: geoPoint.data,
  };

  try {
    const messageRef = await firebaseApp.firestore().collection('reports').add(data);
    for (var i = 0; i < images.length; i++) {
      // Upload images to Cloud Storage
      const blob = await getBlobAsync(images[i]);
      const filePath = `reports/${messageRef.id}/${messageRef.id}-initial-${i}`;
      const fileSnapshot = await firebaseApp.storage().ref(filePath).put(blob);
      blob.close();

      // Generate a public URL for the file
      const url = await fileSnapshot.ref.getDownloadURL();
      // Update the chat message placeholder with the real image
      messageRef.update({
        id: messageRef.id,
        images: firebase.firestore.FieldValue.arrayUnion({
          id: messageRef.id,
          imageUrl: url,
          imageUri: fileSnapshot.metadata.fullPath,
        }),
      });
    }
    return { result: 'Report Successfuly Uploaded' };
  } catch (err) {
    return { error: err.message };
  }
};

export const getIssueGroups = async (county) => {
  try {
    const querySnapshot = await firebaseApp
      .firestore()
      .collection('counties')
      .doc(county)
      .collection('issue-groups')
      .get();
    issueGroups = [];
    querySnapshot.forEach((doc) => {
      issueGroups.push(doc.data());
    });
    return issueGroups;
  } catch (err) {
    return { error: err.message };
  }
};
