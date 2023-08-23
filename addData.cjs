const admin = require('firebase-admin');
const serviceAccount = require('./course-plannr-firebase-adminsdk-gia2a-546a35d9f3.json'); // Replace with the path to your key

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const classesToAdd = [

    { classname: 'SI 206', creditNos: 4 },
    { classname: 'SI 301', creditNos: 3 },
    { classname: 'SI 339', creditNos: 4 },
    { classname: 'SI 364', creditNos: 4 },
    { classname: 'SI 422', creditNos: 3 },
    { classname: 'SI 630', creditNos: 3 },
    // ... Add as many classes as you want
];

async function addClasses() {
    const collectionRef = db.collection('classes');
    for (const cls of classesToAdd) {
        await collectionRef.add(cls);
        console.log(`Added class: ${cls.classname}`);
    }
    console.log('All classes added!');
}

addClasses();
