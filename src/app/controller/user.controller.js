import { responseSuccess,responseError } from "@/utils/helpers/response.helpers"
import { loginUser,createUser,detail as details ,updateUser ,removeUser} from "../services/user.service";
import { genToken } from "@/utils/helpers/generateToken.helpers";
import { comparePassword } from "@/utils/handlers/hashPassword";
import cache from "@/storage/cache/cache";
import { SECRET_KEY_USER } from "@/config";

export const create = async (req,res,next)=>{
    try {
        const user = await createUser(req)
        await responseSuccess(res, user);
    } catch (error) {
        next(error);
    }
}


export const detail = async (req,res,next)=>{
    try {
        const user = await details(req.curentUser);
        await responseSuccess(res, user);
    } catch (error) {
        next(error);
    }
}

export const update = async (req,res,next)=>{
    try {
        const user = await updateUser(req);
        
        await responseSuccess(res, user);
    } catch (error) {
        next(error);
    }
}

export const remove = async (req,res,next)=>{
    try {
        const curentUser = req.curentUser;
        const user = await removeUser(curentUser);
        if(user){
            await responseSuccess(res, user);
        }
        else
        await responseError(res, null);
    } catch (error) {
        next(error);
    }
}


export const login = async (req,res,next)=>{
    try {
        const user = await loginUser(req.body);
        if(comparePassword(req.body.password,user.password)){
            responseSuccess(res, {
                name : user.name,
                email : user.email,
                password : user.password,
                token :genToken(req.body,SECRET_KEY_USER)
            });
        }
        else{
            responseError(res, null,400,"tài khoản không tồn tại");
        }
    } catch (error) {
        next(error);
    }
}

export const logout = async (req,res)=>{
    const token = req.headers['authorization'].replace(/Bearer/, '').trim();
   
    const exp = req.curentUser.exp;
    const ttl = exp-Math.floor(Date.now() / 1000);
    cache.addCache(token,token,ttl);
    responseSuccess(res,null);
}