// Định nghĩa Class cha có các hàm CRUD cho tất cả các model

/**
 * @typedef {import('mongoose').Document} BaseModelDocument
 * @typedef {import('mongoose').Model<BaseModelDocument>} BaseModelModel
 */

class BaseHandler {
    /**
     * @param {BaseModelModel} model
     */
    constructor(model) {
        if (new.target === BaseHandler) {
            throw new TypeError('Cannot instantiate abstract class');
        }
        this.Model = model;
    }

    async getById(id, projection = {}) {
        // projection is object or string
        return this.Model.findById(id, projection);
    }

    async getOne(conditions = {}, projection = {}) {
        return this.Model.findOne(conditions, projection);
    }

    /**
     * @dev Soft delete (chỉ cập nhật trạng thái, không xoá hẳn)
     * @param {*} id
     * @returns Lấy hết không giới hạn
     */
    async getAll(conditions = {}, projection = {}) {
        return this.Model.find(conditions, projection);
    }

    async getList(
        conditions = {},
        projection = {},
        pagination = {
            skip: 0,
            limit: 50,
        },
    ) {
        const skip = pagination.page * pagination.size - pagination.size;
        return this.Model.find(conditions, projection, {
            skip,
            limit: pagination.size,
        });
    }

    async create(data = {}) {
        return this.Model.create(data);
    }

    /**
     * @dev Soft delete (chỉ cập nhật trạng thái, không xoá hẳn)
     * @param {*} id
     * @returns Cập nhật và trả về dữ liệu mới
     */
    async updateById(id, data) {
        return this.Model.findOneAndUpdate({ _id: id }, data, { new: true });
    }

    /**
     * @dev Soft delete (chỉ cập nhật trạng thái, không xoá hẳn)
     * @param {*} id
     * @returns
     */
    async deleteSoftlyById(id) {
        return this.Model.findOneAndUpdate(
            { _id: id },
            { status: -1 },
            { new: true },
        );
    }

    async deleteById(id) {
        return this.Model.deleteOne({ _id: id });
    }

    // others
    async count(conditions = {}) {
        return this.Model.countDocuments(conditions);
    }
}

export default BaseHandler;
