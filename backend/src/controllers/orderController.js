import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Helper to generate unique order ID in format: #ORD-<timestamp>
const generateOrderId = () => {
  const timestamp = Date.now();
  return `#ORD-${timestamp}`;
};

// @desc Create new order
// @route POST /api/orders
// @access Public
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      address,
      pincode,
      products,
      totalAmount,
      notes,
      paymentMethod,
    } = req.body;

    if (!customerName || !phone || !address || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required customer details (name, phone, address, pincode)',
      });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one product',
      });
    }

    const orderId = generateOrderId();

    // Verify and deduct stock where applicable
    for (const item of products) {
      if (item.productId) {
        try {
          const product = await Product.findById(item.productId);
          if (product) {
            if (product.category === 'Honey' && product.variants && product.variants.length > 0) {
              const variantMatch = product.variants.find((v) => v.weight === item.selectedVariant);
              if (variantMatch) {
                variantMatch.stockQuantity = Math.max(0, variantMatch.stockQuantity - item.quantity);
                variantMatch.inStock = variantMatch.stockQuantity > 0;
              }
              const totalStock = product.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
              product.stockQuantity = totalStock;
              product.inStock = totalStock > 0;
            } else {
              product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
              if (product.stockQuantity <= 0) {
                product.inStock = false;
              }
            }
            await product.save();
          }
        } catch (stockErr) {
          console.warn(`Could not update stock for product ${item.productId}:`, stockErr.message);
        }
      }
    }

    const cleanPaymentMethod = paymentMethod === 'Bank Transfer' ? 'Bank Transfer' : 'UPI';

    const order = new Order({
      orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      address: address.trim(),
      pincode: pincode.trim(),
      products,
      totalAmount: Number(totalAmount),
      status: 'Placed',
      paymentMethod: cleanPaymentMethod,
      paymentStatus: 'Pending Payment',
      notes: notes || '',
    });

    const savedOrder = await order.save();

    // Build pre-filled WhatsApp message matching the exact required format
    const productListText = products
      .map((p) => {
        const variantText = p.category === 'Honey' || (p.selectedVariant && p.selectedVariant !== 'kg')
          ? `(x${p.quantity} ${p.selectedVariant || 'Jar'})`
          : `(x${p.quantity} KG)`;
        const itemTotal = p.price * p.quantity;
        return `▫️ *${p.name}* ${variantText} - ₹${itemTotal}`;
      })
      .join('\n');

    const cleanAddress = pincode && !address.includes(pincode)
      ? `${address.trim()}, ${pincode.trim()}`
      : address.trim();

    const whatsappMessage = [
      `🛍️ *NEW ORDER PLACED - PONIVRAA FARM*`,
      ``,
      `📌 *Order ID:* ${orderId}`,
      ``,
      `👤 *Customer Details:*`,
      `- Name: ${customerName}`,
      `- Phone: ${phone}`,
      `- Address: ${cleanAddress}`,
      ``,
      `📦 *Items Ordered:*`,
      productListText,
      ``,
      `💰 *Total Amount:* ₹${totalAmount}`,
      `🚚 *Delivery:* FREE across Tamil Nadu`,
      `✅ *Status:* PENDING`,
      ``,
      `---`,
      `_I am sending this for order confirmation and will attach my payment screenshot below._`,
    ].join('\n');

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/918098202289?text=${encodedMessage}`;

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: savedOrder,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message,
    });
  }
};

// @desc Track order by Order ID or Phone number
// @route GET /api/orders/track
// @access Public
export const trackOrder = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please enter an Order ID or Phone Number to track',
      });
    }

    const trimmedQuery = query.trim();

    // Search by exact orderId (case-insensitive, ignoring # prefix) or phone number
    const cleanId = trimmedQuery.replace(/^#/, '');
    const orders = await Order.find({
      $or: [
        { orderId: { $regex: new RegExp(`^#?${cleanId}$`, 'i') } },
        { phone: { $regex: trimmedQuery, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No order found matching "${trimmedQuery}". Please check your Order ID or phone number.`,
      });
    }

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to track order',
      error: error.message,
    });
  }
};

// @desc Get all orders
// @route GET /api/orders
// @access Private (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// @desc Update order status
// @route PATCH /api/orders/:id/status
// @access Private (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const validStatuses = ['PENDING', 'Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    const validPaymentStatuses = ['Pending Payment', 'Payment Verification', 'Paid'];

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
        });
      }
      order.status = status;
    }

    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status. Valid values: ${validPaymentStatuses.join(', ')}`,
        });
      }
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated successfully`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

// @desc Customer submits payment reference / UTR for verification
// @route POST /api/orders/:orderId/verify-payment
// @access Public
export const submitPaymentVerification = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { transactionId, paymentMethod, paymentNotes } = req.body;

    if (!transactionId || transactionId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID / UTR number is required for verification',
      });
    }

    const cleanId = orderId.trim().replace(/^#/, '');
    const cleanQuery = new RegExp(`^#?${cleanId}$`, 'i');

    let order = await Order.findOne({
      $or: [
        { orderId: cleanQuery },
        { orderId: `#${cleanId}` },
        { orderId: cleanId },
        ...(orderId.length === 24 ? [{ _id: orderId }] : []),
      ],
    });

    if (!order) {
      try {
        order = await Order.findById(orderId);
      } catch (e) {}
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.paymentStatus = 'Payment Verification';
    order.transactionId = transactionId.trim();
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (paymentNotes) order.paymentVerificationNotes = paymentNotes.trim();

    const updatedOrder = await order.save();

    // Build pre-filled WhatsApp message including payment verification details
    const productListText = (updatedOrder.products || [])
      .map((p) => {
        const variantText = p.category === 'Honey' || (p.selectedVariant && p.selectedVariant !== 'kg')
          ? `(x${p.quantity} ${p.selectedVariant || 'Jar'})`
          : `(x${p.quantity} KG)`;
        const itemTotal = p.price * p.quantity;
        return `▫️ *${p.name}* ${variantText} - ₹${itemTotal}`;
      })
      .join('\n');

    const cleanAddress = updatedOrder.pincode && !updatedOrder.address.includes(updatedOrder.pincode)
      ? `${updatedOrder.address.trim()}, ${updatedOrder.pincode.trim()}`
      : updatedOrder.address.trim();

    const whatsappMessage = [
      `🛍️ *NEW ORDER PLACED - PONIVRAA FARM*`,
      ``,
      `📌 *Order ID:* ${updatedOrder.orderId}`,
      ``,
      `👤 *Customer Details:*`,
      `- Name: ${updatedOrder.customerName}`,
      `- Phone: ${updatedOrder.phone}`,
      `- Address: ${cleanAddress}`,
      ``,
      `📦 *Items Ordered:*`,
      productListText,
      ``,
      `💰 *Total Amount:* ₹${updatedOrder.totalAmount}`,
      `💳 *Payment Method:* ${updatedOrder.paymentMethod}`,
      `🧾 *Transaction ID / UTR:* ${updatedOrder.transactionId}`,
      `⏳ *Payment Status:* PAYMENT VERIFICATION`,
      `🚚 *Delivery:* FREE across Tamil Nadu`,
      `✅ *Status:* PENDING`,
      ``,
      `---`,
      `_I am sending this for order confirmation and will attach my payment screenshot below._`,
    ].join('\n');

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/918098202289?text=${encodedMessage}`;

    return res.status(200).json({
      success: true,
      message: 'Payment verification submitted successfully',
      data: updatedOrder,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Error submitting payment verification:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit payment verification',
      error: error.message,
    });
  }
};

// @desc Update payment status (Admin)
// @route PATCH /api/orders/:id/payment-status
// @access Private (Admin)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const validStatuses = ['Pending Payment', 'Payment Verification', 'Paid'];

    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Valid values: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.paymentStatus = paymentStatus;
    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: `Payment status updated to "${paymentStatus}"`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message,
    });
  }
};

// @desc Delete / Cancel order
// @route DELETE /api/orders/:id
// @access Private (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message,
    });
  }
};

// @desc Get dashboard stats
// @route GET /api/orders/dashboard/stats
// @access Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const outOfStockProducts = await Product.countDocuments({
      $or: [{ inStock: false }, { stockQuantity: { $lte: 0 } }],
    });

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      status: { $in: ['PENDING', 'Placed', 'Packed', 'Shipped', 'Out for Delivery'] },
    });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        outOfStockProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};
