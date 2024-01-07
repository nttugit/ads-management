// tests/address.test.js

import { setupTestDb } from 'mongoose-testing-library';
import AddressModel from '../path-to-your-address-model-file'; // Thay thế bằng đường dẫn thực tế đến file model của bạn

describe('AddressSchema', () => {
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

  it('should create and save an address successfully', async () => {
    const validAddress = new AddressModel({
      lat: 10.7628318017954,
      long: 106.68235654416593,
      streetLine1: 'Nguyễn Văn Cừ',
      streetLine2: '227',
      ward: 'some-ward-id', // Id của ward
      district: 'some-district-id', // Id của district
      city: 'some-city',
      country: 'some-country',
    });

    const savedAddress = await validAddress.save();

    // Kiểm tra xem address đã được lưu thành công chưa
    expect(savedAddress._id).toBeDefined();
    expect(savedAddress.lat).toBe(10.7628318017954);
    expect(savedAddress.long).toBe(106.68235654416593);
    expect(savedAddress.streetLine1).toBe('Nguyễn Văn Cừ');
    expect(savedAddress.streetLine2).toBe('227');
    expect(savedAddress.ward).toBe('some-ward-id');
    expect(savedAddress.district).toBe('some-district-id');
    expect(savedAddress.city).toBe('some-city');
    expect(savedAddress.country).toBe('some-country');
  });
});
