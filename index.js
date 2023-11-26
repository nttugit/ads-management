import express from 'express';

// Thư viện để sài biến môi trường
import dotenv from 'dotenv';
dotenv.config();

// Tạo server express app
const app = express();
const port = process.env.PORT || 3000;

// Kết nối cơ sở dữ liệu
import db from './utils/db.js';

// Sử dụng routes ở đây
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

// Đảm bảo response trả về theo đúng format
import RESPONSE from './constants/response.js';

app.use(express.json());

// Đăng nhập chung cho thường dân và cán bộ
app.use('/auth', authRouter);

// Người dân
app.use('/users', userRouter);

// Cán bộ

// Biển quảng cáo
// app.use('/ads', adsRouter);

// Báo cáo (tố cáo)
// app.use('/reports', reportRouter);

// Thống kê
// app.use('/stats', statsRouter);

// Ví dụ cách response đúng
app.get('/', (req, res) => {
    res.status(200).json(RESPONSE.SUCCESS('Hello World!', ''));
});

// Xử lý lỗi 404
app.use((req, res) => {
    res.status(404).json(RESPONSE.FAILURE(404, 'Endpoint not found'));
});

// Xử lý lỗi 500
app.use((err, req, res, next) => {
    res.status(500).json(RESPONSE.FAILURE(500, 'Something went wrong'));
});

app.listen(port, () => {
    console.log(`Big Ads server is listening on port ${port}`);
});
