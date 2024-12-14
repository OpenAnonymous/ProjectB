import { connect } from 'mongoose';
import { MONGODB_URI, MONGODB_PASS } from './constant';

export const connectToDatabase = async () => {
    try{
        const constr = MONGODB_URI.replace(/<db_password>/, MONGODB_PASS);
        await connect(constr);
        console.log('database Connect successfully');
    }
    catch(err){
        console.log("failed to connect database", err);
    }
};