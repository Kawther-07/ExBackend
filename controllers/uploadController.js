exports.uploadFiles = async (req, res) => {
    try {
      console.log("req.files: ", req.files);
      const uploadedFiles = req.files.map((file) => {
        return {
          path: file.path,
        };
      });
  
      const uploadedFilesUrls = uploadedFiles.map((file) => {
        return {
          path: "/" + file.path.split("\\").join("/"),
        };
      });
      res.status(200).json({ status: true, files: uploadedFilesUrls });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  };
  