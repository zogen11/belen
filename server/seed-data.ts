import { storage } from "./storage";
import { hashPassword } from "./auth";

// Sample data to populate the database
export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create sample users
    const users = [
      {
        email: "creator1@belen.app",
        username: "travel_vida",
        password: await hashPassword("password123"),
        firstName: "Maria",
        lastName: "Rodriguez",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      },
      {
        email: "creator2@belen.app", 
        username: "tech_guru_alex",
        password: await hashPassword("password123"),
        firstName: "Alex",
        lastName: "Chen",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      },
      {
        email: "creator3@belen.app",
        username: "fitness_sofia",
        password: await hashPassword("password123"),
        firstName: "Sofia",
        lastName: "Johnson",
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      },
      {
        email: "creator4@belen.app",
        username: "food_explorer",
        password: await hashPassword("password123"),
        firstName: "David",
        lastName: "Kim",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      const existingUser = await storage.getUserByEmail(userData.email);
      if (!existingUser) {
        const user = await storage.createUser(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.username}`);
      } else {
        createdUsers.push(existingUser);
        console.log(`📋 User already exists: ${existingUser.username}`);
      }
    }

    // Create sample videos
    const videos = [
      {
        userId: createdUsers[0].id,
        title: "Amazing Mountain Hiking Adventure in Switzerland",
        description: "Join me as I explore the breathtaking mountains of Switzerland! This hiking trail offers incredible views and unforgettable experiences.",
        thumbnailUrl: "https://images.unsplash.com/photo-1464822759844-d150065732fe?w=400&h=300&fit=crop",
        videoUrl: "https://images.unsplash.com/photo-1464822759844-d150065732fe?w=400&h=300&fit=crop",
        duration: 420, // 7 minutes
        tags: ["travel", "hiking", "switzerland", "adventure", "mountains"],
        isMonetized: true,
      },
      {
        userId: createdUsers[1].id,
        title: "Building a React App in 2025: Complete Tutorial",
        description: "Learn how to build modern React applications with the latest tools and best practices. Perfect for beginners and intermediate developers.",
        thumbnailUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
        videoUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
        duration: 1800, // 30 minutes
        tags: ["programming", "react", "javascript", "tutorial", "web development"],
        isMonetized: true,
      },
      {
        userId: createdUsers[2].id,
        title: "30-Minute Full Body HIIT Workout - No Equipment Needed",
        description: "Get your heart pumping with this intense full body workout! Perfect for busy schedules and can be done anywhere.",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        videoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        duration: 1800, // 30 minutes
        tags: ["fitness", "workout", "hiit", "no equipment", "full body"],
        isMonetized: true,
      },
      {
        userId: createdUsers[3].id,
        title: "Authentic Italian Pasta Making - Traditional Recipe",
        description: "Learn to make authentic Italian pasta from scratch! This traditional recipe has been passed down through generations.",
        thumbnailUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
        videoUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
        duration: 900, // 15 minutes
        tags: ["cooking", "italian", "pasta", "recipe", "traditional"],
        isMonetized: true,
      },
    ];

    for (const videoData of videos) {
      const video = await storage.createVideo(videoData);
      // Add some views
      for (let i = 0; i < Math.floor(Math.random() * 1000) + 100; i++) {
        await storage.incrementVideoViews(video.id);
      }
      console.log(`🎥 Created video: ${video.title}`);
    }

    // Create sample shorts
    const shorts = [
      {
        userId: createdUsers[0].id,
        title: "Quick Travel Tip: Packing Cubes Magic",
        description: "Transform your packing game with this simple trick! #TravelTips #PackingHacks",
        thumbnailUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=400&fit=crop",
        videoUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=400&fit=crop",
        duration: 45,
        tags: ["travel", "packing", "tips", "quick"],
        isMonetized: true,
      },
      {
        userId: createdUsers[1].id,
        title: "JavaScript Arrow Functions Explained in 60 Seconds",
        description: "Master arrow functions in under a minute! #JavaScript #Programming #WebDev",
        thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=400&fit=crop",
        videoUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=400&fit=crop",
        duration: 58,
        tags: ["javascript", "programming", "tutorial", "quick"],
        isMonetized: true,
      },
      {
        userId: createdUsers[2].id,
        title: "2-Minute Morning Stretch Routine",
        description: "Start your day right with this energizing stretch! #MorningRoutine #Stretch #Fitness",
        thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=400&fit=crop",
        videoUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=400&fit=crop",
        duration: 120,
        tags: ["fitness", "stretching", "morning", "routine"],
        isMonetized: true,
      },
      {
        userId: createdUsers[3].id,
        title: "Perfect Egg Scramble in 30 Seconds",
        description: "The secret to perfectly fluffy scrambled eggs! #Cooking #EggTips #QuickRecipes",
        thumbnailUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300&h=400&fit=crop",
        videoUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300&h=400&fit=crop",
        duration: 30,
        tags: ["cooking", "eggs", "quick", "breakfast"],
        isMonetized: true,
      },
    ];

    for (const shortsData of shorts) {
      const short = await storage.createShorts(shortsData);
      // Add some views
      for (let i = 0; i < Math.floor(Math.random() * 2000) + 500; i++) {
        await storage.incrementShortsViews(short.id);
      }
      console.log(`📱 Created short: ${short.title}`);
    }

    // Create sample photos
    const photos = [
      {
        userId: createdUsers[0].id,
        title: "Sunrise Over the Alps",
        description: "Caught this magical moment during my Switzerland trip! The golden hour light was absolutely perfect. 🏔️✨",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
        tags: ["travel", "sunrise", "alps", "photography", "nature"],
        isMonetized: true,
      },
      {
        userId: createdUsers[1].id,
        title: "My Coding Setup 2025",
        description: "Clean and minimal workspace for maximum productivity. What do you think? 💻⚡",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop",
        tags: ["setup", "coding", "workspace", "tech", "productivity"],
        isMonetized: true,
      },
      {
        userId: createdUsers[2].id,
        title: "Post-Workout Energy",
        description: "That feeling after crushing your fitness goals! 💪 Nothing beats the endorphin rush. #FitnessMotivation",
        imageUrl: "https://images.unsplash.com/photo-1549476464-37392f717541?w=600&h=600&fit=crop",
        tags: ["fitness", "motivation", "workout", "health", "lifestyle"],
        isMonetized: true,
      },
      {
        userId: createdUsers[3].id,
        title: "Homemade Sourdough Success",
        description: "After 2 weeks of feeding my starter, finally got the perfect loaf! The crust is crispy and the crumb is gorgeous. 🍞",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop",
        tags: ["baking", "sourdough", "homemade", "bread", "achievement"],
        isMonetized: true,
      },
    ];

    for (const photoData of photos) {
      const photo = await storage.createPhoto(photoData);
      // Add some likes
      for (let i = 0; i < Math.floor(Math.random() * 500) + 50; i++) {
        await storage.incrementPhotoLikes(photo.id);
      }
      console.log(`📸 Created photo: ${photo.title}`);
    }

    // Update user earnings and followers based on content performance
    const userUpdates = [
      { userId: createdUsers[0].id, earnings: 12500, followers: 145000, following: 89 },
      { userId: createdUsers[1].id, earnings: 8900, followers: 87500, following: 156 },
      { userId: createdUsers[2].id, earnings: 15600, followers: 201000, following: 67 },
      { userId: createdUsers[3].id, earnings: 7800, followers: 56700, following: 234 },
    ];

    for (const update of userUpdates) {
      await storage.updateUserEarnings(update.userId, update.earnings);
      console.log(`💰 Updated earnings for user: $${update.earnings / 100}`);
    }

    console.log("🎉 Database seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}