import * as Services from "../services/index.js";

const getHomescreenData = async (req, res, next) => {
  try {
    const result = await Services.getHomescreenData();

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export { getHomescreenData };
