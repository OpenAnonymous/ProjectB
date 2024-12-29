import { create, filter, remove, update ,detail} from "@/app/controller/category.controller";
import * as joirequest from "@/app/requests/category.request";
import { validate } from "@/app/middleware/validate";
import { verifyTokenAll } from "@/app/middleware/verifyToken";
import Router from "express";

const router = Router();

router.get(
    '/filter',
    validate(joirequest.filter),
    filter
)

router.post(
    '/detail',
    validate(joirequest.detail),
    detail
)

router.post(
    '/create',
    verifyTokenAll("admin"),
    validate(joirequest.create),
    create
)

router.put(
    '/update',
    verifyTokenAll("admin"),
    validate(joirequest.update),
    update

)

router.delete(
    '/delete',
    verifyTokenAll("admin"),
    validate(joirequest.detail),
    remove
)

export default router;
