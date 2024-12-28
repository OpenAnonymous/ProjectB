import { responseError, responseSuccess } from "@/utils/helpers/response.helpers";
import { filterAudio,createAudio,detailAudio,updateAudio,removeAudio } from "../services/audio.service";
import {STORAGE_DIR } from "@/config";
import { join } from "path"
import Audio from "../model/audio.model";
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

export const download = async (req, res, next) => {
    try {
        const { filename } = req.query;

        // Kiểm tra nếu file tồn tại
        const path = join(STORAGE_DIR, filename);
        if (fs.existsSync(path)) {
            // Tìm và cập nhật số lượng downloads trong cơ sở dữ liệu
            const audio = await Audio.findOneAndUpdate(
                { sourceUrl: filename }, // Tìm dựa vào sourceUrl (hoặc sửa điều kiện phù hợp)
                { $inc: { downloads: 1 } }, // Tăng downloads thêm 1
                { new: true } // Trả về tài liệu đã được cập nhật
            );

            if (!audio) {
                return responseError(res, null, 404, 'Audio không tồn tại trong cơ sở dữ liệu');
            }

            // Gửi file xuống người dùng
            res.download(path, (err) => {
                if (err) next(err);
            });
        } else {
            return responseError(res, null, 400, 'File không tồn tại');
        }
    } catch (error) {
        next(error);
    }
};