/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/*import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
*/
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });*/

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

exports.createUserDocument = functions.auth.user().onCreate((user: functions.auth.UserRecord) => {
    const userId = user.uid;
    const userEmail = user.email;
    // Add any other default data you want to store

    const defaultData = {
        email: userEmail,
        semesters: [], // Or any default semesters data you'd like
        // ... any other default data
    };

    return admin.firestore().collection('users').doc(userId).set(defaultData);
});
