import express from 'express';
import cors from 'cors'
import morgan from 'morgan';

// Thư viện để sài biến môi trường
import dotenv from 'dotenv';
dotenv.config();

// Tạo server express app
const app = express();
const port = process.env.PORT || 3000;

// Kết nối cơ sở dữ liệu
import './utils/db.js';

// Import routes ở đây
import authRouter from './routes/auth.route.js';
import staffRouter from './routes/staff.route.js';
import adsCategoryRouter from './routes/adsCategory.route.js';
import locationTypeRouter from './routes/locationType.route.js';
import adsLocationRouter from './routes/adsLocation.route.js';
import adsRouter from './routes/ads.route.js';
import billboardTypeRouter from './routes/billboardType.route.js';

// import districtRouter from './routes/district.route.js';
// import wardRouter from './routes/ward.route.js';

// Đảm bảo response trả về theo đúng format
import RESPONSE from './constants/response.js';

app.use(express.json());
app.use(cors());
app.use(express.static('uploads'))
app.use('/uploads', express.static('uploads'))
app.use(morgan('dev'));

// Xác thực
app.use('/auth', authRouter);
// Cán
app.use('/staff', staffRouter);

// Địa điểm đặt biển quảng cáo
app.use('/ads-locations', adsLocationRouter);
// Hình thức quảng cáo
app.use('/ads-categories', adsCategoryRouter);
// Loại địa điểm
app.use('/location-types', locationTypeRouter);

// Biển quảng cáo
app.use('/ads', adsRouter);
// Loại biển quảng cáo
app.use('/billboard-types', billboardTypeRouter);

// Phường, quận
// app.use('/districts', districtRouter);
// app.use('/wards', wardRouter);

// Báo cáo (tố cáo)
// app.use('/reports', reportRouter);

// Thống kê
// app.use('/stats', statsRouter);

// CÁC THÀNH PHẦN KHÁC

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
