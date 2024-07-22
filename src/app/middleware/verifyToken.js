import cache from "@/storage/cache/cache";
import { SECRET_KEY_USER,SECRET_KEY_ADMIN } from "@/config";
import jwt from "jsonwebtoken";
import { responseError } from '@/utils/helpers/response.helpers';

export const verifyTokenAll = (condition = "all") => {
    return (req, res, next) => {
        let token = req.headers['authorization'];
        if (token) {
            token = req.headers['authorization'].replace(/Bearer/, '').trim();
            if (!cache.getCache(token)) {
                if (condition === "all") {
                    let isAdminTokenValid = false;
                    let isUserTokenValid = false;

                    jwt.verify(token, SECRET_KEY_ADMIN, (err, decoded) => {
                        if (!err) {
                            req.curentAdmin = decoded;
                            isAdminTokenValid = true;
                            
                        }
                    });

                    jwt.verify(token, SECRET_KEY_USER, (err, decoded) => {
                        if (!err) {
                            req.curentUser = decoded;
                            isUserTokenValid = true;
                            
                        }
                    });

                    if (!isAdminTokenValid && !isUserTokenValid) {
                        responseError(res, null, 403, "Từ chối truy cập");
                        
                    } else {
                        next();
                    }
                }
                else if(condition === "admin"){
                    jwt.verify(token, SECRET_KEY_ADMIN, (err, decoded) => {
                        if (err) {
                            responseError(res, err, 403, "admin bị từ chối truy cập");
                        }
                        else {
                            req.curentAdmin = decoded;
                            next();
                        }
                    })
                }
                else if(condition === "user"){
                    jwt.verify(token, SECRET_KEY_USER, (err, decoded) => {
                        if (err) {
                            responseError(res, err, 403, "user bị từ chối truy cập");
                        }
                        else {
                            req.curentUser = decoded;
                            next();
                        }
                    })
                }
            } else {
                responseError(res, null, 401, "Token đã hết hạn sử dụng");
            }
        } else {
            responseError(res, null, 400, "Token không được cung cấp");
        }
    };
};
