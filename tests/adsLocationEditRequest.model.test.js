// tests/adsLocationEditRequest.test.js

import { setupTestDb } from 'mongoose-testing-library';
import AdsLocationEditRequestModel from '../path-to-your-adsLocationEditRequest-model-file'; // Thay thế bằng đường dẫn thực tế đến file model của bạn

describe('AdsLocationEditRequestSchema', () => {
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

  it('should create and save an ads location edit request successfully', async () => {
    // Tạo một đối tượng ads location edit request hợp lệ
    const validEditRequest = new AdsLocationEditRequestModel({
      adsLocation: 'some-adsLocation-id',
      address: 'some-address-id',
      locationType: 'some-locationType-id',
      adsCategory: 'some-adsCategory-id',
      isPlanned: true,
      reason: 'Change location type',
      sender: 'some-staff-id',
      ward: 'some-ward-id',
      district: 'some-district-id',
      status: 0,
    });

    const savedEditRequest = await validEditRequest.save();

    // Kiểm tra xem edit request đã được lưu thành công chưa
    expect(savedEditRequest._id).toBeDefined();
    expect(savedEditRequest.adsLocation).toBe('some-adsLocation-id');
    expect(savedEditRequest.address).toBe('some-address-id');
    expect(savedEditRequest.locationType).toBe('some-locationType-id');
    expect(savedEditRequest.adsCategory).toBe('some-adsCategory-id');
    expect(savedEditRequest.isPlanned).toBe(true);
    expect(savedEditRequest.reason).toBe('Change location type');
    expect(savedEditRequest.sender).toBe('some-staff-id');
    expect(savedEditRequest.ward).toBe('some-ward-id');
    expect(savedEditRequest.district).toBe('some-district-id');
    expect(savedEditRequest.status).toBe(0);
  });

  it('should fail when trying to save without required fields', async () => {
    // Tạo một đối tượng ads location edit request thiếu các trường bắt buộc
    const invalidEditRequest = new AdsLocationEditRequestModel({
      // Không cung cấp các trường bắt buộc
    });

    // Sử dụng try-catch để kiểm tra lỗi khi lưu một đối tượng không hợp lệ
    let error;
    try {
      await invalidEditRequest.save();
    } catch (e) {
      error = e;
    }

    // Kiểm tra rằng lỗi đã xảy ra và thông báo lỗi phù hợp
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.adsLocation).toBeDefined();
    expect(error.errors.reason).toBeDefined();
    expect(error.errors.sender).toBeDefined();
  });
});
