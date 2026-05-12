jest.mock("../middleware/authMiddleware", () => ({
  verifyToken: jest.fn((req, res, next) => next()),
}));

jest.mock("../models/Food", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../models/FoodRequest", () => ({
  findAll: jest.fn(),
}));

const Food = require("../models/Food");
const foodController = require("../controllers/foodController");

const createFood = foodController.createFood[1];
const claimFood = foodController.claimFood[1];

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("foodController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("createFood adds a new food donation for the logged-in restaurant", async () => {
    const food = {
      id: 1,
      restaurantId: 12,
      foodName: "Rice meals",
      quantity: "20 plates",
      category: "Meals",
      expiryDate: "2026-05-13",
      pickupTime: "6 PM",
      description: "Freshly packed",
    };
    Food.create.mockResolvedValue(food);

    const req = {
      user: { id: 12, account_type: "restaurant" },
      body: {
        foodName: "Rice meals",
        quantity: "20 plates",
        category: "Meals",
        expiryDate: "2026-05-13",
        pickupTime: "6 PM",
        description: "Freshly packed",
      },
    };
    const res = mockResponse();

    await createFood(req, res);

    expect(Food.create).toHaveBeenCalledWith({
      restaurantId: 12,
      foodName: "Rice meals",
      quantity: "20 plates",
      category: "Meals",
      expiryDate: "2026-05-13",
      pickupTime: "6 PM",
      description: "Freshly packed",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Food Added Successfully",
      food,
    });
  });

  test("claimFood marks available food as claimed by the current user", async () => {
    const food = {
      id: 5,
      status: "available",
      update: jest.fn().mockResolvedValue(undefined),
    };
    Food.findByPk.mockResolvedValue(food);

    const req = {
      user: { id: 44, account_type: "volunteer" },
      params: { foodId: "5" },
    };
    const res = mockResponse();

    await claimFood(req, res);

    expect(Food.findByPk).toHaveBeenCalledWith("5");
    expect(food.update).toHaveBeenCalledWith({
      status: "claimed",
      claimedBy: 44,
    });
    expect(res.json).toHaveBeenCalledWith({
      message: "Food claimed successfully",
      food,
    });
  });

  test("claimFood returns 404 when the food item does not exist", async () => {
    Food.findByPk.mockResolvedValue(null);

    const req = {
      user: { id: 44, account_type: "volunteer" },
      params: { foodId: "99" },
    };
    const res = mockResponse();

    await claimFood(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Food not found",
    });
  });
});
