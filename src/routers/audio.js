import { Router } from "express";
import { filter,create,detail,update,remove,download } from "@/app/controller/audio.controller";
import { validate } from "@/app/middleware/validate";
import { filterAudio,createAudio,updateAudio,detailAudio } from "@/app/requests/audio.request";
import { uploadFile } from "@/config/multer";
import {categoryCheck} from "@/app/middleware/check.audio"
import { verifyTokenAll } from "@/app/middleware/verifyToken";

const router = Router();

router.get(
    '/filter',
    validate(filterAudio),
    filter
)

router.get(
    '/detail',
    validate(detailAudio),
    detail
)

router.post(
    '/create',
    verifyTokenAll("user"),
    uploadFile,
    validate(createAudio),
    categoryCheck,
    create
)

router.put(
    '/update',
    verifyTokenAll("user"),
    uploadFile,
    validate(updateAudio),
    categoryCheck,
    update
)

router.delete(
    '/delete',
    verifyTokenAll("user"),
    validate(detailAudio),
    remove
)

router.get(
    '/download',
    download
)

export default router;