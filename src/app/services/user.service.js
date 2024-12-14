import { User } from "../model/user.model";
import { generatePassword } from "@/utils/handlers/hashPassword";
import uniqid from 'uniqid';
import FileUpload from "@/utils/handlers/audioUpload";
import { APP_URL_API } from "@/config";
import Audio from "../model/audio.model";

export const createUser = async (req) => {
    try {
        let avatarUrl = "";
        if (req.body.avatar instanceof FileUpload) {
            avatarUrl =  req.body.avatar.save();
        }
        const payload = req.body;

        const user = new User({
            name: payload.name || uniqid.time("user-"),
            password: generatePassword(payload.password),
            email: payload.email,
            avatarUrl: avatarUrl,
            bio: payload.bio || "",
        });

        return await user.save();
    }
    catch (err) {
        throw new Error(err);
    }
}

export const detail = async ({ email }) => {
    try {
        const user = await User.aggregate([
            {
                $match: { email: email }
            },
            {
                $lookup: {
                    from: 'audios',
                    localField: 'uploadedAudio',
                    foreignField: '_id',
                    as: 'uploadedAudios'
                }
            },
            {
                $lookup: {
                    from: 'audios',
                    localField: 'downloadedAudio',
                    foreignField: '_id',
                    as: 'downloadedAudios'
                }
            },
            {
                $lookup: {
                    from: 'audios',
                    localField: 'likedAudio',
                    foreignField: '_id',
                    as: 'likedAudios'
                }
            }
        ]);
    
        if(user[0].uploadedAudios.length > 0){
            user[0].uploadedAudios = user[0].uploadedAudios.map(audio => {
                audio.sourceUrl = APP_URL_API + audio.sourceUrl
                return audio
            })
        }
        if(user[0].avatarUrl){
            user[0].avatarUrl = APP_URL_API + user[0].avatarUrl
        }
    
        return user[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
}


export const updateUser = async (req) => { 
    const user = await User.findOne({email:req.curentUser.email});

    if(req.body.avatar instanceof FileUpload){
        FileUpload.remove(user.avatarUrl);
        user.avatarUrl = req.body.avatar.save();
    }
    const payload = req.body;
    payload.name ? user.name = payload.name : "";
    payload.email ? user.email = payload.email : "";
    payload.bio ? user.bio = payload.bio : "";

    
    const userUpdated = await user.save();
    console.log(userUpdated,"======");
    if(userUpdated.avatarUrl){
        userUpdated.avatarUrl = APP_URL_API + user.avatarUrl
    }
    return userUpdated;
}

export const removeUser = async (payload)=>{
    payload = {
        email: payload.email
    }
    const user = await User.findOne(payload);
    
    await Audio.updateMany(
        {_id : { $in : user.uploadedAudio }},
        {authorId : ""}
    )

    FileUpload.remove(user.avatarUrl);
    return await User.deleteOne(payload);
}

//login/out

export const loginUser = async (payload)=>{
    const user = await User.findOne({email : payload.email})
    const data = await Promise.all(user.uploadedAudio.map( async (audio_id)=>{
        const audio = await Audio.findById(audio_id);
        if(audio) return audio._id;
    }))
    user.uploadedAudio = data
    return user;
}
