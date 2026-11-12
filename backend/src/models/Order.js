import mongoose from 'mongoose';
import { isConnectedToMongoDB } from '../config/db.js';
import { memoryStoreInstance } from '../config/memoryStore.js';

const orderedProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    selectedVariant: {
      type: String,
      required: false,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },
    products: {
      type: [orderedProductSchema],
      required: [true, 'Order must contain at least one product'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Order must contain at least one product',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'PENDING'],
      default: 'PENDING',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Bank Transfer'],
      default: 'UPI',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending Payment', 'Payment Verification', 'Paid'],
      default: 'Pending Payment',
      index: true,
    },
    transactionId: {
      type: String,
      trim: true,
      default: '',
    },
    paymentVerificationNotes: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseOrder = mongoose.models.Order || mongoose.model('Order', orderSchema);

// In-Memory Model Wrapper
class MemoryOrderModel {
  static find(filter = {}) {
    let list = [...memoryStoreInstance.orders];

    if (filter.status) {
      if (filter.status.$in) {
        list = list.filter((o) => filter.status.$in.includes(o.status));
      } else {
        list = list.filter((o) => o.status === filter.status);
      }
    }

    if (filter.orderId) {
      if (filter.orderId instanceof RegExp) {
        list = list.filter((o) => filter.orderId.test(o.orderId));
      } else {
        list = list.filter((o) => String(o.orderId).toLowerCase() === String(filter.orderId).toLowerCase());
      }
    }

    if (filter.$or) {
      list = list.filter((o) => {
        return filter.$or.some((clause) => {
          if (clause.orderId) {
            if (clause.orderId instanceof RegExp) {
              return clause.orderId.test(o.orderId);
            }
            if (clause.orderId.$regex instanceof RegExp) {
              return clause.orderId.$regex.test(o.orderId);
            }
            if (clause.orderId.$regex) {
              return new RegExp(clause.orderId.$regex, clause.orderId.$options || 'i').test(o.orderId);
            }
            return String(o.orderId).toLowerCase() === String(clause.orderId).toLowerCase();
          }
          if (clause._id) {
            return String(o._id) === String(clause._id);
          }
          if (clause.customerName) {
            if (clause.customerName instanceof RegExp) {
              return clause.customerName.test(o.customerName);
            }
            if (clause.customerName.$regex) {
              return new RegExp(clause.customerName.$regex, clause.customerName.$options || 'i').test(o.customerName);
            }
            return String(o.customerName).toLowerCase().includes(String(clause.customerName).toLowerCase());
          }
          if (clause.phone) {
            if (clause.phone instanceof RegExp) {
              return clause.phone.test(o.phone);
            }
            if (clause.phone.$regex) {
              return new RegExp(clause.phone.$regex, clause.phone.$options || 'i').test(o.phone);
            }
            return String(o.phone).includes(String(clause.phone));
          }
          return false;
        });
      });
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
        const wrappedList = list.map((item) => ({
          ...item,
          save: async function () {
            const idx = memoryStoreInstance.orders.findIndex((o) => String(o._id) === String(item._id));
            if (idx !== -1) {
              memoryStoreInstance.orders[idx] = { ...this };
            }
            return this;
          },
        }));
        return Promise.resolve(wrappedList).then(resolve, reject);
      },
    };
    return queryObj;
  }

  static async findOne(filter = {}) {
    const list = await MemoryOrderModel.find(filter);
    return list && list.length > 0 ? list[0] : null;
  }

  static async findById(id) {
    const item = memoryStoreInstance.orders.find((o) => String(o._id) === String(id));
    if (!item) return null;
    return {
      ...item,
      save: async function () {
        const idx = memoryStoreInstance.orders.findIndex((o) => String(o._id) === String(id));
        if (idx !== -1) {
          memoryStoreInstance.orders[idx] = { ...this };
        }
        return this;
      },
    };
  }

  static async findByIdAndDelete(id) {
    const initialLen = memoryStoreInstance.orders.length;
    memoryStoreInstance.orders = memoryStoreInstance.orders.filter(
      (o) => String(o._id) !== String(id)
    );
    return memoryStoreInstance.orders.length < initialLen;
  }

  static async countDocuments(filter = {}) {
    let list = [...memoryStoreInstance.orders];
    if (filter.status) {
      if (filter.status.$in) {
        list = list.filter((o) => filter.status.$in.includes(o.status));
      } else {
        list = list.filter((o) => o.status === filter.status);
      }
    }
    return list.length;
  }

  static async aggregate(pipeline = []) {
    let list = [...memoryStoreInstance.orders].filter((o) => o.status !== 'Cancelled');
    const total = list.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return [{ _id: null, total }];
  }

  static async create(data) {
    const orderInstance = new MemoryOrderModel(data);
    return await orderInstance.save();
  }

  constructor(data) {
    this._id = memoryStoreInstance.generateId();
    this.orderId = data.orderId;
    this.customerName = data.customerName;
    this.phone = data.phone;
    this.email = data.email || '';
    this.address = data.address;
    this.pincode = data.pincode;
    this.products = data.products || [];
    this.totalAmount = Number(data.totalAmount);
    this.status = data.status || 'PENDING';
    this.paymentMethod = data.paymentMethod || 'UPI';
    this.paymentStatus = data.paymentStatus || 'Pending Payment';
    this.transactionId = data.transactionId || '';
    this.paymentVerificationNotes = data.paymentVerificationNotes || '';
    this.notes = data.notes || '';
    this.createdAt = new Date();
  }

  async save() {
    const record = { ...this };
    memoryStoreInstance.orders.push(record);
    return record;
  }
}

const Order = new Proxy(MongooseOrder, {
  get(target, prop) {
    if (isConnectedToMongoDB) {
      return target[prop];
    }
    return MemoryOrderModel[prop] || target[prop];
  },
  construct(target, args) {
    if (isConnectedToMongoDB) {
      return new target(...args);
    }
    return new MemoryOrderModel(...args);
  },
});

export default Order;
