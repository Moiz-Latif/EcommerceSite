import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import e, { Router } from "express";
import bcrypt from "bcrypt";
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4, v4 } from 'uuid';
import Stripe from "stripe";
import { Cookie } from "express-session";
import { verifyAdminToken } from "../middlewares/authMiddleware";
interface CustomRequest extends Request {
  files?: Express.Multer.File[]; // This ensures `files` is recognized
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined");
}
const stripe = new Stripe(stripeSecretKey);
dotenv.config();

export const router = Router();
export const prisma = new PrismaClient();

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    //@ts-ignore
    folder: 'devices', // The folder in Cloudinary where files will be stored
    allowed_formats: ['jpeg', 'png', 'jpg'], // Allowed file formats
  },
});

const upload = multer({ storage });



async function main() {
  //the default route
  router.get('/', (req, res) => {
    res.send('Im a fucking genius I am');
  })
  // Status route to check server health
  router.get('/status', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
  });


  router.get('/AdminDashboard/getData', async (req, res) => {
    try {
      const Users = await prisma.user.findMany();
      const Devices = await prisma.user.findMany();
      const Orders = await prisma.order.findMany();
      const totalPrice = Orders.reduce((sum, item) => sum + item.totalPrice, 0);
      if (Users && Devices && Orders && totalPrice) {
        res.status(200).json({ Users, Devices, Orders, totalPrice });
      }
    } catch (error) {

    }
  })

  router.get('/AdminDashboard/GetDevices', async (req, res) => {
    try {
      const devices = await prisma.device.findMany();
      const categories = await prisma.category.findMany();
      const fixedDevices = devices.map(device => ({
        ...device,
        SerialNumber: device.SerialNumber.toString()
      }));
      res.status(200).json({ fixedDevices, categories });
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ error: 'An error occurred while fetching devices' });
    }
  });

  router.get('/UserDashboard/:UserId/Wishlist/Get', async (req, res) => {
    const { UserId } = req.params;
    const User = await prisma.user.findUnique({
      where: { id: UserId }
    });

    if (User) {
      res.status(200).json({ User: User.WishListDevices })
    }
  });

  router.get('/UserDashboard/:UserId/Cart/Set', async (req, res) => {
    const { UserId } = req.params;
    const Cart = await prisma.cart.findMany({
      where: { userId: UserId }
    })
    console.log({ CurrentCart: Cart });
    if (Cart) {
      res.status(200).json({ Cart });
    }
  });

  router.get('/AdminDashboard/GetDevice/:id', async (req, res) => {
    try {
      const devices = await prisma.device.findUnique({
        where: { DeviceId: req.params.id }
      });

      const categories = await prisma.category.findUnique({
        where: {
          CategoryId: devices?.categoryid
        }
      });

      const fixedDevices = {
        ...devices,
        SerialNumber: devices?.SerialNumber.toString()
      };

      res.status(200).json({ fixedDevices, categories });
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ error: 'An error occurred while fetching devices' });
    }
  });

  router.get('/UserDashboard/:UserId/Device/:DeviceId/Get', async (req, res) => {
    const { UserId, DeviceId } = req.params;
    const User = await prisma.user.findUnique({
      where: { id: UserId }
    });
    if (User) {
      const getReview = await prisma.review.findUnique({
        where: {
          userId_deviceId: {
            userId: UserId,       // Replace with the actual userId
            deviceId: DeviceId,   // Replace with the actual deviceId
          },
        },
      });
      if (getReview) {
        res.status(200).json({ getReview, UserImg: User.img, UserUsername: User.username });
      } else {
        res.status(200).json({ UserImg: User.img, UserUsername: User.username })
      }
    }

  });

  router.post('/AdminLogin', async (req, res) => {
    const { password } = req.body;
    if (password != 'iamadmin') {
      res.status(401).json({ message: "Invalid Password" });
    };

    const token = jwt.sign("Thisisthepayloadfornow", "Thisisthejwtsecretfornow");

    res.cookie("AdminToken", token, {
      httpOnly: true,  // Prevents JS access
      sameSite: "strict",  // Prevents CSRF attacks
      secure: process.env.NODE_ENV === "production", // Ensure same attributes as when setting the cookie
      maxAge: 60 * 60 * 1000, // 1 hour expiration
    });

    res.json({ message: "Login successful" });
  });

  router.get('/AdminLogout', async (req, res) => {
    res.clearCookie('AdminToken');
    res.status(200).json({ message: "Logged out successfully" });
  })

  router.post('/UserLogin', async (req, res) => {
    const { username, password } = req.body;
    const checkUser = await prisma.user.findUnique({
      where: {
        username: username
      }
    });
    console.log(checkUser);
    // Create JWT payload excluding sensitive information
    const payload = {
      id: checkUser?.id,
      username: checkUser?.username
    };

    if (checkUser) {
      const check = await bcrypt.compare(password, checkUser.password);
      if (check) {
        // Sign token
        const token = jwt.sign(payload, "SECRET_KEY", { expiresIn: '1h' });
        // Set cookie with token
        res.cookie('authToken', token);
        res.json({ message: 'User has logged in successfully', user: { id: checkUser.id, username: checkUser.username } });
        console.log('User has logged in successfully');
      }
    }
  })

  router.post('/Signup', async (req, res) => {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        identifier: email,
        authType: 'EMAIL',
        img: ""
      }
    })
    res.json(user);
  })
  // Profile route to mimic a protected resource
  router.get('/profile', (req, res) => {
    res.send('This is a user profile page. Authentication required.');
  });

  router.get('/UserDashboard/:id', async (req, res) => {
    const { id } = req.params;
    const User = await prisma.user.findUnique({
      where: {
        id: id
      }
    });
    if (User) {
      res.status(200).json({ UserInfo: User })
    } else { 
      res.status(400).json({message:"No user found"})
    }
  })

  router.get('/AdminDashboard/Users',async (req, res) => {
    const AllUsers = await prisma.user.findMany();
    if (AllUsers) {
      res.json(AllUsers);
    }
  });

  router.get('/AdminDashboard/getCategory', async (req, res) => {
    const allCategories = await prisma.category.findMany();
    if (allCategories) {
      res.json(allCategories);
    }
  })


  router.post('/AdminDashboard/AddDevice', upload.array('images'), async (req, res) => {
    try {
      console.log('hello');
      const {
        name,
        model,
        brand,
        quantity,
        category,
        price,
        description,
        condition,
        serialNumber,
        specifications
      } = req.body;
      // Handle file uploads to Cloudinary
      const files = req.files; // Now TypeScript recognizes `files`
      console.log(req.body);
      console.log(req.files)
      const imageUrls: string[] = [];
      if (files && Array.isArray(files)) {
        for (const file of files) {
          imageUrls.push(file.path); // Cloudinary provides the file's URL
        }
      }

      // The rest of your logic remains the same
      const parsedSpecifications = JSON.parse(specifications);
      const parsedQuantity = parseInt(quantity, 10);
      const parsedPrice = parseFloat(price);


      const newDevice = await prisma.device.create({
        data: {
          DeviceName: name,
          Model: model,
          Brand: brand,
          Quantity: parsedQuantity,
          Category: {
            connect: { CategoryName: category }
          },
          Price: parsedPrice,
          Description: description,
          Condition: condition,
          SerialNumber: serialNumber,
          Specifications: parsedSpecifications,
          Images: imageUrls,
          status: "PENDING"
        }
      });
      console.log(newDevice);
      const device = {
        ...newDevice,
        SerialNumber: newDevice.SerialNumber.toString(),
      };

      res.status(200).json({ message: 'Device added successfully', device });
    } catch (error) {
      console.error('Error storing device:', error);
      res.status(500).json({ error: 'An error occurred while adding the device.' });
    }
  });

  router.post('/AdminDashboard/UpdateDevice/:id', async (req, res) => {
    const { id } = req.params;
    const {
      DeviceName,
      category,
      Quantity,
      Price,
      Description,
      Brand,
      Specifications,
      Images
    } = req.body;


    const getDevice = await prisma.device.update({
      where: { DeviceId: id },
      data: {
        DeviceName,
        Quantity,
        Price,
        Description,
        Brand,
        Specifications,
        Images,
        Category: {
          connect: { CategoryName: category }
        },
      }
    })
    if (getDevice) {
      res.json({ message: "Device has been updated sucessfully" });
    }
  })


  router.post('/AdminDashboard/AddCategory', upload.single('images'), async (req, res) => {
    const { CategoryName, Description } = req.body;
    const Image = req.file?.path;
    const AddCategory = await prisma.category.create({
      data: {
        CategoryName: CategoryName,
        Description: Description,
        //@ts-ignore
        Image: Image

      }
    })
    if (AddCategory) {
      res.status(200).json(AddCategory);
    }
  })

  // Route to delete a category
  router.post('/AdminDashboard/DeleteCategory/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedCategory = await prisma.category.delete({
        where: { CategoryId: id },
      });
      res.status(200).json({ message: "Deleted category successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category." });
    }
  });

  router.post('/AdminDashboard/DeleteDevice/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedDevice = await prisma.device.delete({
        where: { DeviceId: id },
      });
      res.status(200).json(deletedDevice);
    } catch (error) {
      console.error("Error deleting device:", error);
      res.status(500).json({ error: "Failed to delete device." });
    }
  });


  router.post(
    "/UserDashboard/:UserId/WishList/Add",
    async (req, res) => {
      try {
        const { UserId } = req.params;
        const { productId } = req.body;

        const checkuser = await prisma.user.findUnique({ where: { id: UserId } });

        if (checkuser?.WishListDevices.includes(productId)) {
          res.status(200).json({ message: "Device already exists in the wishlist." });
        } else {
          const user = await prisma.user.update({
            where: { id: UserId },
            data: {
              WishListDevices: { push: productId },
            },
          });
          res.status(200).json({ message: "Device added to wishlist", user });
        }
      } catch (error) {
        console.error("Error adding device to wishlist:", error);
        res.status(500).json({ error: "Failed to add device to wishlist." });
      }
    }
  );

  router.post(
    "/UserDashboard/:UserId/WishList/Delete",
    async (req: Request<{ UserId: string }>, res: Response): Promise<void> => {
      try {
        const { UserId } = req.params;
        const { productId } = req.body;

        const device = await prisma.device.findUnique({ where: { DeviceId: productId } });
        const checkuser = await prisma.user.findUnique({ where: { id: UserId } });

        if (!device) {
          res.status(404).json({ message: "Device not found in the database." });
          return;
        }
        if (!checkuser) {
          res.status(404).json({ message: "User not found in the database." });
          return;
        }

        if (checkuser.WishListDevices.includes(productId)) {
          const newWishlist = checkuser.WishListDevices.filter((item) => item !== productId);
          const user = await prisma.user.update({
            where: { id: UserId },
            data: {
              WishListDevices: newWishlist,
            },
          });
          res.status(200).json({ message: "Device removed from wishlist", user });
        } else {
          res.status(400).json({ message: "Device not found in the user's wishlist." });
        }
      } catch (error) {
        console.error("Error removing device from wishlist:", error);
        res.status(500).json({ error: "Failed to remove device from wishlist." });
      }
    }
  );




  router.post("/UserDashboard/:UserId/Cart/Add", async (req, res) => {
    try {
      const { UserId } = req.params;
      const { DeviceId } = req.body;


      // Check if the user exists
      const user = await prisma.user.findUnique({ where: { id: UserId }, include: { CartDevices: true } });
      if (!user) {
        res.status(404).json({ error: "User not found." }); return
      }
      // Check if the device is already in the cart
      const existingCartItem = await prisma.cart.findUnique({
        where: { DeviceId_userId: {
          DeviceId: DeviceId,
          userId:UserId
        } },
      });
      let updatedCartItem;
      if (existingCartItem) {
        // If the device exists in the cart, increment the quantity
        const updatedCartItem = await prisma.cart.update({
          where: { DeviceId_userId: {
            DeviceId:existingCartItem.DeviceId,
            userId:existingCartItem.userId
          } },
          data: {
            Quantity: existingCartItem.Quantity + 1,
          }
        })
        res.status(200).json(updatedCartItem); return;
      } else {
        // If the device is not in the cart, create a new entry
        updatedCartItem = await prisma.cart.create({
          data: {
            DeviceId: DeviceId,
            Quantity: 1,
            userId: UserId,
          },
        });
        res.status(200).json(updatedCartItem);
      }



    } catch (error) {
      console.error("Error adding device to cart:", error);
      res.status(500).json({ error: "Failed to add device to cart." }); return
    }
  });



  router.post('/UserDashboard/:UserId/Cart/Remove', async (req: Request<{ UserId: string }>, res: Response): Promise<void> => {
    try {
      const { UserId } = req.params;
      const { DeviceId } = req.body;
      // Check if user exists and include CartDevices
      const checkUser = await prisma.user.findUnique({
        where: { id: UserId },
        include: { CartDevices: true },
      });

      // Find the device in the user's cart
      const deviceInCart = checkUser?.CartDevices.find((item) => item.DeviceId === DeviceId);
      if (deviceInCart) {
        // Remove the device from the cart
        await prisma.cart.delete({
          where: { DeviceId_userId: {
            DeviceId:DeviceId,
            userId:UserId
          } },
        });
        const newCart = (await prisma.cart.findMany());
        res.status(200).json({ message: "Device removed from the cart.", newCart });
      }


    } catch (error) {
      console.error("Error removing device from cart:", error);
      res.status(500).json({ error: "Failed to remove device from cart." });
    }
  });

  router.post('/UserDashboard/:UserId/Cart/Update', async (req, res) => {
    const { UserId } = req.params;
    const { DeviceId, Quantity } = req.body;

    const checkUser = await prisma.user.findUnique({
      where: { id: UserId }
    });
    if (checkUser) {
      await prisma.cart.update({
        where: { DeviceId_userId: {
          DeviceId:DeviceId,
          userId:UserId
        } },
        data: {
          Quantity: Quantity
        }
      });
      const updatedCart = await prisma.cart.findMany();
      console.log(updatedCart);
      res.status(200).json(updatedCart);
    };

  });

  router.post('/UserDashboard/:UserId/Device/:DeviceId/Create', async (req, res) => {
    const { UserId, DeviceId } = req.params;
    const { rating, review, date } = req.body;
    const checkReview = await prisma.review.findUnique({
      where: {
        userId_deviceId: {
          userId: UserId,
          deviceId: DeviceId
        }
      }
    });
    if (checkReview) {

      const updateReview = await prisma.review.update({
        where: {
          userId_deviceId: {
            userId: UserId,
            deviceId: DeviceId
          }
        },
        data: {
          rating: rating,
          description: review,
        }
      });

      res.status(200).json(updateReview);
    } else {
      const Createreview = await prisma.review.create({
        data: {
          rating: rating,
          description: review,
          user: { connect: { id: UserId } },
          device: { connect: { DeviceId: DeviceId } }
        }
      });
      if (Createreview) {
        console.log(Createreview);
        res.status(200).json(Createreview);
      } else {
        res.status(500);
      }
    }

  });

  router.post('/UserDashboard/:UserId/Cart/Clear', async (req, res) => {
    const { UserId } = req.params;
    try {
      const Cart = await prisma.cart.deleteMany({
        where: { userId: UserId }
      });
      res.status(200).json({ message: "Cart" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ error: "Failed to clear cart." });
    }

  })

  router.post('/UserDashboard/:UserId/PlaceOrder', async (req, res) => {
    const { UserId } = req.params;
    const { formData, cart, totalPrice } = req.body;
    const { address, city, country, zipCode } = formData;
    const itempotencyKey = uuidv4();

    try {
      const customer = await stripe.customers.create({
        email: formData.email,
        name: formData.name,
        address: {
          line1: address,
          city: city,
          country: country,
          postal_code: zipCode

        }
      })
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), //convert to cents
        currency: 'usd',
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true
        },
        confirm: true //automatically confirm the payments

      })
      if (paymentIntent.status !== 'succeeded') {
        res.status(400).json({ message: 'Payment failed' });
        return;
      }
      // Create the order
      const order = await prisma.order.create({
        data: {
          userId: UserId,
          totalPrice: totalPrice,
          address: address,
          city: city,
          country: country,
          zipCode: zipCode,
          status: "CONFIRMED",
        },
      });

      // Create order items and connect them to the order
      const orderItems = cart.map((item: any) => ({
        orderId: order.OrderId,
        deviceId: item.DeviceId,
        quantity: item.Quantity,
      }));

      await prisma.orderItem.createMany({
        data: orderItems,
      });


      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
  });
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


