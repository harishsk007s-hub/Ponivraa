import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { isConnectedToMongoDB } from '../config/db.js';
import { memoryStoreInstance } from '../config/memoryStore.js';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    name: {
      type: String,
      default: 'Ponivraa Admin',
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const MongooseAdmin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

// In-Memory Model Wrapper
class MemoryAdminModel {
  static async findOne(filter = {}) {
    if (filter.email) {
      return (
        memoryStoreInstance.admins.find(
          (a) => a.email.toLowerCase() === filter.email.toLowerCase()
        ) || null
      );
    }
    return memoryStoreInstance.admins[0] || null;
  }

  static findById(id) {
    const admin = memoryStoreInstance.admins.find((a) => String(a._id) === String(id));
    const result = admin
      ? {
          _id: admin._id,
          email: admin.email,
          name: admin.name,
          createdAt: admin.createdAt,
        }
      : null;

    const queryObj = {
      select: function () {
        return queryObj;
      },
      then: function (resolve, reject) {
        return Promise.resolve(result).then(resolve, reject);
      },
    };
    return queryObj;
  }

  constructor(data) {
    this._id = memoryStoreInstance.generateId();
    this.email = data.email.toLowerCase();
    this.password = data.password;
    this.name = data.name || 'Ponivraa Admin';
    this.createdAt = new Date();
  }

  async save() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.matchPassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };
    memoryStoreInstance.admins.push(this);
    return this;
  }
}

const Admin = new Proxy(MongooseAdmin, {
  get(target, prop) {
    if (isConnectedToMongoDB) {
      return target[prop];
    }
    return MemoryAdminModel[prop] || target[prop];
  },
  construct(target, args) {
    if (isConnectedToMongoDB) {
      return new target(...args);
    }
    return new MemoryAdminModel(...args);
  },
});

export default Admin;
