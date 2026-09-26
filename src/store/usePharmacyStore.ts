import { create } from 'zustand';
import { Medicine, PharmacyOrder } from '../types/medvault';
import { MOCK_MEDICINES } from '../data/mockData';

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface PharmacyState {
  medicines: Medicine[];
  cart: CartItem[];
  orders: PharmacyOrder[];
  isCartOpen: boolean;
  addToCart: (medicine: Medicine, qty?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  checkout: (address: string) => PharmacyOrder;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Medicine;
}

export const usePharmacyStore = create<PharmacyState>((set, get) => ({
  medicines: MOCK_MEDICINES,
  cart: [],
  orders: [],
  isCartOpen: false,

  addToCart: (medicine, qty = 1) => {
    set((state) => {
      const existing = state.cart.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.medicine.id === medicine.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          )
        };
      }
      return { cart: [...state.cart, { medicine, quantity: qty }] };
    });
  },

  removeFromCart: (medicineId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.medicine.id !== medicineId)
    }));
  },

  updateQuantity: (medicineId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(medicineId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity } : item
      )
    }));
  },

  clearCart: () => set({ cart: [] }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  checkout: (deliveryAddress) => {
    const { cart } = get();
    const totalAmount = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);

    const newOrder: PharmacyOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      patientId: 'pat-201',
      items: cart.map((item) => ({
        medicineId: item.medicine.id,
        medicineName: item.medicine.name,
        quantity: item.quantity,
        unitPrice: item.medicine.price
      })),
      totalAmount,
      status: 'Placed',
      orderDate: new Date().toISOString(),
      deliveryAddress
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      cart: [],
      isCartOpen: false
    }));

    return newOrder;
  },

  addMedicine: (medData) => {
    const newMed: Medicine = {
      ...medData,
      id: `med-${Date.now()}`
    };
    set((state) => ({ medicines: [newMed, ...state.medicines] }));
    return newMed;
  }
}));
