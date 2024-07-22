import multer from 'multer'

import FileUpload from '@/utils/handlers/audioUpload';

const storage = multer.memoryStorage()
const upload = multer({
     storage: storage, 
});

export const uploadFile = (req,res,next) => {
    upload.any()(req,res ,(err)=>{
        if(err){
            return next(err);
        }
        if(req.files)
        if(req.files.length > 0){
            req.files.map((file)=>{
                if (file.fieldname === "avatar") {
                    if( ! (file.mimetype.replace(/\/[^/]+$/, '') === "image")){
                        return next(new Error("avatar chỉ hỗi trợ định dạng file ảnh .png | .jpg ,vv..."));
                    }
                    req.body.avatar = new FileUpload(
                        file.originalname,
                        file.buffer
                    )

                }
                else if(file.fieldname === "sound"){
                    if( ! (file.mimetype.replace(/\/[^/]+$/, '') === "audio")){
                        return next(new Error("sound chỉ hỗi trợ định dạng file âm thanh .mp3 | .m4a ,vv..."));
                    }
                    req.body.sound = new FileUpload(
                        file.originalname,
                        file.buffer
                    )
                }
                else if(file.fieldname === "thumnail"){
                    if( ! (file.mimetype.replace(/\/[^/]+$/, '') === "image")){
                        return next(new Error(" thumnail chỉ hỗi trợ định dạng file ảnh .png | .jpg ,vv..."));
                    }
                    req.body.thumnail = new FileUpload(
                        file.originalname,
                        file.buffer
                    )
                }
                else{
                    next(new Error("chỉ hỗi trợ trường field : avatar, thumnail , sound"));
                }
                
            })
            delete req.files
        }
        next();
    });
    
}
