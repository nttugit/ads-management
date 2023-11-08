import UserModel from '../models/user.model.js';

const handler = {};
handler.getList = async (req, res) => {
    const user = await UserModel.find();
    return res.json(user);
};

export default handler;
