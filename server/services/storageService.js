
const storage = require("../config/firebase.config");
const { getDownloadURL } = require("firebase-admin/storage");

exports.getFileURL = async (fileName) => {
  try {
    const fileRef = storage.bucket().file(fileName);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    throw new Error(error);
  }
};
exports.uploadFile = async (file) => {
  try {
    const fileName = new Date().toISOString() + "-" + file.originalname;
    const data = file.buffer;    
    const fileRef = storage.bucket().file(fileName);
    await fileRef.save(data);
    return fileName;
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteFile = async (fileName) => {
  try {
    const fileRef = storage.bucket().file(fileName);
    await fileRef.delete();
  } catch (error) {
    throw new Error(error);
  }
}
