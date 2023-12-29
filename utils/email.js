import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();
// Define your email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bigadscorp@gmail.com', // Your Gmail email address
        pass: process.env.GOOGLE_EMAIL_APP_PASSWORD, // Your Gmail password or an app-specific password
    },
});

// Define the route to send an email
export async function sendEmail(to, subject, text) {
    // Define the email options
    const mailOptions = {
        from: 'bigadscorp@gmail.com', // Sender's email address
        to, // Recipient's email address
        subject,
        text,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('SEND MAIL ERROR:', error);
        }
        console.log('Email sent:', info);
    });
}

export function createReportEmailContent(guestName, ward, district, solution) {
    return `
    Bạn ${guestName} thân mến,
    
    Cảm ơn bạn dành thời gian để gửi báo cáo về cho sở VH-TT Thành phố Hồ Chí Minh.
    Chúng tôi đánh giá cao sự đóng góp của bạn vì một thành phố phát triển, văn minh, hiện đại.
    
    Báo cáo của bạn hiện đang được phía ban cán bộ phường ${ward}, quận ${district} xử lý và phản hồi trong thời gian sớm nhất.
    Cách xử lý theo kế hoạch như sau: ${solution}
    
    Best Regards,
    BigAds
    bigadscorp@gmail.com
    `;
}
// const solution = `
//     Cán bộ tiến hành kiểm tra thực tế bảng quảng cáo và đối chiếu xác minh thông tin.
//     Nếu phát hiện sai phạm, cán bộ sẽ liên hệ với đơn vị quảng cáo để yêu cầu chỉnh sửa hoặc tháo dỡ bảng quảng cáo không phù hợp
// `;
// const emailContent = createReportEmailContent(
//     'La Thanh Tuấn',
//     'Đa Kao',
//     '1',
//     solution,
// );

// sendMail('nttukhtn@gmail.com', 'BÁO CÁO BIỂN QUẢNG CÁO', emailContent);
