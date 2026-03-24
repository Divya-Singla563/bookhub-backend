import * as Services from "../services/index.js";

const addPrescription = async (req, res, next) => {
  try {
    const { fileUrl, publicId } = req.body;

    const result = await Services.addPrescription(req.user._id, { fileUrl, publicId });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getMyPrescriptions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await Services.getMyPrescriptions(
      req.user._id,
      page,
      limit,
      req.query.search
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export { addPrescription, getMyPrescriptions };
