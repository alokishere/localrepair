require('dotenv').config();

const bcrypt = require('bcrypt');
const { connectDB } = require('../src/config/db');
const {
  User,
  TechnicianProfile,
  Category,
  Appliance,
  Address,
  Repair,
  RepairStatusHistory,
  Review,
} = require('../src/models');

const categoryData = [
  ['AC', 'ac', '❄️', 'Air conditioner repair and servicing'],
  ['Refrigerator', 'refrigerator', '🧊', 'Cooling and refrigerator repairs'],
  ['Washing Machine', 'washing-machine', '🧺', 'Washing machine repair and maintenance'],
  ['Microwave', 'microwave', '🍽️', 'Microwave oven troubleshooting'],
  ['TV', 'tv', '📺', 'Television repair and setup'],
  ['Water Purifier', 'water-purifier', '💧', 'RO and water purifier service'],
  ['Cooler', 'cooler', '🌬️', 'Air cooler repair and cleaning'],
  ['Geyser', 'geyser', '♨️', 'Water heater and geyser service'],
];

const technicianData = [
  { email: 'technician.ac@localrepair.test', name: 'Aarav Mehta', phone: '+919800000101', categories: ['ac', 'cooler'], skills: ['Gas refill', 'Compressor checks'], experienceYears: 8, serviceArea: 'Indiranagar, Bengaluru', coordinates: [77.6412, 12.9784], ratingAverage: 4.8, completedJobs: 142 },
  { email: 'technician.appliances@localrepair.test', name: 'Nisha Rao', phone: '+919800000102', categories: ['refrigerator', 'washing-machine', 'microwave'], skills: ['Motor repair', 'Control boards'], experienceYears: 6, serviceArea: 'Koramangala, Bengaluru', coordinates: [77.6245, 12.9352], ratingAverage: 4.6, completedJobs: 98 },
  { email: 'technician.home@localrepair.test', name: 'Kabir Singh', phone: '+919800000103', categories: ['tv', 'water-purifier', 'geyser'], skills: ['Installation', 'Electrical diagnostics'], experienceYears: 10, serviceArea: 'Whitefield, Bengaluru', coordinates: [77.7500, 12.9698], ratingAverage: 4.7, completedJobs: 187 },
  { email: 'technician.cooling@localrepair.test', name: 'Mira Joshi', phone: '+919800000104', categories: ['ac', 'refrigerator'], skills: ['Inverter AC service', 'Leak checks'], experienceYears: 7, serviceArea: 'HSR Layout, Bengaluru', coordinates: [77.6387, 12.9116], ratingAverage: 4.5, completedJobs: 86 },
  { email: 'technician.laundry@localrepair.test', name: 'Dev Malhotra', phone: '+919800000105', categories: ['washing-machine', 'geyser'], skills: ['Drum repair', 'Heating elements'], experienceYears: 9, serviceArea: 'Jayanagar, Bengaluru', coordinates: [77.5937, 12.9250], ratingAverage: 4.9, completedJobs: 164 },
  { email: 'technician.tv@localrepair.test', name: 'Anika Sen', phone: '+919800000106', categories: ['tv', 'microwave'], skills: ['Panel diagnostics', 'Circuit repair'], experienceYears: 5, serviceArea: 'Malleshwaram, Bengaluru', coordinates: [77.5713, 13.0031], ratingAverage: 4.4, completedJobs: 71 },
  { email: 'technician.ro@localrepair.test', name: 'Yusuf Khan', phone: '+919800000107', categories: ['water-purifier', 'cooler'], skills: ['Filter replacement', 'Pump servicing'], experienceYears: 6, serviceArea: 'Yelahanka, Bengaluru', coordinates: [77.5963, 13.1005], ratingAverage: 4.6, completedJobs: 93 },
  { email: 'technician.electrical@localrepair.test', name: 'Tara Iyer', phone: '+919800000108', categories: ['geyser', 'microwave', 'refrigerator'], skills: ['Thermostat repair', 'Wiring checks'], experienceYears: 11, serviceArea: 'Marathahalli, Bengaluru', coordinates: [77.7011, 12.9591], ratingAverage: 4.8, completedJobs: 203 },
  { email: 'technician.appliancecare@localrepair.test', name: 'Ravi Nair', phone: '+919800000109', categories: ['refrigerator', 'ac', 'washing-machine'], skills: ['Preventive maintenance', 'Compressor repair'], experienceYears: 12, serviceArea: 'Rajajinagar, Bengaluru', coordinates: [77.5520, 12.9910], ratingAverage: 4.7, completedJobs: 226 },
  { email: 'technician.quickfix@localrepair.test', name: 'Pooja Bhat', phone: '+919800000110', categories: ['cooler', 'tv', 'water-purifier'], skills: ['Home visits', 'Safety inspection'], experienceYears: 4, serviceArea: 'Electronic City, Bengaluru', coordinates: [77.6790, 12.8452], ratingAverage: 4.3, completedJobs: 54 },
];

const demoPassword = 'LocalRepairDemo123!';

