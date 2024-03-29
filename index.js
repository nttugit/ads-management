import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// Thư viện để sài biến môi trường
import dotenv from 'dotenv';
dotenv.config();

// Tạo server express app
const app = express();
const port = process.env.PORT || 3000;

// GHI LOG

import winston from 'winston';
import expressWinston from 'express-winston';
import { format } from 'logform';
import DailyRotateFile from 'winston-daily-rotate-file';
// Để xoá log định kỳ
import cron from 'node-cron';
import fs from 'fs';

// THIẾT LẬP LOGGING
// Thiết lập transport cho Winston để quay vòng log hàng ngày
const dailyRotateTransport = new DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});
// Thiết lập các tùy chọn định dạng log của Winston
const logFormat = format.combine(format.timestamp(), format.json());

// Thiết lập Winston logger
const logger = winston.createLogger({
    format: logFormat,
    transports: [new winston.transports.Console(), dailyRotateTransport],
});

// Xoá log files cũ mỗi tuần vào 1 thứ Hai lúc 00:00 AM
cron.schedule('0 0 * * 1', () => {
    const logsDirectory = 'logs';

    fs.readdir(logsDirectory, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            const filePath = `${logsDirectory}/${file}`;

            fs.stat(filePath, (err, stat) => {
                if (err) throw err;

                const currentTime = new Date().getTime();
                const fileCreationTime = stat.birthtime.getTime();
                const timeDifference = currentTime - fileCreationTime;

                // Xoá log files cũ hơn 7 ngày
                if (timeDifference > 7 * 24 * 60 * 60 * 1000) {
                    fs.unlink(filePath, (err) => {
                        if (err) throw err;
                        console.log(`Deleted log file: ${filePath}`);
                    });
                }
            });
        });
    });
});

// Sử dụng middleware express-winston để ghi log các request và response
app.use(
    expressWinston.logger({
        // transports: [new winston.transports.Console(), dailyRotateTransport],
        transports: [dailyRotateTransport],
        format: logFormat,
        meta: true,
        msg: 'HTTP {{req.method}} {{res.statusCode}} {{req.url}}',
        expressFormat: true,
        colorize: false,
    }),
);

// Middleware xử lý lỗi và ghi log lỗi
app.use((err, req, res, next) => {
    logger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
            req.method
        } - ${req.ip}`,
    );
    next(err);
});

// Middleware express-winston để ghi log lỗi
app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console(), dailyRotateTransport],
        format: logFormat,
    }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('uploads'));
app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));

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
import reportTypeRouter from './routes/reportType.route.js';
import reportRouter from './routes/report.route.js';
import editRequestRouter from './routes/editRequest.route.js';
import adsRequestRouter from './routes/adsRequest.route.js';

import districtRouter from './routes/district.route.js';
import wardRouter from './routes/ward.route.js';
import mapRouter from './routes/map.route.js';

// Đảm bảo response trả về theo đúng format
import RESPONSE from './constants/response.js';

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

// Loại báo cáo
app.use('/report-types', reportTypeRouter);

// Báo cáo (bao gồm báo cáo biển quảng cáo và địa điểm đặt)
app.use('/reports', reportRouter);

// Yêu cầu chỉnh sửa biển quảng cáo và điểm đặt
app.use('/edit-requests', editRequestRouter);

// Yêu cầu cấp phép quảng cáo (cho các công ty)
app.use('/ads-requests', adsRequestRouter);

// Phường, quận
app.use('/districts', districtRouter);
app.use('/wards', wardRouter);

// Bản đồ
app.use('/map', mapRouter);
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
