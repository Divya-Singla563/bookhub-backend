import * as Modals from "../modals/index.js";

const
  addPrescription = async (userId, payload) => {
    try {
      const { fileUrl, publicId } = payload;

      if (!fileUrl) {
        throw new Error("Please provide fileUrl");
      }

      const prescription = await Modals.Prescription.create({
        user: userId,
        fileUrl,
        publicId,
      });

      return {
        message: "Prescription added successfully",
        data: prescription,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

const getMyPrescriptions = async (userId, page, limit, search) => {
  try {
    const query = { user: userId };

    const prescriptions = await Modals.Prescription.find(query)
      .populate({ path: "user", select: "email name" })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const totalPrescriptions = await Modals.Prescription.countDocuments(query);

    return {
      message: "Prescriptions fetched successfully",
      data: prescriptions,
      totalPrescriptions,
      totalPages: Math.ceil(totalPrescriptions / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { addPrescription, getMyPrescriptions };
