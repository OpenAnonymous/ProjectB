import cron from 'node-cron';
import Audio from "@/app/model/audio.model"
import { User } from '../model/user.model';
import nodemailer from 'nodemailer';

// Cấu hình email gửi thông báo (cần thay đổi thông tin thật của bạn)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'vm28.dev@gmail.com',
        pass: 'komr gzcw ervg svuw'  
    }
});

// Hàm gửi email thông báo
const sendNotificationEmail = async (email, audioName) => {
    try {
        await transporter.sendMail({
            from: '"Audio Platform" <vm28.dev@gmail.com>',
            to: email,
            subject: 'âm thanh của bạn đã bị xóa do vi phạm nguyên tắc cộng đồng , bạn có thể khiếu nại đến email này',
            text: `Your audio "${audioName}" has been removed due to excessive reports. Please contact support for more details.`,
        });
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Hàm tự động xóa audio và gửi email thông báo
export const deleteReportedAudios = async () => {
    try {
        console.log("tự động xóa audio vi phạm bật");
        const audiosToDelete = await Audio.find({ reports: { $gt: 100 } });
        for (const audio of audiosToDelete) {
            const author = await User.findOne({ _id: audio.authorId });
            if (author) {
                await sendNotificationEmail(author.email, audio.name);
            }
            await Audio.deleteOne({ _id: audio._id });
            console.log(`Deleted audio: ${audio.name}`);
        }
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
};

// Hẹn giờ chạy lúc 7h sáng hàng ngày
cron.schedule('0 7 * * *', deleteReportedAudios, {
    timezone: "Asia/Ho_Chi_Minh"  // Đảm bảo múi giờ Việt Nam
});
