// tests/reportSolution.test.js

import { setupTestDb } from 'mongoose-testing-library';
import ReportSolutionModel from '../path-to-your-reportSolution-model-file'; // Thay thế bằng đường dẫn thực tế đến file model của bạn

describe('ReportSolutionSchema', () => {
  let testDb;

  // Khởi tạo cơ sở dữ liệu thử nghiệm trước khi chạy các test
  beforeAll(async () => {
    testDb = await setupTestDb();
  });

  // Xóa dữ liệu sau khi mỗi test
  afterEach(async () => {
    await testDb.clearDatabase();
  });

  // Đóng cơ sở dữ liệu khi kết thúc tất cả các test
  afterAll(async () => {
    await testDb.closeDatabase();
  });

  it('should create and save a report solution successfully', async () => {
    // Tạo một đối tượng report solution hợp lệ
    const validReportSolution = new ReportSolutionModel({
      ward: 'some-ward-id',
      reportType: 'some-reportType-id',
      solution: 'Test solution content',
    });

    const savedReportSolution = await validReportSolution.save();

    // Kiểm tra xem report solution đã được lưu thành công chưa
    expect(savedReportSolution._id).toBeDefined();
    expect(savedReportSolution.ward).toBe('some-ward-id');
    expect(savedReportSolution.reportType).toBe('some-reportType-id');
    expect(savedReportSolution.solution).toBe('Test solution content');
  });

  it('should fail when trying to save without required fields', async () => {
    // Tạo một đối tượng report solution thiếu các trường bắt buộc
    const invalidReportSolution = new ReportSolutionModel({
      // Không cung cấp các trường bắt buộc
    });

    // Sử dụng try-catch để kiểm tra lỗi khi lưu một đối tượng không hợp lệ
    let error;
    try {
      await invalidReportSolution.save();
    } catch (e) {
      error = e;
    }

    // Kiểm tra rằng lỗi đã xảy ra và thông báo lỗi phù hợp
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.ward).toBeDefined();
    expect(error.errors.reportType).toBeDefined();
  });
});
