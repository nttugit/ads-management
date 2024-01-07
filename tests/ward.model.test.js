// tests/ward.test.js

import { setupTestDb } from 'mongoose-testing-library';
import WardModel from '../path-to-your-ward-model-file'; // Thay thế bằng đường dẫn thực tế đến file model của bạn

describe('WardSchema', () => {
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

  it('should create and save a ward successfully', async () => {
    // Tạo một đối tượng ward hợp lệ
    const validWard = new WardModel({
      name: 'Test Ward',
      district: 'some-district-id',
    });

    const savedWard = await validWard.save();

    // Kiểm tra xem ward đã được lưu thành công chưa
    expect(savedWard._id).toBeDefined();
    expect(savedWard.name).toBe('Test Ward');
    expect(savedWard.district).toBe('some-district-id');
  });

  it('should fail when trying to save without required fields', async () => {
    // Tạo một đối tượng ward thiếu các trường bắt buộc
    const invalidWard = new WardModel({
      // Không cung cấp các trường bắt buộc
    });

    // Sử dụng try-catch để kiểm tra lỗi khi lưu một đối tượng không hợp lệ
    let error;
    try {
      await invalidWard.save();
    } catch (e) {
      error = e;
    }

    // Kiểm tra rằng lỗi đã xảy ra và thông báo lỗi phù hợp
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.name).toBeDefined();
    expect(error.errors.district).toBeDefined();
  });
});
