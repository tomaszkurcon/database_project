const { getFileURL } = require("../services/storageService");

const transformCarImagesToUrl = async (cars) => {
    await Promise.all(cars.map(async (car) => {
        car.images = await Promise.all(car.images.map(image => getFileURL(image)));
    }));
};

module.exports = transformCarImagesToUrl;