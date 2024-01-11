import multer from 'multer'
import path from 'path'
const storage = multer.diskStorage({
  destination: function (req, file, callback: any) {
    callback(null, './public/uploads');
  },
  filename: function (req: any, file: any, callback: any) {
    callback(null, Date.now() + '-' + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: checkFileType,
  limits: { fileSize: 1024 * 1024 * 5 },
})

const uploadXLSX = multer({
  storage: storage,
  fileFilter: checkFileTypeXLSX,
  limits: { fileSize: 1024 * 1024 * 5 },
})

function checkFileTypeXLSX(req: any, file: any, callback: any) {
  const fileTypes = /xlsx|xls/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  if (extName && file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return callback(null, true);
  } else {
    callback('Error: XLSX Only!');
  }
}

function checkFileType(req: any, file: any, callback: any) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (extName && mimeType) {
    return callback(null, true);
  } else {
    callback('Error: Images Only!');
  }
}


export {
  upload,
  uploadXLSX
}