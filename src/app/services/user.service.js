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

        const userr = await user.save();
        if(userr.avatarUrl){
            userr.avatarUrl = APP_URL_API + userr.avatarUrl
        }
        return userr;
    }
    catch (err) {
        throw new Error(err);
    }
}

import { Types } from 'mongoose';
export const detail = async ({ email }) => {
    try {
        const user = await User.aggregate([
            {
                $match: { email: email }
            },
            {
                $addFields: {
                    likedAudio: {
                        $map: {
                            input: "$likedAudio",
                            as: "audioId",
                            in: { $toObjectId: "$$audioId" }
                        }
                    }
                }
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

        console.log(user, "=========");

        if (user[0]) {
            // Chỉ giữ lại các id dưới dạng string
            user[0].uploadedAudios = user[0].uploadedAudios.map(audio => audio._id.toString());
            user[0].downloadedAudios = user[0].downloadedAudios.map(audio => audio._id.toString());
            user[0].likedAudios = user[0].likedAudios.map(audio => audio._id.toString());
        }

        // Thêm tiền tố cho avatarUrl nếu tồn tại
        if (user[0]?.avatarUrl) {
            user[0].avatarUrl = APP_URL_API + user[0].avatarUrl;
        }

        // Loại bỏ các trường gốc để tránh lặp
        delete user[0]?.uploadedAudio;
        delete user[0]?.downloadedAudio;
        delete user[0]?.likedAudio;

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


export const likeAudio = async (email, audioId) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const audio = await Audio.findById(audioId);
        if (!audio) {
            throw new Error("Audio not found");
        }

        // Kiểm tra xem user đã thích audio này chưa
        const audioIndex = user.likedAudio.indexOf(audioId);
        let action;

        if (audioIndex === -1) {
            // Người dùng chưa thích audio, thêm vào danh sách liked
            user.likedAudio.push(audioId);
            audio.likes += 1;
            action = 'liked';
        } else {
            // Người dùng đã thích audio, gỡ ra khỏi danh sách liked
            user.likedAudio.splice(audioIndex, 1);
            audio.likes = Math.max(0, audio.likes - 1); // Bảo đảm số likes không âm
            action = 'unliked';
        }

        // Lưu thay đổi
        const updatedUser = await user.save();
        await audio.save();

        // Trả về thông tin user đã cập nhật và hành động thực hiện
        return { updatedUser, action };
    } catch (error) {
        throw new Error(`Failed to like/unlike audio: ${error.message}`);
    }
};