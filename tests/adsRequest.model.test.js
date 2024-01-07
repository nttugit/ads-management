// tests/adsRequest.test.js

import { setupTestDb } from 'mongoose-testing-library';
import AdsRequestModel from '../path-to-your-adsRequest-model-file'; // Thay thế bằng đường dẫn thực tế đến file model của bạn

describe('AdsRequestSchema', () => {
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

  it('should create and save an ads request successfully', async () => {
    // Tạo một đối tượng ads request hợp lệ
    const validRequest = new AdsRequestModel({
      ads: 'some-ads-id',
      adsLocation: 'some-adsLocation-id',
      sender: 'some-staff-id',
      content: 'This is a test content',
      companyName: 'Test Company',
      companyEmail: 'test@example.com',
      companyPhone: '1234567890',
      companyAddress: '123 Test St',
      startDate: new Date(),
      endDate: new Date(),
      ward: 'some-ward-id',
      district: 'some-district-id',
      status: 0,
    });

    const savedRequest = await validRequest.save();

    // Kiểm tra xem request đã được lưu thành công chưa
    expect(savedRequest._id).toBeDefined();
    expect(savedRequest.ads).toBe('some-ads-id');
    expect(savedRequest.adsLocation).toBe('some-adsLocation-id');
    expect(savedRequest.sender).toBe('some-staff-id');
    expect(savedRequest.content).toBe('This is a test content');
    expect(savedRequest.companyName).toBe('Test Company');
    expect(savedRequest.companyEmail).toBe('test@example.com');
    expect(savedRequest.companyPhone).toBe('1234567890');
    expect(savedRequest.companyAddress).toBe('123 Test St');
    expect(savedRequest.ward).toBe('some-ward-id');
    expect(savedRequest.district).toBe('some-district-id');
    expect(savedRequest.status).toBe(0);
  });

  it('should fail when trying to save without required fields', async () => {
    // Tạo một đối tượng ads request thiếu các trường bắt buộc
    const invalidRequest = new AdsRequestModel({
      // Không cung cấp các trường bắt buộc
    });

    // Sử dụng try-catch để kiểm tra lỗi khi lưu một đối tượng không hợp lệ
    let error;
    try {
      await invalidRequest.save();
    } catch (e) {
      error = e;
    }

    // Kiểm tra rằng lỗi đã xảy ra và thông báo lỗi phù hợp
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.ads).toBeDefined();
    expect(error.errors.adsLocation).toBeDefined();
    expect(error.errors.sender).toBeDefined();
  });
});
