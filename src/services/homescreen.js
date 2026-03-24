import * as Modals from "../modals/index.js";

const getHomescreenData = async () => {
  try {
    // Adding static banner data as per the shared image for now
    const firstBanner = {
      title: "Get the Best Medical Service",
      description: "Rem illum facere quo corporis Quis in saepe itaque ut quos pariatur. Qui numquam rerum hic repudiandae rerum id amet tempore nam molestias omnis qui earum voluptatem!",
      image: "", // Add full URL later if needed
      buttonText: "",
      link: "",
      type: "first",
      isActive: true,
    };

    const secondBanner = {
      title: "UPTO 80 % offer",
      description: "On Health Products",
      image: "", // Add full URL later if needed
      buttonText: "SHOP NOW",
      link: "",
      type: "second",
      isActive: true,
    };

    return {
      message: "Homescreen data fetched successfully",
      data: {
        firstBanner,
        secondBanner,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { getHomescreenData };
