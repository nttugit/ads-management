// tests/adsLocation.test.js

import { setupTestDb } from 'mongoose-testing-library';
import AdsLocationModel from '../path-to-your-adsLocation-model-file'; // Thay thế bằng đường dẫn thực tế đến file model của bạn
import AddressModel from '../path-to-your-address-model-file'; // Đường dẫn đến AddressModel của bạn

describe('AdsLocationSchema', () => {
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

  it('should create and save an ads location successfully', async () => {
    // Tạo một đối tượng ads location hợp lệ
    const validAdsLocation = new AdsLocationModel({
      address: 'some-address-id', // Id của địa chỉ
      locationType: 'some-location-type-id', // Id của location type
      adsCategory: 'some-ads-category-id', // Id của ads category
      // Các trường khác cũng có thể được thêm vào nếu cần
    });

    const savedAdsLocation = await validAdsLocation.save();

    // Kiểm tra xem ads location đã được lưu thành công chưa
    expect(savedAdsLocation._id).toBeDefined();
    expect(savedAdsLocation.address).toBe('some-address-id');
    expect(savedAdsLocation.locationType).toBe('some-location-type-id');
    expect(savedAdsLocation.adsCategory).toBe('some-ads-category-id');
    // Kiểm tra trường khác nếu cần
  });

  it('should trigger post middleware to delete related address on deleting an ads location', async () => {
    // Tạo một đối tượng ads location
    const adsLocation = new AdsLocationModel({
      address: 'some-address-id',
      locationType: 'some-location-type-id',
      adsCategory: 'some-ads-category-id',
    });

    // Lưu đối tượng ads location
    const savedAdsLocation = await adsLocation.save();

    // Xoá ads location
    await AdsLocationModel.findByIdAndDelete(savedAdsLocation._id);

    // Kiểm tra xem AddressModel có bị xoá không
    const deletedAddress = await AddressModel.findById('some-address-id');
    expect(deletedAddress).toBeNull();
  });
});
