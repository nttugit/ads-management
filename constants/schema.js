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

export { staffSchema, selfUpdateStaffSchema };
