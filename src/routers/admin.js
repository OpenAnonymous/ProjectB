import { create, login, remove ,logout,detail,dashboard} from "../app/controller/admin.controller";
import { Router } from "express";
import { validate } from "@/app/middleware/validate";
import { adminCreate, adminLogin } from "@/app/requests/admin.request";
import { verifyTokenAll } from "@/app/middleware/verifyToken";
import { getCategories } from "@/app/controller/category.controller";

const router = Router();

router.get(
    '/dashboard',
    dashboard
)

router.get(
    '/manager-category',
    getCategories
)
router.post(
    '/login',
    validate(adminLogin),
    login
);

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