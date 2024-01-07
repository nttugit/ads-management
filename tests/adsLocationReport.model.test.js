// tests/adsLocationReport.test.js

import { setupTestDb } from 'mongoose-testing-library';
import AdsLocationReportModel from '../path-to-your-adsLocationReport-model-file'; // Thay thế bằng đường dẫn thực tế đến file model của bạn

describe('AdsLocationReportSchema', () => {
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

  it('should create and save an ads location report successfully', async () => {
    // Tạo một đối tượng ads location report hợp lệ
    const validReport = new AdsLocationReportModel({
      adsLocation: 'some-adsLocation-id',
      report: 'some-report-id',
      ward: 'some-ward-id',
      district: 'some-district-id',
      guestId: 'guest123',
      status: 0,
    });

    const savedReport = await validReport.save();

    // Kiểm tra xem report đã được lưu thành công chưa
    expect(savedReport._id).toBeDefined();
    expect(savedReport.adsLocation).toBe('some-adsLocation-id');
    expect(savedReport.report).toBe('some-report-id');
    expect(savedReport.ward).toBe('some-ward-id');
    expect(savedReport.district).toBe('some-district-id');
    expect(savedReport.guestId).toBe('guest123');
    expect(savedReport.status).toBe(0);
  });

  it('should fail when trying to save without required fields', async () => {
    // Tạo một đối tượng ads location report thiếu các trường bắt buộc
    const invalidReport = new AdsLocationReportModel({
      // Không cung cấp các trường bắt buộc
    });

    // Sử dụng try-catch để kiểm tra lỗi khi lưu một đối tượng không hợp lệ
    let error;
    try {
      await invalidReport.save();
    } catch (e) {
      error = e;
    }

    // Kiểm tra rằng lỗi đã xảy ra và thông báo lỗi phù hợp
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.adsLocation).toBeDefined();
    expect(error.errors.report).toBeDefined();
    expect(error.errors.guestId).toBeDefined();
  });
});
