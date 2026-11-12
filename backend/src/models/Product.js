import mongoose from 'mongoose';
import { isConnectedToMongoDB } from '../config/db.js';
import { memoryStoreInstance } from '../config/memoryStore.js';

const variantSchema = new mongoose.Schema(
  {
    weight: {
      type: String,
      required: true,
      enum: ['250 g', '350 g', '500 g', '1 kg'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 10,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Mango', 'Honey', 'Guava'],
        message: 'Category must be either Mango, Honey, or Guava',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    variants: [variantSchema],
    inStock: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.category === 'Honey' && this.variants && this.variants.length > 0) {
    this.variants.forEach((v) => {
      v.inStock = v.stockQuantity > 0;
    });
    const totalVariantStock = this.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
    this.stockQuantity = totalVariantStock;
    this.inStock = totalVariantStock > 0;
  } else if (this.stockQuantity <= 0) {
    this.inStock = false;
  }
  next();
});

const MongooseProduct = mongoose.models.Product || mongoose.model('Product', productSchema);

// In-Memory Model Wrapper for seamless offline/local use
class MemoryProductModel {
  static find(filter = {}) {
    let list = [...memoryStoreInstance.products];

    if (filter.isVisible !== undefined) {
      list = list.filter((p) => p.isVisible === filter.isVisible);
    }
    if (filter.category) {
      list = list.filter((p) => p.category === filter.category);
    }
    if (filter.$or) {
      list = list.filter((p) => {
        return filter.$or.some((clause) => {
          if (clause.name && clause.name.$regex) {
            return new RegExp(clause.name.$regex, clause.name.$options || 'i').test(p.name);
          }
          if (clause.description && clause.description.$regex) {
            return new RegExp(clause.description.$regex, clause.description.$options || 'i').test(p.description);
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
        return Promise.resolve(list).then(resolve, reject);
      },
    };
    return queryObj;
  }

  static async findById(id) {
    const item = memoryStoreInstance.products.find((p) => String(p._id) === String(id));
    if (!item) return null;
    return {
      ...item,
      save: async function () {
        if (this.category === 'Honey' && this.variants && this.variants.length > 0) {
          this.variants.forEach((v) => {
            v.inStock = (v.stockQuantity || 0) > 0;
          });
          const totalStock = this.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
          this.stockQuantity = totalStock;
          this.inStock = totalStock > 0;
        } else if (this.stockQuantity <= 0) {
          this.inStock = false;
        }
        const idx = memoryStoreInstance.products.findIndex((p) => String(p._id) === String(id));
        if (idx !== -1) {
          memoryStoreInstance.products[idx] = { ...this };
        }
        return this;
      },
    };
  }

  static async findByIdAndDelete(id) {
    const initialLen = memoryStoreInstance.products.length;
    memoryStoreInstance.products = memoryStoreInstance.products.filter(
      (p) => String(p._id) !== String(id)
    );
    return memoryStoreInstance.products.length < initialLen;
  }

  static async countDocuments(filter = {}) {
    let list = [...memoryStoreInstance.products];
    if (filter.$or) {
      list = list.filter((p) => !p.inStock || p.stockQuantity <= 0);
    }
    return list.length;
  }

  static async insertMany(items) {
    items.forEach((item) => {
      const doc = {
        _id: item._id || memoryStoreInstance.generateId(),
        ...item,
        createdAt: item.createdAt || new Date(),
      };
      memoryStoreInstance.products.push(doc);
    });
    return items;
  }

  constructor(data) {
    this._id = memoryStoreInstance.generateId();
    this.name = data.name;
    this.category = data.category;
    this.price = Number(data.price);
    this.description = data.description;
    this.image = data.image;
    this.variants = data.variants || [];
    this.stockQuantity = Number(data.stockQuantity ?? 0);
    if (this.category === 'Honey' && this.variants.length > 0) {
      this.stockQuantity = this.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
    }
    this.inStock = this.stockQuantity > 0 ? (data.inStock !== undefined ? data.inStock : true) : false;
    this.isVisible = data.isVisible !== undefined ? data.isVisible : true;
    this.createdAt = new Date();
  }

  async save() {
    if (this.category === 'Honey' && this.variants && this.variants.length > 0) {
      this.variants.forEach((v) => {
        v.inStock = (v.stockQuantity || 0) > 0;
      });
      const totalStock = this.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
      this.stockQuantity = totalStock;
      this.inStock = totalStock > 0;
    } else if (this.stockQuantity <= 0) {
      this.inStock = false;
    }
    const record = { ...this };
    memoryStoreInstance.products.push(record);
    return record;
  }
}

const Product = new Proxy(MongooseProduct, {
  get(target, prop) {
    if (isConnectedToMongoDB) {
      return target[prop];
    }
    return MemoryProductModel[prop] || target[prop];
  },
  construct(target, args) {
    if (isConnectedToMongoDB) {
      return new target(...args);
    }
    return new MemoryProductModel(...args);
  },
});

export default Product;