async function upsertUser({ email, name, phone, role }) {
  const passwordHash = await bcrypt.hash(demoPassword, 10);
  return User.findOneAndUpdate(
    { email },
    { $set: { name, phone, role, isActive: true }, $setOnInsert: { passwordHash } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
}

async function upsertAddress(userId, data) {
  return Address.findOneAndUpdate(
    { userId, label: data.label },
    { $set: data },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
}

async function upsertAppliance(customerId, categoryId, data) {
  return Appliance.findOneAndUpdate(
    { customerId, nickname: data.nickname },
    { $set: { ...data, customerId, categoryId } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
}

async function upsertRepair(data) {
  return Repair.findOneAndUpdate(
    { customerId: data.customerId, title: data.title },
    { $set: data },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
}

async function addHistory(repairId, status, changedBy, note) {
  await RepairStatusHistory.findOneAndUpdate(
    { repairId, status },
    { $set: { changedBy, note } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
}

async function upsertReview(data) {
  return Review.findOneAndUpdate(
    { repairId: data.repairId, customerId: data.customerId },
    { $set: data },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
}

async function seed() {
  await connectDB();

  const categories = {};
  for (const [name, slug, icon, description] of categoryData) {
    categories[slug] = await Category.findOneAndUpdate(
      { slug },
      { $set: { name, icon, description, isActive: true } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
  }

  const customers = await Promise.all([
    upsertUser({ email: 'customer.one@localrepair.test', name: 'Ishita Shah', phone: '+919800000201', role: 'CUSTOMER' }),
    upsertUser({ email: 'customer.two@localrepair.test', name: 'Rohan Das', phone: '+919800000202', role: 'CUSTOMER' }),
  ]);

  const technicians = [];
  for (const data of technicianData) {
    const user = await upsertUser({ email: data.email, name: data.name, phone: data.phone, role: 'TECHNICIAN' });
    const serviceCategories = data.categories.map((slug) => categories[slug]._id);
    const profile = await TechnicianProfile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          bio: `${data.name} provides careful, local appliance service.`,
          experienceYears: data.experienceYears,
          serviceCategories,
          skills: data.skills,
          location: { type: 'Point', coordinates: data.coordinates },
          serviceRadiusKm: 12,
          serviceArea: data.serviceArea,
          verificationStatus: 'VERIFIED',
          ratingAverage: data.ratingAverage,
          totalReviews: Math.round(data.completedJobs * 0.65),
          completedJobs: data.completedJobs,
          isAvailable: true,
        },
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    technicians.push({ user, profile });
  }

  const addresses = await Promise.all([
    upsertAddress(customers[0]._id, { label: 'Home', fullAddress: '24 5th Main Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', location: { type: 'Point', coordinates: [77.6412, 12.9784] }, isDefault: true }),
    upsertAddress(customers[1]._id, { label: 'Home', fullAddress: '18 Lake View Road, Whitefield', city: 'Bengaluru', state: 'Karnataka', pincode: '560066', location: { type: 'Point', coordinates: [77.7500, 12.9698] }, isDefault: true }),
  ]);

  const appliances = await Promise.all([
    upsertAppliance(customers[0]._id, categories.ac._id, { brand: 'Voltas', model: '183V', nickname: 'Living room AC', purchaseYear: 2021 }),
    upsertAppliance(customers[0]._id, categories.refrigerator._id, { brand: 'LG', model: 'GL-T402', nickname: 'Kitchen fridge', purchaseYear: 2020 }),
    upsertAppliance(customers[1]._id, categories['washing-machine']._id, { brand: 'IFB', model: 'Diva Aqua', nickname: 'Washing machine', purchaseYear: 2019 }),
  ]);

  const repairs = [
    {
      customerId: customers[0]._id, categoryId: categories.ac._id, applianceId: appliances[0]._id, addressId: addresses[0]._id,
      title: 'AC not cooling', problemDescription: 'The AC runs but the room is not cooling.', diagnosisSuggestion: { issue: 'Possible filter blockage', urgency: 'MEDIUM' },
      status: 'SEARCHING', preferredDate: new Date('2026-08-25T00:00:00.000Z'), preferredTime: '10:00-12:00', customerNotes: 'Please call before arriving.',
    },
    {
      customerId: customers[0]._id, technicianId: technicians[1].user._id, categoryId: categories.refrigerator._id, applianceId: appliances[1]._id, addressId: addresses[0]._id,
      title: 'Fridge making noise', problemDescription: 'The refrigerator is cooling but makes a loud clicking noise.', status: 'ACCEPTED', preferredDate: new Date('2026-08-24T00:00:00.000Z'), preferredTime: '14:00-16:00', acceptedAt: new Date(),
    },
    {
      customerId: customers[1]._id, technicianId: technicians[1].user._id, categoryId: categories['washing-machine']._id, applianceId: appliances[2]._id, addressId: addresses[1]._id,
      title: 'Washing machine completed service', problemDescription: 'The washing machine was not draining properly.', status: 'COMPLETED', preferredDate: new Date('2026-08-18T00:00:00.000Z'), preferredTime: '09:00-11:00', completedAt: new Date(), finalCost: 850,
    },
    {
      customerId: customers[0]._id, technicianId: technicians[2].user._id, categoryId: categories.tv._id, addressId: addresses[0]._id,
      title: 'TV completed service', problemDescription: 'The TV had intermittent picture issues.', status: 'COMPLETED', preferredDate: new Date('2026-08-16T00:00:00.000Z'), preferredTime: '16:00-18:00', completedAt: new Date(), finalCost: 1200,
    },
  ];

  const seededRepairs = [];
  for (const repairData of repairs) {
    const repair = await upsertRepair(repairData);
    seededRepairs.push(repair);
    await addHistory(repair._id, repair.status, repairData.technicianId || repairData.customerId, 'Seeded demo repair state');
  }

  await upsertReview({ repairId: seededRepairs[2]._id, customerId: customers[1]._id, technicianId: technicians[1].user._id, rating: 5, comment: 'Quick diagnosis and a clear explanation of the repair.' });
  await upsertReview({ repairId: seededRepairs[3]._id, customerId: customers[0]._id, technicianId: technicians[2].user._id, rating: 4, comment: 'The picture issue was resolved and the technician arrived on time.' });

  console.log('Seed complete');
  console.log('Demo customer: customer.one@localrepair.test');
  console.log('Demo technician: technician.ac@localrepair.test');
  console.log(`Demo password for both: ${demoPassword}`);
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
  });
