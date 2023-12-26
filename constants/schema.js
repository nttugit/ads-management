// Cán bộ
const staffSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            minLength: 3,
            maxLength: 255,
            pattern: '^[a-zA-Z0-9_]+$',
        },
        password: {
            type: 'string',
            minLength: 3,
            maxLength: 255,
        },
        fullName: {
            type: 'string',
        },
        dob: {
            // pattern dob
            type: 'string',
        },
        email: {
            type: 'string',
        },
        phone: {
            type: 'string',
        },
        role: {
            type: 'string',
        },
        assigned: {
            type: 'object',
        },
    },
    required: ['username', 'password'],
    additionalProperties: false,
};

// Cán bộ tự cập nhật thông tin cá nhân
const selfUpdateStaffSchema = {
    type: 'object',
    properties: {
        password: {
            type: 'string',
            minLength: 3,
            maxLength: 255,
        },
        fullName: {
            type: 'string',
        },
        dob: {
            // pattern dob
            type: 'string',
        },
        email: {
            type: 'string',
        },
        phone: {
            type: 'string',
        },
    },
    additionalProperties: false,
};

// Phường
const wardSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        district: {
            type: 'string',
        },
    },
    // required: ['name'],
    additionalProperties: false,
};

// Quận
const districtSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
    },
    // required: ['name'],
    additionalProperties: false,
};

// Loại báo cáo
const reportTypeSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
    },
    required: ['name'],
    additionalProperties: false,
};

export {
    staffSchema,
    selfUpdateStaffSchema,
    reportTypeSchema,
    wardSchema,
    districtSchema,
};
