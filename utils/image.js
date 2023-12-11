import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs';
import ImageModel from '../models/image.model.js';
import path from 'path';

const IMAGE_SIZE = {
    WIDTH: 450,
    HEIGHT: 450,
};

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit in this example
});

/**
 * Resize, lưu vào folder 'uploads' và database
 *
 */
export async function resizeAndSaveImages(req, res, next) {
    if (!req.files || req.files.length === 0) {
        // return res.status(400).send('No files uploaded.');
        next();
    } else {
        Promise.all(
            req.files.map((file) => {
                return sharp(file.buffer)
                    .resize({
                        width: IMAGE_SIZE.WIDTH,
                        height: IMAGE_SIZE.HEIGHT,
                    })
                    .toBuffer()
                    .then(async (data) => {
                        // Lưu ảnh vào uploads folder
                        const fileName = uuidv4();
                        const filePath = `./uploads/${fileName}.jpg`; // Lưu ý: đưa về jpg

                        fs.writeFileSync(filePath, data);

                        // Lưu vào database
                        const fileData = {
                            fileName,
                            path: filePath,
                            extension: 'jpg',
                            originalName: file.originalname,
                            originalSize: file.size,
                            originalMimeType: file.mimetype,
                        };
                        const image = await ImageModel.create(fileData);

                        // req.locals.fileNames = fileNames;
                        return image._id;
                    });
            }),
        )
            .then((imageIds) => {
                req.imageIds = imageIds;
                next();
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error processing the images');
            });
    }
}
//
export async function removeImages(paths = []) {
    paths.forEach((filePath) => {
        // Use fs.unlink to remove each file
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting ${filePath}: ${err.message}`);
            } else {
                console.log(`${filePath} has been deleted`);
            }
        });
    });
}
