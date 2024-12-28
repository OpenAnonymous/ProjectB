import admin from './admin';
import audio from './audio';
import category from './category';
import user from './user';

const route = (app) => {
    app.use("/admin",admin);
    app.use("/sound",audio);
    app.use("/categories",category);
    app.use("/user",user);
    app.use("/test",(req,res)=>{
        res.render('index',{title : "hello world tesst"});
    });
};

export default route; 