const { uploadFile } = require("../../services/storageService");


exports.postUploadFile = async (req, res) => {
    try {
        const fileUrl = await uploadFile(req.file);
        return res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Could not upload file"});
    }
}