import { responseError, responseSuccess } from "@/utils/helpers/response.helpers";
import { filterAudio,createAudio,detailAudio,updateAudio,removeAudio } from "../services/audio.service";
import {STORAGE_DIR } from "@/config";
import { join } from "path"
import fs from "fs";

export const filter = async (req, res,next) => {
    const audios = await filterAudio(req.query);
    return await responseSuccess(res,audios);
}

export const create = async (req, res, next) =>{
    const audio = await createAudio(req);
    return await responseSuccess(res,audio);
}

export const detail = async (req,res,next)=>{
    const audio = await detailAudio(req.query);
    return await responseSuccess(res,audio);
}

export const update = async (req,res,next)=>{
    const audio = await updateAudio(req);
    return audio ?  await responseSuccess(res,audio) :
    responseError(res, null, 400, "Cập nhật thất bại");
}

export const remove = async (req,res,next)=>{
    const audio = await removeAudio(req);
    return audio ? await responseSuccess(res,audio) :
    await responseError(res,null,403,"false")
}

export const download = async (req,res,next)=>{
    const path = join(STORAGE_DIR,req.query.filename);
    if(fs.existsSync(path)){
        res.download(path,(err)=>{
            if(err) next(err);
        });
    }
    else(
        responseError(res,null,400, "file không tồn tại")
    )
}