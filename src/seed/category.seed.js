import * as Modals from "../modals/index.js";

const categories = [
  { name: "Fiction", description: "Fiction books" },
  { name: "Non-Fiction", description: "Non fiction books" },
  { name: "Programming", description: "Coding related books" },
  { name: "Science", description: "Science books" },
  { name: "History", description: "Historical books" },
];

const seedCategories = async () => {
  try {
    const existing = await Modals.Category.countDocuments();

    if (existing > 0) {
      console.log("Categories already added");
      return;
    }

    await Modals.Category.insertMany(categories);
    console.log("categories added");
  } catch (error) {
    console.log(error);
  }
};

export default seedCategories;
