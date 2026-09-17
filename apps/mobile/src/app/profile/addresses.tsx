import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useUser,
  useAddressesQuery,
  useAddCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
  useSetDefaultAddressMutation,
} from '@cinmax/hooks';
import { ALL_INDIAN_STATES } from '@cinmax/utils';
import {
  ChevronLeft,
  Plus,
  MapPin,
  Edit3,
  Trash2,
  Home,
  ChevronDown,
} from 'lucide-react-native';

export default function MobileAddressesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { data: addresses = [] } = useAddressesQuery(user?.id);

  const addAddressMutation = useAddCustomerAddressMutation();
  const updateAddressMutation = useUpdateCustomerAddressMutation();
  const deleteAddressMutation = useDeleteCustomerAddressMutation();
  const setDefaultAddressMutation = useSetDefaultAddressMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: 'Tamil Nadu',
    pincode: '',
    landmark: '',
    type: 'Home',
  });

  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setFormData({
      name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Customer Name',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      state: 'Tamil Nadu',
      pincode: '',
      landmark: '',
      type: 'Home',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: any) => {
    setEditingAddressId(addr.id);
    setFormData({
      name: `${addr.firstName || ''} ${addr.lastName || ''}`.trim(),
      phone: addr.phone || '',
      addressLine1: addr.streetLine1 || '',
      addressLine2: addr.streetLine2 || '',
      city: addr.city || '',
      district: addr.district || addr.city || '',
      state: addr.state || 'Tamil Nadu',
      pincode: addr.postalCode || '',
      landmark: addr.landmark || '',
      type: addr.addressType || 'Home',
    });
    setIsModalOpen(true);
  };

  const handleSaveAddress = () => {
    const cleanPhone = (formData.phone || '').replace(/[^0-9]/g, '');
    const cleanPincode = (formData.pincode || '').replace(/[^0-9]/g, '');

    if (!formData.name.trim()) {
      alert('Please enter Recipient Contact Name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit Indian Mobile Number');
      return;
    }
    if (!formData.addressLine1.trim()) {
      alert('Please enter House No. / Flat / Building Name');
      return;
    }
    if (!formData.addressLine2.trim()) {
      alert('Please enter Street / Road / Area');
      return;
    }
    if (!formData.city.trim()) {
      alert('Please enter City');
      return;
    }
    if (!/^\d{6}$/.test(cleanPincode)) {
      alert('Please enter a valid 6-digit Pincode');
      return;
    }

    const payload: any = {
      firstName: formData.name.split(' ')[0] || formData.name,
      lastName: formData.name.split(' ').slice(1).join(' ') || '',
      phone: cleanPhone,
      streetLine1: formData.addressLine1,
      streetLine2: formData.addressLine2,
      city: formData.city,
      district: formData.district || formData.city,
      state: formData.state,
      postalCode: cleanPincode,
      country: 'India',
      landmark: formData.landmark,
      isDefaultShipping: addresses.length === 0,
      isDefaultBilling: addresses.length === 0,
    };

    if (editingAddressId && user) {
      updateAddressMutation.mutate(
        { userId: user.id, addressId: editingAddressId, updates: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            alert('Address updated successfully!');
          },
        }
      );
    } else if (user) {
      addAddressMutation.mutate(
        { userId: user.id, address: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            alert('New address saved successfully!');
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    deleteAddressMutation.mutate(
      { userId: user.id, addressId: id },
      {
        onSuccess: () => {
          alert('Address deleted successfully!');
        },
      }
    );
  };

  const handleSetDefault = (id: string) => {
    if (!user) return;
    setDefaultAddressMutation.mutate(
      { userId: user.id, addressId: id, type: 'shipping' },
      {
        onSuccess: () => {
          alert('Default shipping address updated!');
        },
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      {/* Header Bar */}
      <View style={{ paddingTop: Math.max(12, insets.top), paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAF7F2', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)' }}>
        <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/profile' as any))} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E0E3E5' }}>
          <ChevronLeft size={22} color="#002754" />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'NotoSerif_700Bold', fontSize: 18, color: '#002754', fontWeight: '700' }} numberOfLines={1}>
          Saved Delivery Addresses
        </Text>
        <TouchableOpacity onPress={handleOpenAddModal} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#002754', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#737781', textTransform: 'uppercase', letterSpacing: 1 }}>
            CINMAX Account Addresses
          </Text>
          <TouchableOpacity
            onPress={handleOpenAddModal}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#002754', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}
          >
            <Plus size={14} color="white" />
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>Add Address</Text>
          </TouchableOpacity>
        </View>

        {addresses.length === 0 ? (
          <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 30, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E0E3E5' }}>
            <MapPin size={36} color="#C5A880" />
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#002754' }}>No Saved Addresses</Text>
            <Text style={{ fontSize: 13, color: '#737781', textAlign: 'center' }}>
              Add a delivery address to speed up checkout for artisanal soaps &amp; beauty formulations.
            </Text>
            <TouchableOpacity
              onPress={handleOpenAddModal}
              style={{ backgroundColor: '#002754', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, marginTop: 6 }}
            >
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>+ Add New Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {addresses.map((address) => (
              <View
                key={address.id}
                style={{ backgroundColor: 'white', borderRadius: 20, padding: 18, borderWidth: address.isDefaultShipping ? 2 : 1, borderColor: address.isDefaultShipping ? '#002754' : '#E0E3E5', gap: 10, shadowColor: '#002754', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Home size={16} color="#002754" />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#002754' }}>
                      {address.firstName} {address.lastName}
                    </Text>
                  </View>
                  {address.isDefaultShipping ? (
                    <View style={{ backgroundColor: '#EBF3FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                      <Text style={{ color: '#002754', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>DEFAULT</Text>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => handleSetDefault(address.id)}>
                      <Text style={{ color: '#059669', fontSize: 11, fontWeight: '700' }}>Set as Default</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={{ fontSize: 13, color: '#434750', lineHeight: 19 }}>
                  {address.streetLine1}
                  {address.streetLine2 ? `, ${address.streetLine2}` : ''}
                  {(address as any).landmark ? `\nLandmark: ${(address as any).landmark}` : ''}
                  {'\n'}{address.city}, {address.state} - {address.postalCode}
                  {'\n'}Phone: {address.phone}
                </Text>

                <View style={{ borderTopWidth: 1, borderTopColor: '#F0F2F5', paddingTop: 10, flexDirection: 'row', justifyContent: 'flex-end', gap: 14 }}>
                  <TouchableOpacity onPress={() => handleOpenEditModal(address)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Edit3 size={14} color="#002754" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#002754' }}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(address.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Trash2 size={14} color="#BA1A1A" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#BA1A1A' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Address Form Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '92%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#191C1E' }}>
                {editingAddressId ? 'Edit Delivery Address' : 'Add Delivery Address'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} style={{ padding: 6 }}>
                <Text style={{ fontWeight: '700', color: '#737781', fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled" keyboardDismissMode="none" contentContainerStyle={{ paddingBottom: 250 }}>
              <View style={{ gap: 14 }}>
                {/* 1. RECIPIENT DETAILS */}
                <View style={{ backgroundColor: '#FAF8F5', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#C3C6D1', gap: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    1. Recipient Details
                  </Text>
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#191C1E', marginBottom: 4 }}>Full Name *</Text>
                    <TextInput
                      placeholder="e.g. Aanya Sharma"
                      placeholderTextColor="#737781"
                      selectionColor="#002754"
                      cursorColor="#002754"
                      underlineColorAndroid="transparent"
                      value={formData.name}
                      onChangeText={(t: string) => setFormData({ ...formData, name: t })}
                      style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#191C1E', fontWeight: '400' }}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#191C1E', marginBottom: 4 }}>10 digit mobile number *</Text>
                    <TextInput
                      placeholder="e.g. 9876543210"
                      placeholderTextColor="#737781"
                      selectionColor="#002754"
                      cursorColor="#002754"
                      underlineColorAndroid="transparent"
                      keyboardType="number-pad"
                      maxLength={10}
                      value={formData.phone}
                      onChangeText={(t: string) => setFormData({ ...formData, phone: t })}
                      style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#191C1E', fontWeight: '400' }}
                    />
                  </View>
                </View>

                {/* 2. ADDRESS DETAILS */}
                <View style={{ backgroundColor: '#FAF8F5', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#C3C6D1', gap: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    2. Address Details
                  </Text>
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#191C1E', marginBottom: 4 }}>House / Flat / Door No. *</Text>
                    <TextInput
                      placeholder="e.g. Flat 402, Royal Enclave"
                      placeholderTextColor="#737781"
                      selectionColor="#002754"
                      cursorColor="#002754"
                      underlineColorAndroid="transparent"
                      value={formData.addressLine1}
                      onChangeText={(t: string) => setFormData({ ...formData, addressLine1: t })}
                      style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#191C1E', fontWeight: '400' }}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#191C1E', marginBottom: 4 }}>Street / Road / Area / Locality *</Text>
                    <TextInput
                      placeholder="e.g. 2nd Main Road, T. Nagar"
                      placeholderTextColor="#737781"
                      selectionColor="#002754"
                      cursorColor="#002754"
                      underlineColorAndroid="transparent"
                      value={formData.addressLine2}
                      onChangeText={(t: string) => setFormData({ ...formData, addressLine2: t })}
                      style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#191C1E', fontWeight: '400' }}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#191C1E', marginBottom: 4 }}>Landmark (Optional)</Text>
                    <TextInput
                      placeholder="e.g. Near Apollo Hospital"
                      placeholderTextColor="#737781"
                      selectionColor="#002754"
                      cursorColor="#002754"
                      underlineColorAndroid="transparent"
                      value={formData.landmark}
                      onChangeText={(t: string) => setFormData({ ...formData, landmark: t })}
                      style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#191C1E', fontWeight: '400' }}
                    />
                  </View>
                </View>

                {/* 3. LOCATION DETAILS */}
                <View style={{ backgroundColor: '#FAF8F5', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#C3C6D1', gap: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#002754', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    3. Location Details
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#191C1E', marginBottom: 4 }}>City *</Text>
                      <TextInput
                        placeholder="e.g. Chennai"
                        placeholderTextColor="#737781"
                        selectionColor="#002754"
                        cursorColor="#002754"
                        underlineColorAndroid="transparent"
                        value={formData.city}
                        onChangeText={(t: string) => setFormData({ ...formData, city: t })}
                        style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#191C1E', fontWeight: '400' }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#191C1E', marginBottom: 4 }}>District (Optional)</Text>
                      <TextInput
                        placeholder="e.g. Chennai"
                        placeholderTextColor="#737781"
                        selectionColor="#002754"
                        cursorColor="#002754"
                        underlineColorAndroid="transparent"
                        value={formData.district}
                        onChangeText={(t: string) => setFormData({ ...formData, district: t })}
                        style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#191C1E', fontWeight: '400' }}
                      />
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#191C1E', marginBottom: 4 }}>Pincode *</Text>
                      <TextInput
                        placeholder="e.g. 600017"
                        placeholderTextColor="#737781"
                        selectionColor="#002754"
                        cursorColor="#002754"
                        underlineColorAndroid="transparent"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={formData.pincode}
                        onChangeText={(t: string) => setFormData({ ...formData, pincode: t })}
                        style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C6D1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#191C1E', fontWeight: '400' }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#191C1E', marginBottom: 4 }}>State *</Text>
                      <TouchableOpacity onPress={() => setIsStateDropdownOpen(!isStateDropdownOpen)} style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#002754', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#191C1E' }} numberOfLines={1}>{formData.state}</Text>
                        <ChevronDown size={16} color="#002754" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {isStateDropdownOpen && (
                    <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#002754', borderRadius: 10, maxHeight: 160 }}>
                      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                        {ALL_INDIAN_STATES.map((st) => (
                          <TouchableOpacity
                            key={st}
                            onPress={() => { setFormData({ ...formData, state: st }); setIsStateDropdownOpen(false); }}
                            style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2F5', backgroundColor: formData.state === st ? '#EBF3FF' : 'white' }}
                          >
                            <Text style={{ fontSize: 13, fontWeight: formData.state === st ? '700' : '400', color: '#191C1E' }}>{st}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleSaveAddress}
                  style={{ backgroundColor: '#002754', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 6, marginBottom: 20 }}
                >
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>
                    {editingAddressId ? 'Update Delivery Address' : 'Save Delivery Address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
