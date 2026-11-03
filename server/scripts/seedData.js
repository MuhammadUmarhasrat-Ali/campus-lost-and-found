import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/db.js';
import User from '../models/User.js';
import Item from '../models/Item.js';
import ContactRequest from '../models/ContactRequest.js';
import Report from '../models/Report.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Clearing existing records...');
    await Promise.all([
      User.deleteMany(),
      Item.deleteMany(),
      ContactRequest.deleteMany(),
      Report.deleteMany(),
    ]);

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('Password@123', salt);
    const adminPasswordHash = await bcrypt.hash('Admin@123456', salt);

    // 1. Admin
    const admin = await User.create({
      name: 'Campus Administrator',
      email: 'admin@campus.edu',
      passwordHash: adminPasswordHash,
      studentId: 'ADMIN-001',
      department: 'Campus Security & Administration',
      academicYear: 'Staff',
      phone: '9876543210',
      role: 'admin',
      isActive: true,
    });

    // 2. Students
    const student1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@campus.edu',
      passwordHash: defaultPasswordHash,
      studentId: 'CS2023045',
      department: 'Computer Science and Engineering',
      academicYear: 'Year 3 (Sem 6)',
      phone: '9876543211',
      role: 'student',
      isActive: true,
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@campus.edu',
      passwordHash: defaultPasswordHash,
      studentId: 'EC2024012',
      department: 'Electronics & Communication',
      academicYear: 'Year 2 (Sem 4)',
      phone: '9876543212',
      role: 'student',
      isActive: true,
    });

    const student3 = await User.create({
      name: 'Arjun Verma',
      email: 'arjun@campus.edu',
      passwordHash: defaultPasswordHash,
      studentId: 'ME2022089',
      department: 'Mechanical Engineering',
      academicYear: 'Year 4 (Sem 8)',
      phone: '9876543213',
      role: 'student',
      isActive: true,
    });

    console.log('[Seed] Creating realistic campus lost & found items...');

    const itemsData = [
      {
        title: 'Black boAt Airdopes 141 Wireless Earbuds',
        description: 'Lost my matte black boAt earbuds in their charging case. The case has a small scratch near the charging port. Left them on bench 4 during the afternoon DBMS lab session.',
        category: 'Electronics',
        type: 'lost',
        location: 'Computer Lab 3, Tech Block B',
        eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        eventTime: '03:45 PM',
        additionalDetails: 'Case has an anime sticker on the back. Urgent as I need them for project audio testing.',
        contactPreference: 'in_app',
        status: 'active',
        user: student1._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=60',
            publicId: 'demo-boat-earbuds',
          },
        ],
      },
      {
        title: 'Original Dell 65W USB-C Laptop Charger',
        description: 'Found a black Dell round-pin USB-C laptop power adapter left plugged in on a study table in the quiet section.',
        category: 'Electronics',
        type: 'found',
        location: 'Central Library, 2nd Floor Reading Room',
        eventDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        eventTime: '11:30 AM',
        additionalDetails: 'Submitted to the 2nd floor library circulation counter. Describe any marking to claim.',
        contactPreference: 'in_app',
        status: 'active',
        user: student2._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=60',
            publicId: 'demo-dell-charger',
          },
        ],
      },
      {
        title: 'Casio fx-991EX Classwiz Scientific Calculator',
        description: 'Lost during the Engineering Mathematics mid-term exam. Calculator has my name written with permanent marker on the back slide-cover.',
        category: 'Books and Notes',
        type: 'lost',
        location: 'Lecture Hall Block C - Room 302',
        eventDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        eventTime: '01:15 PM',
        additionalDetails: 'Has customized equation memory for matrix operations. Greatly appreciated if returned!',
        contactPreference: 'any',
        status: 'active',
        user: student3._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?w=800&auto=format&fit=crop&q=60',
            publicId: 'demo-casio-calc',
          },
        ],
      },
      {
        title: 'Milton Thermosteel 750ml Silver Water Bottle',
        description: 'Found on the outdoor picnic table right beside the main campus cafeteria. In pristine condition.',
        category: 'Water Bottles',
        type: 'found',
        location: 'Main Cafeteria Courtyard',
        eventDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        eventTime: '02:00 PM',
        additionalDetails: 'Has a blue silicone carrying loop attached to the cap.',
        contactPreference: 'in_app',
        status: 'active',
        user: student1._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=60',
            publicId: 'demo-milton-bottle',
          },
        ],
      },
      {
        title: 'Student ID Card & Metro Pass - Dept of Civil Engg',
        description: 'Found a navy blue lanyard with student ID card of Vikrant Singh (Roll CE2023019) together with a contactless smart metro card.',
        category: 'ID Cards',
        type: 'found',
        location: 'Bus Stop outside Main College Gate',
        eventDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        eventTime: '05:45 PM',
        additionalDetails: 'Kept safely with Security Gate 1 guard room.',
        contactPreference: 'in_app',
        status: 'active',
        user: student3._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=60',
            publicId: 'demo-id-card',
          },
        ],
      },
      {
        title: 'Grey Wildcraft Campus Backpack with Spiral Notebooks',
        description: 'Left my grey Wildcraft backpack near the indoor badminton court bench. Contains Operating Systems and Algorithms spiral notebooks.',
        category: 'Bags',
        type: 'lost',
        location: 'Campus Sports Complex - Court 2',
        eventDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        eventTime: '06:30 PM',
        additionalDetails: 'Has a small guitar keychain on the zipper.',
        contactPreference: 'in_app',
        status: 'resolved',
        user: student2._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60',
            publicId: 'demo-wildcraft-bag',
          },
        ],
      },
      {
        title: 'Set of 3 Bike & Hostel Room Keys with Marvel Keychain',
        description: 'Found on the staircase between ground floor and 1st floor of Mechanical Department.',
        category: 'Keys',
        type: 'found',
        location: 'Mechanical Engineering Block Staircase',
        eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        eventTime: '10:00 AM',
        additionalDetails: 'One key is a Honda bike key, two are brass Godrej lock keys.',
        contactPreference: 'in_app',
        status: 'active',
        user: student1._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=60',
            publicId: 'demo-keys',
          },
        ],
      },
      {
        title: 'Fastrack Blue Analog Wristwatch',
        description: 'Lost my Fastrack wristwatch with dark blue dial and silver metal strap after sports practice.',
        category: 'Accessories',
        type: 'lost',
        location: 'Campus Athletic Ground Pavilion',
        eventDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        eventTime: '07:15 PM',
        additionalDetails: 'Back cover has engraving from birthday gift.',
        contactPreference: 'in_app',
        status: 'claimed',
        user: student3._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=60',
            publicId: 'demo-watch',
          },
        ],
      },
    ];

    const createdItems = await Item.insertMany(itemsData);
    console.log(`[Seed] Inserted ${createdItems.length} items.`);

    // Create a demo contact request
    const contactReq = await ContactRequest.create({
      item: createdItems[1]._id, // Dell charger
      sender: student1._id,
      recipient: student2._id,
      message: 'Hello Priya, I think this Dell charger is mine! I was studying at table 14 near the window yesterday. It has a tiny strip of blue tape on the brick.',
      phone: '9876543211',
      status: 'pending',
    });
    console.log('[Seed] Created demo contact request.');

    // Create a demo report
    await Report.create({
      reportedItem: createdItems[0]._id,
      reportedBy: student3._id,
      reason: 'other',
      description: 'Testing report functionality for academic evaluation.',
      status: 'pending',
    });
    console.log('[Seed] Created demo report.');

    console.log('\n==================================================');
    console.log(' SEED COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    console.log('DEMO ACCOUNTS:');
    console.log('1. Admin:');
    console.log('   Email:    admin@campus.edu');
    console.log('   Password: Admin@123456');
    console.log('2. Student (Rahul):');
    console.log('   Email:    rahul@campus.edu');
    console.log('   Password: Password@123');
    console.log('3. Student (Priya):');
    console.log('   Email:    priya@campus.edu');
    console.log('   Password: Password@123');
    console.log('4. Student (Arjun):');
    console.log('   Email:    arjun@campus.edu');
    console.log('   Password: Password@123');
    console.log('==================================================\n');

    return true;
  } catch (error) {
    console.error('[Seed Error]:', error);
    throw error;
  }
};

// If run directly from command line
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/seedData.js')) {
  (async () => {
    try {
      console.log('[Seed] Connecting to database...');
      await connectDB();
      await seedDatabase();
      await closeDB();
      process.exit(0);
    } catch (err) {
      console.error('[Seed Script Error]:', err);
      process.exit(1);
    }
  })();
}

