import Product from '../models/Product.js';

// @desc Get all products (with optional filtering by category and search)
// @route GET /api/products
// @access Public (Admin can pass ?includeHidden=true)
export const getProducts = async (req, res) => {
  try {
    const { category, search, includeHidden } = req.query;
    const filter = {};

    if (includeHidden !== 'true') {
      filter.isVisible = true;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

// @desc Get single product by ID
// @route GET /api/products/:id
// @access Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

// @desc Create new product
// @route POST /api/products
// @access Private (Admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
      image,
      stockQuantity,
      variants,
      inStock,
      isVisible,
    } = req.body;

    const validCategories = ['Mango', 'Honey', 'Guava'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(', ')}`,
      });
    }

    let parsedStock = Number(stockQuantity ?? 0);
    let parsedVariants = [];

    if (category === 'Honey' && Array.isArray(variants) && variants.length > 0) {
      parsedVariants = variants.map((v) => ({
        weight: v.weight,
        price: Number(v.price),
        stockQuantity: Number(v.stockQuantity ?? 0),
        inStock: Number(v.stockQuantity ?? 0) > 0,
      }));
      parsedStock = parsedVariants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
    }

    const parsedPrice = Number(price || (parsedVariants[0] ? parsedVariants[0].price : 0));

    const product = new Product({
      name: name?.trim(),
      category,
      price: parsedPrice,
      description: description?.trim(),
      image,
      stockQuantity: parsedStock,
      variants: parsedVariants,
      inStock: parsedStock > 0 ? (inStock !== undefined ? inStock : true) : false,
      isVisible: isVisible !== undefined ? isVisible : true,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

// @desc Update product
// @route PUT /api/products/:id
// @access Private (Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
      name,
      category,
      price,
      description,
      image,
      stockQuantity,
      variants,
      inStock,
      isVisible,
    } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) {
      const validCategories = ['Mango', 'Honey', 'Guava'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Category must be one of: ${validCategories.join(', ')}`,
        });
      }
      product.category = category;
    }

    if (description !== undefined) product.description = description.trim();
    if (image !== undefined) product.image = image;

    if (product.category === 'Honey' && Array.isArray(variants)) {
      product.variants = variants.map((v) => ({
        weight: v.weight,
        price: Number(v.price),
        stockQuantity: Number(v.stockQuantity ?? 0),
        inStock: Number(v.stockQuantity ?? 0) > 0,
      }));
      product.stockQuantity = product.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
      product.price = product.variants[0] ? product.variants[0].price : Number(price || product.price);
      product.inStock = product.stockQuantity > 0;
    } else {
      if (price !== undefined) product.price = Number(price);
      if (stockQuantity !== undefined) {
        product.stockQuantity = Number(stockQuantity);
        if (product.stockQuantity <= 0) {
          product.inStock = false;
        } else if (inStock !== undefined) {
          product.inStock = Boolean(inStock);
        }
      } else if (inStock !== undefined) {
        product.inStock = Boolean(inStock);
      }
    }

    if (isVisible !== undefined) product.isVisible = Boolean(isVisible);

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};
