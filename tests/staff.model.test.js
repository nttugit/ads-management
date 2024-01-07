// tests/staff.test.js

import { setupTestDb } from 'mongoose-testing-library';
import StaffModel from '../path-to-your-staff-model-file'; // Thay thế bằng đường dẫn thực tế đến file model của bạn

describe('StaffSchema', () => {
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

  it('should create and save a staff member successfully', async () => {
    // Tạo một đối tượng staff member hợp lệ
    const validStaff = new StaffModel({
      username: 'testuser',
      password: 'testpassword',
      fullName: 'Test User',
      dob: new Date('1990-01-01'),
      email: 'testuser@example.com',
      phone: '1234567890',
      role: 'canbo_so',
      assigned: {
        district: 'some-district-id',
        ward: 'some-ward-id',
        appointmentDate: new Date('2023-01-01'),
      },
      status: 1,
    });

    const savedStaff = await validStaff.save();

    // Kiểm tra xem staff member đã được lưu thành công chưa
    expect(savedStaff._id).toBeDefined();
    expect(savedStaff.username).toBe('testuser');
    expect(savedStaff.fullName).toBe('Test User');
    expect(savedStaff.role).toBe('canbo_so');
    expect(savedStaff.status).toBe(1);
  });

  it('should fail when trying to save without required fields', async () => {
    // Tạo một đối tượng staff member thiếu các trường bắt buộc
    const invalidStaff = new StaffModel({
      // Không cung cấp các trường bắt buộc
    });

    // Sử dụng try-catch để kiểm tra lỗi khi lưu một đối tượng không hợp lệ
    let error;
    try {
      await invalidStaff.save();
    } catch (e) {
      error = e;
    }

    // Kiểm tra rằng lỗi đã xảy ra và thông báo lỗi phù hợp
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
