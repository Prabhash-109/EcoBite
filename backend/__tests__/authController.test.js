process.env.JWT_SECRET = "test-secret";

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../config/firebase", () => ({
  verifyFirebaseLogin: jest.fn(),
}));

jest.mock("../config/mailer", () => ({
  sendWelcomeEmail: jest.fn(),
}));

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyFirebaseLogin } = require("../config/firebase");
const { sendWelcomeEmail } = require("../config/mailer");
const {
  registerUser,
  loginUser,
  firebaseSignIn,
} = require("../controllers/authController");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  test("registerUser creates a user and returns a JWT", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 1,
      account_type: "volunteer",
      name: "Test User",
      email: "test@example.com",
      phoneNumber: "1234567890",
    });

    const req = {
      body: {
        account_type: "volunteer",
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phoneNumber: "1234567890",
      },
    };
    const res = mockResponse();

    await registerUser(req, res);

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        account_type: "volunteer",
        name: "Test User",
        email: "test@example.com",
        phoneNumber: "1234567890",
        password: expect.any(String),
      })
    );
    expect(sendWelcomeEmail).toHaveBeenCalledWith(
      "test@example.com",
      "Test User",
      "volunteer"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Registration successful",
        token: expect.any(String),
        email: "test@example.com",
      })
    );
  });

  test("registerUser returns 400 when email already exists", async () => {
    User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });

    const req = {
      body: {
        account_type: "volunteer",
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phoneNumber: "1234567890",
      },
    };
    const res = mockResponse();

    await registerUser(req, res);

    expect(User.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email already registered",
    });
  });

  test("loginUser returns a valid app JWT for password users", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    User.findOne.mockResolvedValue({
      id: 7,
      account_type: "restaurant",
      name: "Green Cafe",
      email: "owner@example.com",
      password: hashedPassword,
      phoneNumber: "9876543210",
    });

    const req = {
      body: {
        email: "owner@example.com",
        password,
      },
    };
    const res = mockResponse();

    await loginUser(req, res);

    const payload = res.json.mock.calls[0][0];
    const decoded = jwt.verify(payload.token, process.env.JWT_SECRET);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(payload).toEqual(
      expect.objectContaining({
        message: "Login successful",
        role: "restaurant",
        account_type: "restaurant",
        email: "owner@example.com",
      })
    );
    expect(decoded).toEqual(
      expect.objectContaining({
        id: 7,
        email: "owner@example.com",
        role: "restaurant",
      })
    );
  });

  test("loginUser blocks Firebase-only users from password login", async () => {
    User.findOne.mockResolvedValue({
      id: 2,
      email: "google@example.com",
      password: null,
    });

    const req = {
      body: {
        email: "google@example.com",
        password: "anything",
      },
    };
    const res = mockResponse();

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Please sign in with Google or GitHub",
    });
  });

  test("firebaseSignIn creates a local user when Google account is new", async () => {
    verifyFirebaseLogin.mockResolvedValue({
      email: "newgoogle@example.com",
      name: "New Google User",
    });
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 10,
      account_type: "ngo",
      name: "New Google User",
      email: "newgoogle@example.com",
      phoneNumber: null,
      password: null,
    });

    const req = {
      body: {
        idToken: "firebase-token",
        account_type: "ngo",
      },
    };
    const res = mockResponse();

    await firebaseSignIn(req, res);

    expect(verifyFirebaseLogin).toHaveBeenCalledWith("firebase-token");
    expect(User.create).toHaveBeenCalledWith({
      name: "New Google User",
      email: "newgoogle@example.com",
      account_type: "ngo",
      phoneNumber: null,
      password: null,
    });
    expect(sendWelcomeEmail).toHaveBeenCalledWith(
      "newgoogle@example.com",
      "New Google User",
      "ngo"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Sign in successful",
        token: expect.any(String),
        account_type: "ngo",
      })
    );
  });
});
