import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs"
import path from "path";

export const fileTypes={
    image:["image/png","image/jpeg","image/gif"],
    video:["video/mp4"],
    audio:["audio/mpeg"],
    pdf:["application/pdf"]
}

export const multerLocal = (customValidation=[],customePath="general") => {
    const fullpath= path.resolve("./uploads",customePath)
  if(!fs.existsSync(fullpath)){
     fs.mkdirSync(fullpath,{recursive:true})
    }
  const storage = multer.diskStorage({
    destination: function (request, file, cb) {
      cb(null,fullpath);
    },
    filename: function (request, file, cb) {
      cb(null, nanoid(4) + file.originalname);
      //balash b3dha 3hsan el extension
    },
  });
  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format"), false);
    }
  }

  const upload = multer({ fileFilter, storage });
  return upload;
};


export const multerHost = (customValidation=[]) => {
  
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format"), false);
    }
  }

  const upload = multer({ fileFilter, storage });
  return upload;
};
