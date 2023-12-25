// Định nghĩa Class cha có các hàm CRUD cho tất cả các model
// projection để mặc định là object, có thể truyền kiểu string

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

    async getById(id, projection = {}, populate = []) {
        try {
            const result = await this.Model.findById(id, projection).populate(
                populate,
            );
            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    async getOne(conditions = {}, projection = {}) {
        try {
            const result = await this.Model.findOne(conditions, projection);
            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    /**
     * @dev Soft delete (chỉ cập nhật trạng thái, không xoá hẳn)
     * @param {*} id
     * @returns Lấy hết không giới hạn
     */
    async getAll(conditions = {}, projection = {}) {
        try {
            const result = await this.Model.find(conditions, projection);
            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    async getList(
        conditions = {},
        projection = {},
        pagination = {
            skip: 0,
            limit: 50,
        },
        populate = [],
    ) {
        const skip = pagination.page * pagination.size - pagination.size;
        try {
            const result = await this.Model.find(conditions, projection, {
                skip,
                limit: pagination.size,
            }).populate(populate);
            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    async create(data = {}) {
        try {
            const newInstance = await this.Model.create(data);
            return newInstance;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    async updateById(id, data) {
        try {
            const result = await this.Model.findOneAndUpdate(
                { _id: id },
                data,
                { new: true },
            );
            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    async updateAndReturn(
        conditions = {},
        data,
        projection = {},
        populate = [],
    ) {
        try {
            const result = await this.Model.findOneAndUpdate(conditions, data, {
                new: true,
                projection,
            })
                .populate(populate)
                .exec();
            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    async updateMany(conditions = {}, data) {
        try {
            const result = await this.Model.updateMany(conditions, data);
            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    /**
     * @dev Soft delete (chỉ cập nhật trạng thái, không xoá hẳn)
     * @param {*} id
     * @returns
     */
    async deleteSoftlyById(id) {
        try {
            const result = await this.Model.findOneAndUpdate(
                { _id: id },
                { status: -1 },
                { new: true },
            );

            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    async deleteById(id) {
        try {
            const result = await this.Model.deleteOne({ _id: id });

            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    async deleteAndReturn(conditions = {}) {
        try {
            const result = await this.Model.findOneAndDelete(conditions);
            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    async deleteMany(conditions = {}) {
        try {
            const result = await this.Model.deleteMany(conditions);
            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }

    // others
    async count(conditions = {}) {
        try {
            const result = await this.Model.countDocuments(conditions);
            return result;
        } catch (error) {
            console.log('!!! MONGODB ERROR:' + error);
        }
    }
}
export default BaseHandler;
