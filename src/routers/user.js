import { Router } from "express";
import { create,detail,update,remove,login,logout,likeAudio } from "@/app/controller/user.controller";
import { uploadFile } from "@/config/multer";
import { validate } from "@/app/middleware/validate";
import { userCreate,userUpdate,userRemove,userLogin,likeAudio as lk} from "@/app/requests/user.request";
import { verifyTokenAll } from "@/app/middleware/verifyToken";
import { getCategories } from "@/app/controller/category.controller";

const router = Router();

router.get(
    '/infor',
    verifyTokenAll("user"),
     detail
);


router.post(
    '/register',
    uploadFile,
    validate(userCreate),
    create
)

router.put(
    '/update',
    verifyTokenAll("user"),
    uploadFile,
    validate(userUpdate),
    update
)

router.delete(
    '/delete',
    verifyTokenAll("user"),
    remove
)

router.post(
    '/login',
    validate(userLogin),
    login
)

router.post(
    '/logout',
    verifyTokenAll("user"),
    logout
)

router.post(
    '/like-audio',
    verifyTokenAll("user"),
    validate(lk),
    likeAudio
)

export default router;