// tests/adsCategory.test.js

import { setupTestDb } from 'mongoose-testing-library';
import AdsCategoryModel from '../path-to-your-adsCategory-model-file'; // Thay thế bằng đường dẫn thực tế đến file model của bạn

describe('AdsCategorySchema', () => {
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

  it('should create and save an ads category successfully', async () => {
    const validAdsCategory = new AdsCategoryModel({
      name: 'Electronics', // Ví dụ tên danh mục quảng cáo
    });

    const savedAdsCategory = await validAdsCategory.save();

    // Kiểm tra xem danh mục quảng cáo đã được lưu thành công chưa
    expect(savedAdsCategory._id).toBeDefined();
    expect(savedAdsCategory.name).toBe('Electronics');
  });

  it('should fail when trying to save without required field', async () => {
    const invalidAdsCategory = new AdsCategoryModel({
      // Không cung cấp tên danh mục quảng cáo
    });

    // Sử dụng try-catch để kiểm tra lỗi khi lưu một đối tượng không hợp lệ
    let error;
    try {
      await invalidAdsCategory.save();
    } catch (e) {
      error = e;
    }

    // Kiểm tra rằng lỗi đã xảy ra và thông báo lỗi phù hợp
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.name).toBeDefined();
  });
});
