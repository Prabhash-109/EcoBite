jest.mock("../middleware/authMiddleware", () => ({
  verifyToken: jest.fn((req, res, next) => next()),
  requireRole: jest.fn(() => (req, res, next) => next()),
}));

jest.mock("../models/Food", () => ({
  findByPk: jest.fn(),
  update: jest.fn(),
}));

jest.mock("../models/User", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../models/FoodRequest", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
}));

jest.mock("../config/mailer", () => ({
  sendRequestAcceptedEmail: jest.fn(),
  sendDeliveryCompletedEmail: jest.fn(),
}));

const Food = require("../models/Food");
const User = require("../models/User");
const FoodRequest = require("../models/FoodRequest");
const { sendRequestAcceptedEmail } = require("../config/mailer");
const requestController = require("../controllers/requestController");

const createRequest = requestController.createRequest[2];
const acceptRequest = requestController.acceptRequest[2];
const assignVolunteer = requestController.assignVolunteer[2];

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("requestController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("createRequest lets an NGO request an available food item", async () => {
    Food.findByPk.mockResolvedValue({
      id: 8,
      restaurantId: 3,
      status: "available",
      claimedBy: null,
    });
    FoodRequest.findOne.mockResolvedValue(null);
    FoodRequest.create.mockResolvedValue({
      id: 15,
      foodId: 8,
      ngoId: 22,
      restaurantId: 3,
      status: "pending",
    });

    const req = {
      user: { id: 22, account_type: "ngo" },
      body: { foodId: 8 },
    };
    const res = mockResponse();

    await createRequest(req, res);

    expect(FoodRequest.create).toHaveBeenCalledWith({
      foodId: 8,
      ngoId: 22,
      restaurantId: 3,
      status: "pending",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 15,
      foodId: 8,
      ngoId: 22,
      restaurantId: 3,
      status: "pending",
    });
  });

  test("acceptRequest accepts a request and claims the food for that NGO", async () => {
    const foodRequest = {
      id: 15,
      foodId: 8,
      ngoId: 22,
      restaurantId: 3,
      status: "pending",
      update: jest.fn().mockResolvedValue(undefined),
    };
    const food = {
      id: 8,
      status: "available",
      claimedBy: null,
      foodName: "Rice meals",
      update: jest.fn().mockResolvedValue(undefined),
    };

    FoodRequest.findByPk.mockResolvedValue(foodRequest);
    Food.findByPk.mockResolvedValue(food);
    FoodRequest.update.mockResolvedValue([1]);
    User.findByPk
      .mockResolvedValueOnce({
        id: 22,
        email: "ngo@example.com",
        name: "Helping Hands",
      })
      .mockResolvedValueOnce({
        id: 3,
        email: "restaurant@example.com",
        name: "Green Cafe",
      });

    const req = {
      user: { id: 3, account_type: "restaurant" },
      params: { requestId: "15" },
    };
    const res = mockResponse();

    await acceptRequest(req, res);

    expect(foodRequest.update).toHaveBeenCalledWith({ status: "accepted" });
    expect(food.update).toHaveBeenCalledWith({
      status: "claimed",
      claimedBy: 22,
    });
    expect(sendRequestAcceptedEmail).toHaveBeenCalledWith(
      "ngo@example.com",
      "Helping Hands",
      "Green Cafe",
      "Rice meals"
    );
    expect(res.json).toHaveBeenCalledWith(foodRequest);
  });

  test("assignVolunteer assigns a volunteer to an accepted request", async () => {
    const foodRequest = {
      id: 15,
      ngoId: 22,
      status: "accepted",
      update: jest.fn().mockResolvedValue(undefined),
    };
    FoodRequest.findByPk.mockResolvedValue(foodRequest);
    User.findByPk.mockResolvedValue({
      id: 50,
      name: "Asha",
      account_type: "volunteer",
    });

    const req = {
      user: { id: 22, account_type: "ngo" },
      params: { requestId: "15" },
      body: { volunteerId: 50 },
    };
    const res = mockResponse();

    await assignVolunteer(req, res);

    expect(foodRequest.update).toHaveBeenCalledWith({
      volunteerId: 50,
      status: "assigned",
      assignedAt: expect.any(Date),
    });
    expect(res.json).toHaveBeenCalledWith({
      message: "Volunteer Asha has been assigned successfully",
      request: foodRequest,
    });
  });
});
