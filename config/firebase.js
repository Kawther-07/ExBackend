const admin = require('firebase-admin');
const serviceAccount = require('../firebase/doolabmobile-25fdb-firebase-adminsdk-rcw2n-5c595c52c3.json');
//../firebase/doolabmobile-4d2a0-firebase-adminsdk-bncu3-0692b38b7b.json
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'doolabmobile-25fdb.appspot.com'
});
//doolabmobile-4d2a0.appspot.com
module.exports = admin;
