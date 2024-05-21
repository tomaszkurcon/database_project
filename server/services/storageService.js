const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const storage = require("../config/firebase.config");

exports.uploadFile = async (file) => {
  try {
    const fileName = new Date().toISOString() + "-" + file.originalname;
    const data = file.buffer;
    const fileRef = ref(storage, fileName);
    await uploadBytes(fileRef, data);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    throw new Error(error);
  }
};
