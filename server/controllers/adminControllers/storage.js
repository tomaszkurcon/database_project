const { uploadFile, deleteFile, getFileURL } = require("../../services/storageService");


exports.getFile = async (req, res) => {
    const fileName = req.params.fileName;
    try {
        const url = await getFileURL(fileName);
        return res.status(200).json({ url });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Could not get file" });
    }
}
exports.postUploadFile = async (req, res) => {
    try {
        const fileName = await uploadFile(req.file);
        return res.status(200).json({ message: "File uploaded successfully", fileName});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Could not upload file"});
    }
}

exports.deleteFile = async (req, res) => {
    const fileName = req.body.fileName;
    try {
        await deleteFile(fileName);
        return res.status(200).json({ message: "File deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Could not delete file"});
    }
};