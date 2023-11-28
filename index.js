import express from 'express';

// Thư viện để sài biến môi trường
import dotenv from 'dotenv';
dotenv.config();

// Tạo server express app
const app = express();
const port = process.env.PORT || 3000;

// Kết nối cơ sở dữ liệu
import './utils/db.js';

// Sử dụng routes ở đây
// import userRouter from './routes/user.route.js';
// import authRouter from './routes/auth.route.js';
import adsLocationRouter from './routes/adsLocation.route.js';
import adsCategoryRouter from './routes/adsCategory.route.js';

// Đảm bảo response trả về theo đúng format
import RESPONSE from './constants/response.js';

app.use(express.json());

// app.use('/auth', authRouter);
// app.use('/users', userRouter);

// Địa điểm đặt biển quảng cáo
app.use('/ads-locations', adsLocationRouter);

// Biển quảng cáo
// app.use('/ads', adsRouter);

// Báo cáo (tố cáo)
// app.use('/reports', reportRouter);

// Thống kê
// app.use('/stats', statsRouter);

// CÁC THÀNH PHẦN KHÁC

// Hình thức quảng cáo
app.use('/ads-categories', adsCategoryRouter);

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
    console.log(`Big Ads server is listening on http://localhost:${port}`);
});
