const multer = require('multer');
const storage = multer.memoryStorage(); // תמונה בזיכרון, נכתוב אותה ידנית לקובץ
const upload = multer({ storage: storage });
module.exports = upload;
