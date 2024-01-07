// Script tạo data: node data/locationType.js

import '../utils/db.js';
import LocationTypeModel from '../models/locationType.model.js';
const rawData = [
    'Đất công/Công viên/Hành lang an toàn giao thông',
    'Đất tư nhân/Nhà ở riêng lẻ',
    'Trung tâm thương mại',
    'Chợ',
    'Cây xăng',
    'Nhà chờ xe buýt',
];

async function generateData() {
    const data = rawData.map((item) => ({ name: item }));
    const result = await LocationTypeModel.create(data);
    console.log('Generated result: ', result);
}

generateData();
