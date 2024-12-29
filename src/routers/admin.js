import { create, login, remove ,logout,detail,dashboard , loginPage} from "../app/controller/admin.controller";
import { Router } from "express";
import { validate } from "@/app/middleware/validate";
import { adminCreate, adminLogin } from "@/app/requests/admin.request";
import { verifyTokenAll } from "@/app/middleware/verifyToken";

const router = Router();

router.get(
    '/dashboard',
    dashboard
)

router.post(
    '/login',
    validate(adminLogin),
    login
);

router.get(
    '/login',
    loginPage
)

router.post(
    '/create',
    validate(adminCreate),
    create,
);

router.get(
    '/',
    verifyTokenAll("admin"),
    detail
)

router.delete(
    '/delete',
    verifyTokenAll("admin"),
     remove
);

router.post(
    '/logout',
    verifyTokenAll("admin"),
    logout
);

export default router;