// Script tạo data: node data/locationType.js

import '../utils/db.js';
import ReportSolutionModel from '../models/reportSolution.model.js';
import WardModel from '../models/ward.model.js';
const reportSolutions = [
    'Cán bộ tiến hành kiểm tra thực tế để xác minh thông tin. Nếu phát hiện sai phạm, cán bộ sẽ liên hệ với đơn vị quảng cáo để yêu cầu chỉnh sửa hoặc tháo dỡ bảng quảng cáo không phù hợp.',
    'Cán bộ có thẩm quyền xem xét nội dung đăng ký quảng cáo, so sánh với đối chiếu với những quy định. Sau đó phản hồi đến đơn vị đơn ký và tiến hành ký hợp đồng quảng cáo',
    'Ghi nhận ý kiến và lên lịch bàn họp để chọn phương án tốt nhất, sau đó cập nhật (nếu có thay đổi)',
    'Trả lời email giải đáp thắc mắc cho người dân mỗi ngày',
];
// ward, reportType,
async function generateData() {
    // Mỗi phường có
    const reportTypeIds = [
        '65828c113ee05e214e87d3fc',
        '65828c1a3ee05e214e87d3fe',
        '65828c233ee05e214e87d400',
        '65828c2a3ee05e214e87d402',
    ];

    setTimeout(async () => {
        const wards = await WardModel.find({}, { _id: 1 });
        console.log(wards);

        for (let i = 0; i < wards.length; i++) {
            for (let j = 0; j < reportTypeIds.length; j++) {
                const data = await ReportSolutionModel.create({
                    reportType: reportTypeIds[j],
                    ward: wards[i]._id,
                    solution: reportSolutions[j],
                });
                console.log(data);
            }
        }
    }, 2000);
}

generateData();
