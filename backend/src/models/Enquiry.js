import mongoose from 'mongoose';
import { isConnectedToMongoDB } from '../config/db.js';
import { memoryStoreInstance } from '../config/memoryStore.js';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseEnquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);

// In-Memory Model Wrapper
class MemoryEnquiryModel {
  static find(filter = {}) {
    let list = [...memoryStoreInstance.enquiries];

    if (filter.isRead !== undefined) {
      list = list.filter((e) => e.isRead === filter.isRead);
    }

    const queryObj = {
      sort: function () {
        list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return queryObj;
      },
      limit: function (count) {
        list = list.slice(0, count);
        return queryObj;
      },
      then: function (resolve, reject) {
        return Promise.resolve(list).then(resolve, reject);
      },
    };
    return queryObj;
  }

  static async findById(id) {
    const item = memoryStoreInstance.enquiries.find((e) => String(e._id) === String(id));
    if (!item) return null;
    return {
      ...item,
      save: async function () {
        const idx = memoryStoreInstance.enquiries.findIndex((e) => String(e._id) === String(id));
        if (idx !== -1) {
          memoryStoreInstance.enquiries[idx] = { ...this };
        }
        return this;
      },
    };
  }

  static async findByIdAndDelete(id) {
    const initialLen = memoryStoreInstance.enquiries.length;
    memoryStoreInstance.enquiries = memoryStoreInstance.enquiries.filter(
      (e) => String(e._id) !== String(id)
    );
    return memoryStoreInstance.enquiries.length < initialLen;
  }

  static async countDocuments(filter = {}) {
    let list = [...memoryStoreInstance.enquiries];
    if (filter.isRead !== undefined) {
      list = list.filter((e) => e.isRead === filter.isRead);
    }
    return list.length;
  }

  static async create(data) {
    const enquiryInstance = new MemoryEnquiryModel(data);
    return await enquiryInstance.save();
  }

  constructor(data) {
    this._id = memoryStoreInstance.generateId();
    this.name = data.name;
    this.phone = data.phone;
    this.email = data.email;
    this.message = data.message;
    this.isRead = data.isRead !== undefined ? data.isRead : false;
    this.createdAt = new Date();
  }

  async save() {
    const record = { ...this };
    memoryStoreInstance.enquiries.push(record);
    return record;
  }
}

const Enquiry = new Proxy(MongooseEnquiry, {
  get(target, prop) {
    if (isConnectedToMongoDB) {
      return target[prop];
    }
    return MemoryEnquiryModel[prop] || target[prop];
  },
  construct(target, args) {
    if (isConnectedToMongoDB) {
      return new target(...args);
    }
    return new MemoryEnquiryModel(...args);
  },
});

export default Enquiry;
