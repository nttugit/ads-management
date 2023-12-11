// Script tạo data: node data/billboardType.js

import '../utils/db.js';
import BillboardTypeModel from '../models/billboardType.model.js';

const rawData = [
    'Trụ bảng hiflex',
    'Trụ màn hình điện tử LED',
    'Trụ hộp đèn',
    'Bảng hiflex ốp tường',
    'Màn hình điện tử ốp tường',
    'Trụ treo băng rôn dọc',
    'Trụ treo băng rôn ngang',
    'Trụ/Cụm pano',
    'Cổng chào',
    'Trung tâm thương mại',
];

async function generateData() {
    const data = rawData.map((item) => ({ name: item }));
    const result = await BillboardTypeModel.create(data);
    console.log('Generated result: ', result);
}

generateData();
