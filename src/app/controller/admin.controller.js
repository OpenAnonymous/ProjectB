import { responseSuccess,responseError } from "../../utils/helpers/response.helpers";
import { create as createAdmin, login as loginAdmin,remove as removeAdmin } from "../services/admin.service";
import { genToken } from "@/utils/helpers/generateToken.helpers";
import { comparePassword} from "@/utils/handlers/hashPassword";
import cache from "@/storage/cache/cache";
import { SECRET_KEY_ADMIN } from "@/config";
import { Admin } from "../model/admin.model";

export const dashboard = async (req,res) =>{
    res.render("layout",{
        title : "dashboard",
        body : "category"
    });
}

export const create = async (req, res, next) =>{
    try {
        const response = await createAdmin(req.body);
        if(response){
             await responseSuccess(res, response );
        }
        else{
            throw new Error("cant create admin acc");
        }
        
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res,next) =>{
    try{
        
        const admin = await loginAdmin(req.body);
        if(comparePassword(req.body.password,admin.password)){
            responseSuccess(res, {
                email : admin.email,
                password : admin.password,
                token :genToken(req.body,SECRET_KEY_ADMIN)
            });
        }
        else{
            responseError(res, 401, "sai mật khẩu");
        }
    }
    catch(error){
        next(error);
    }   
}

export const remove = async(req,res)=>{
    const curentAdmin = req.curentAdmin;
    const admin = await removeAdmin({
        email:curentAdmin.email
    });
    if(admin){
        responseSuccess(res,admin);
    }
    else{
        responseError(res, 400, "không tìm thấy admin");
    }   
}


export const detail = async (req,res,next)=>{
    const {email} = req.curentAdmin;
    const admin = await Admin.findOne({email : email});
    if(!admin) return responseError(res,null,400,"không tìm thấy admin");
    return responseSuccess(res,admin);
}
export const logout = async (req,res)=>{
    const token = req.headers['authorization'].replace(/Bearer/, '').trim();
    const exp = req.curentAdmin.exp;
    const ttl = exp-Math.floor(Date.now() / 1000);
    cache.addCache(token,token,ttl);
    responseSuccess(res,null);
}