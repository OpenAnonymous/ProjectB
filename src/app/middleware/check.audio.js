import { Category } from "../model/category.model";
import { responseError } from "@/utils/helpers/response.helpers";
import { isValidObjectId } from "mongoose";

export const categoryCheck = async (req,res,next) => {
   try {
    const categories = req.body.categories;
    if(categories)
    if (categories.length > 0) {
        const errlist = [];
        await Promise.all(categories.map(async (id) => {
            if (isValidObjectId(id)) {
                const category = await Category.findById(id);
                if (!category) {
                    errlist.push(category);
                }
            }
            else {
                errlist.push(id);
            }
        }));

        if (errlist.length > 0) {
            return responseError(res, {
                message: "danh sách id lỗi",
               ...errlist
            },400,"lỗi do id danh mục sai");
        }
    }
    next();
} catch (err) {
    next(err);
    return responseError(res, err, 400, "lỗi khi kiểm tra danh mục");
}
}