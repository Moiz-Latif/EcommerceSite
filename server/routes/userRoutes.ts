import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Express, Router } from "express";
import bcrypt from "bcrypt";
import { Request } from 'express';
import jwt from "jsonwebtoken";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { connect } from "http2";


interface CustomRequest extends Request {
  files?: Express.Multer.File[]; // This ensures `files` is recognized
}

// Load environment variables from .env
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



  router.post('/AdminLogin', CheckToken, async (req, res) => {
    if (req.body) {
      console.log('Received data from frontend successfully')
    }
    const JWT_KEY = process.env.JWT_KEY as string;
    const payload = {
      name: 'Muhammad Moiz Latif',
      password: "iamadmin"
    }
    const JWTtoken = jwt.sign(payload, "JWT_KEY", { expiresIn: '1h' });
    res.cookie("Admintoken", JWTtoken, { httpOnly: true })
    res.json('The backend is working as well');
  });


  router.post('/UserLogin', async (req, res) => {
    const { username, password } = req.body;
    const checkUser = await prisma.user.findUnique({
      where: {
        username: username
      }
    });
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
    console.log(User);
    if (User) {
      res.json({ UserInfo: User })
    }
  })

  router.get('/AdminDashboard/Users', async (req, res) => {
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

      let categoryCheck = await prisma.category.findUnique({
        where: { CategoryName: category }
      });

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

      const device = {
        ...newDevice,
        SerialNumber: newDevice.SerialNumber.toString(),
      };

      console.log(device);

      res.status(201).json({ message: 'Device added successfully', device });
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
    const { CategoryName , Description } = req.body;
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
      res.status(200).json({message : "Deleted category successfully"});
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




  async function CheckToken(req: any, res: any, next: any) {
    try {
      // Retrieve the token from cookies
      const token = req.cookies.Admintoken;

      if (!token) {
        return res.status(401).json({ error: 'No token provided. Please log in.' });
      }

      // Verify the token
      const JWT_KEY = process.env.JWT_KEY as string;
      const decoded = jwt.verify(token, JWT_KEY);

      // Attach decoded information to the request for further use
      req.admin = decoded;

      // Call the next middleware or route handler
      next();
    } catch (error) {
      console.error("Error validating token:", error);
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
  }


}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


