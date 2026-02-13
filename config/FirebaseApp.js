import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/functions';
import * as geofirex from 'geofirex';
import { FIREBASE_DEV_CONFIG } from './keys';

export const firebaseApp = firebase.initializeApp(FIREBASE_DEV_CONFIG);
export const geo = geofirex.init(firebase);

export const createUserWithEmailAndPassword = async (email, password, displayName) => {
  try {
    const createNewUser = await firebaseApp.functions().httpsCallable('createNewUser');
    const results = await createNewUser({ email, password, displayName });
    return results;
  } catch (err) {
    return { error: err.message };
  }
};

export const signInWithEmailAndPassword = async (email, password) => {
  try {
    await firebaseApp.auth().signInWithEmailAndPassword(email, password);
    return { result: 'Successfully Signed User In' };
  } catch (err) {
    return { error: err.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseApp.auth().signOut();
    return { result: 'Successfully Signed Out' };
  } catch (err) {
    return { error: err.message };
  }
};

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

export const updateProfile = async (
  { displayName, email, authCode, phoneNumber },
  shouldUpdateAuthCode
) => {
  const { currentUser } = firebaseApp.auth();
  try {
    await currentUser.updateProfile({ displayName });
    await currentUser.updateEmail(email);

    if (shouldUpdateAuthCode) {
      await updateAuthCode(authCode);
    }

    // if (phoneNumber) {
    //   formatted_phone = '+1' + phoneNumber.replace(/\D/g, '');
    //   currentUser.updatePhoneNumber(formatted_phone);
    // }

    const user = await firebaseApp.firestore().collection('users').doc(currentUser.uid);
    if (user) {
      await user.update({ displayName, email, authCode });
    }

    return { result: 'Profile Successfully Updated' };
  } catch (err) {
    return { error: err.message };
  }
};

export const createReport = async ({
  images,
  details,
  senderInfo,
  location: { latitude, longitude },
  authority: { authCode, name, type },
}) => {
  const date = new Date();
  const timestamp = date.toDateString();
  const geoPoint = geo.point(latitude, longitude);
  const data = {
    location: { latitude, longitude },
    timestamp: timestamp,
    details: { ...details, authority: name },
    senderInfo,
    authCode,
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

export const updateAuthCode = async (newAuthCode) => {
  try {
    const updateUserAuthCode = await firebaseApp.functions().httpsCallable('updateUserAuthCode');
    const results = await updateUserAuthCode({ authCode: newAuthCode });
    return results;
  } catch (err) {
    return { error: err.message };
  }
};

export const makeAdminFrom = async (userId) => {
  try {
    const makeUserAdmin = await firebaseApp.functions().httpsCallable('makeUserAdmin');
    const results = await makeUserAdmin({ userId });
    return results;
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

export const getAuthority = async (authCode) => {
  try {
    var querySnapshot = await firebaseApp
      .firestore()
      .collection('authorities')
      .where('authCode', '==', authCode)
      .get();

    const reports = [];
    querySnapshot.forEach((doc) => {
      reports.push(doc.data());
    });

    if (reports.length == 0 || reports.length > 1) {
      throw Error("Couldn't find authority from the given authority code.");
    } else {
      return { result: reports[0] };
    }
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};
