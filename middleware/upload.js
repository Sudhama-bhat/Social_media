import multer from "multer";
import os from "os";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        // Use /tmp for Vercel/serverless environments
        cb(null, os.tmpdir())
    },
    filename: function(req, file, cb){
        cb(null,Date.now()+"-"+file.originalname)  //841532-photo.png
    }
})

const upload = multer({storage})
export default upload;