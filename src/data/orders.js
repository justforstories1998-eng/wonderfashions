export const initialOrders = [
  {
    id: "ORD-001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.johnson@email.com",
    customerPhone: "+1 (555) 123-4567",
    shippingAddress: {
      street: "123 Fashion Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    items: [
      {
        id: 1,
        name: "Elegant Floral Summer Dress",
        price: 89.99,
        quantity: 1,
        size: "M",
        color: "Pink",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
      },
      {
        id: 10,
        name: "Statement Gold Earrings",
        price: 34.99,
        quantity: 2,
        size: "One Size",
        color: "Gold",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500"
      }
    ],
    subtotal: 159.97,
    shipping: 0,
    tax: 12.80,
    total: 172.77,
    status: "Delivered",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    createdAt: "2024-02-10T10:30:00",
    updatedAt: "2024-02-14T15:45:00"
  },
  {
    id: "ORD-002",
    customerName: "Michael Chen",
    customerEmail: "michael.chen@email.com",
    customerPhone: "+1 (555) 234-5678",
    shippingAddress: {
      street: "456 Style Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA"
    },
    items: [
      {
        id: 2,
        name: "Classic Denim Jacket",
        price: 79.99,
        quantity: 1,
        size: "L",
        color: "Blue",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500"
      }
    ],
    subtotal: 79.99,
    shipping: 5.99,
    tax: 6.40,
    total: 92.38,
    status: "Shipped",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    createdAt: "2024-02-12T14:20:00",
    updatedAt: "2024-02-13T09:15:00"
  },
  {
    id: "ORD-003",
    customerName: "Emily Davis",
    customerEmail: "emily.davis@email.com",
    customerPhone: "+1 (555) 345-6789",
    shippingAddress: {
      street: "789 Trendy Lane",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA"
    },
    items: [
      {
        id: 4,
        name: "High-Waisted Skinny Jeans",
        price: 69.99,
        quantity: 2,
        size: "28",
        color: "Dark Blue",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"
      },
      {
        id: 3,
        name: "Premium Cotton T-Shirt",
        price: 29.99,
        quantity: 3,
        size: "S",
        color: "White",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
      }
    ],
    subtotal: 229.95,
    shipping: 0,
    tax: 18.40,
    total: 248.35,
    status: "Processing",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    createdAt: "2024-02-14T09:45:00",
    updatedAt: "2024-02-14T09:45:00"
  },
  {
    id: "ORD-004",
    customerName: "Jessica Brown",
    customerEmail: "jessica.brown@email.com",
    customerPhone: "+1 (555) 456-7890",
    shippingAddress: {
      street: "321 Chic Boulevard",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    },
    items: [
      {
        id: 6,
        name: "Leather Crossbody Bag",
        price: 129.99,
        quantity: 1,
        size: "One Size",
        color: "Brown",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
      },
      {
        id: 8,
        name: "Silk Blend Blouse",
        price: 79.99,
        quantity: 1,
        size: "M",
        color: "White",
        image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500"
      }
    ],
    subtotal: 209.98,
    shipping: 0,
    tax: 16.80,
    total: 226.78,
    status: "Pending",
    paymentMethod: "Credit Card",
    paymentStatus: "Pending",
    createdAt: "2024-02-15T11:30:00",
    updatedAt: "2024-02-15T11:30:00"
  },
  {
    id: "ORD-005",
    customerName: "David Wilson",
    customerEmail: "david.wilson@email.com",
    customerPhone: "+1 (555) 567-8901",
    shippingAddress: {
      street: "654 Modern Way",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA"
    },
    items: [
      {
        id: 12,
        name: "Classic Wool Coat",
        price: 189.99,
        quantity: 1,
        size: "L",
        color: "Camel",
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500"
      }
    ],
    subtotal: 189.99,
    shipping: 0,
    tax: 15.20,
    total: 205.19,
    status: "Delivered",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    createdAt: "2024-02-08T16:00:00",
    updatedAt: "2024-02-12T10:30:00"
  },
  {
    id: "ORD-006",
    customerName: "Amanda Taylor",
    customerEmail: "amanda.taylor@email.com",
    customerPhone: "+1 (555) 678-9012",
    shippingAddress: {
      street: "987 Vogue Street",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA"
    },
    items: [
      {
        id: 7,
        name: "Athletic Performance Leggings",
        price: 49.99,
        quantity: 2,
        size: "S",
        color: "Black",
        image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500"
      },
      {
        id: 5,
        name: "Cozy Knit Sweater",
        price: 59.99,
        quantity: 1,
        size: "M",
        color: "Cream",
        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500"
      }
    ],
    subtotal: 159.97,
    shipping: 5.99,
    tax: 12.80,
    total: 178.76,
    status: "Shipped",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    createdAt: "2024-02-13T08:15:00",
    updatedAt: "2024-02-14T14:20:00"
  },
  {
    id: "ORD-007",
    customerName: "Robert Martinez",
    customerEmail: "robert.martinez@email.com",
    customerPhone: "+1 (555) 789-0123",
    shippingAddress: {
      street: "246 Elite Drive",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA"
    },
    items: [
      {
        id: 9,
        name: "Casual Linen Pants",
        price: 54.99,
        quantity: 2,
        size: "M",
        color: "Beige",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500"
      }
    ],
    subtotal: 109.98,
    shipping: 5.99,
    tax: 8.80,
    total: 124.77,
    status: "Cancelled",
    paymentMethod: "Credit Card",
    paymentStatus: "Refunded",
    createdAt: "2024-02-11T13:45:00",
    updatedAt: "2024-02-12T09:00:00"
  },
  {
    id: "ORD-008",
    customerName: "Lisa Anderson",
    customerEmail: "lisa.anderson@email.com",
    customerPhone: "+1 (555) 890-1234",
    shippingAddress: {
      street: "135 Glamour Road",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA"
    },
    items: [
      {
        id: 1,
        name: "Elegant Floral Summer Dress",
        price: 89.99,
        quantity: 1,
        size: "S",
        color: "Blue",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
      },
      {
        id: 11,
        name: "Bohemian Maxi Skirt",
        price: 64.99,
        quantity: 1,
        size: "S",
        color: "Multicolor",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj9a?w=500"
      },
      {
        id: 10,
        name: "Statement Gold Earrings",
        price: 34.99,
        quantity: 1,
        size: "One Size",
        color: "Gold",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500"
      }
    ],
    subtotal: 189.97,
    shipping: 0,
    tax: 15.20,
    total: 205.17,
    status: "Processing",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    createdAt: "2024-02-15T10:00:00",
    updatedAt: "2024-02-15T10:00:00"
  }
];

export const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];

export const paymentStatuses = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded"
];