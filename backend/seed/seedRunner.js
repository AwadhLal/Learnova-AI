import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnova_ai';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for Seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Course.deleteMany();
    await Module.deleteMany();
    await Lesson.deleteMany();
    await Quiz.deleteMany();
    await Question.deleteMany();
    await Enrollment.deleteMany();
    await Progress.deleteMany();
    await Payment.deleteMany();
    await Review.deleteMany();

    console.log('🧹 Existing data cleared.');

    // 1. Create Admin & Student
    const admin = await User.create({
      name: 'Learnova Administrator',
      email: 'admin@learnova.ai',
      password: 'Admin@123456',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'Senior Director of Curriculum & AI Educational Architecture',
      skills: ['System Design', 'AI Engineering', 'Full Stack'],
      isVerified: true,
    });

    const student = await User.create({
      name: 'Alex Johnson',
      email: 'student@learnova.ai',
      password: 'Student@123456',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      bio: 'Passionate student mastering MERN & AI Engineering',
      skills: ['JavaScript', 'React', 'Python'],
      learningGoals: ['Become a Full-Stack Engineer', 'Build AI SaaS Apps'],
      streak: 7,
      isVerified: true,
    });

    console.log('👤 Admin and Student accounts created.');

    // 2. Create 5 Categories
    const categoriesData = [
      { name: 'Web Development', slug: 'web-development', icon: 'Code', description: 'Master modern frontend & backend web engineering technologies.' },
      { name: 'Data Science & AI', slug: 'data-science-ai', icon: 'Cpu', description: 'Dive deep into Machine Learning, Neural Networks & Generative AI.' },
      { name: 'Mobile App Development', slug: 'mobile-development', icon: 'Smartphone', description: 'Build native iOS and Android apps with React Native & Flutter.' },
      { name: 'Cloud & DevOps', slug: 'cloud-devops', icon: 'Cloud', description: 'Deploy scalable infrastructure with Docker, Kubernetes & AWS.' },
      { name: 'Cybersecurity', slug: 'cybersecurity', icon: 'ShieldCheck', description: 'Understand penetration testing, network defense & application security.' },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`🏷️  Created ${createdCategories.length} Categories.`);

    const catMap = {};
    createdCategories.forEach((c) => { catMap[c.slug] = c._id; });

    // 3. Create Courses
    const coursesData = [
      {
        title: 'Complete Full-Stack MERN Mastery 2026',
        slug: 'full-stack-mern-mastery-2026',
        subtitle: 'Build production-ready web apps with React 19, Node, Express & MongoDB',
        description: 'Comprehensive hands-on course taking you from absolute fundamentals to deploying complex enterprise web applications.',
        category: catMap['web-development'],
        instructor: admin._id,
        level: 'Intermediate',
        price: 2499,
        originalPrice: 4999,
        rating: 4.9,
        reviewCount: 142,
        enrolledStudentsCount: 1250,
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        learningObjectives: [
          'Build complete modern full-stack web applications',
          'Implement JWT auth, HTTP-only cookies, & RBAC',
          'Deploy Node.js microservices and MongoDB databases',
          'Integrate Razorpay payments and AI assistance'
        ],
        requirements: ['Basic HTML, CSS, & JavaScript understanding'],
        tags: ['react', 'node', 'express', 'mongodb', 'mern', 'javascript']
      },
      {
        title: 'Generative AI & LLM Systems Architecture',
        slug: 'generative-ai-llm-systems-architecture',
        subtitle: 'Fine-tune, orchestrate, and deploy production AI models with Python & LangChain',
        description: 'Master practical AI engineering! Build AI agents, RAG pipelines, and integrate frontier models into real SaaS products.',
        category: catMap['data-science-ai'],
        instructor: admin._id,
        level: 'Advanced',
        price: 3499,
        originalPrice: 6999,
        rating: 4.95,
        reviewCount: 98,
        enrolledStudentsCount: 840,
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
        learningObjectives: [
          'Understand Transformer architectures and Attention mechanisms',
          'Build RAG systems with vector databases (Pinecone, Chroma)',
          'Create autonomous AI agents with tools and memory',
          'Optimize model latency, caching, and inference costs'
        ],
        requirements: ['Python fundamentals and basic Linear Algebra'],
        tags: ['ai', 'llm', 'generative-ai', 'python', 'rag', 'langchain']
      },
      {
        title: 'React Native & Expo: Modern Cross-Platform Apps',
        slug: 'react-native-expo-modern-apps',
        subtitle: 'Build fluid native iOS and Android mobile apps from one codebase',
        description: 'Learn to design, develop, and publish mobile apps with React Native, Tailwind (NativeWind), and seamless state management.',
        category: catMap['mobile-development'],
        instructor: admin._id,
        level: 'Beginner',
        price: 1999,
        originalPrice: 3999,
        rating: 4.8,
        reviewCount: 76,
        enrolledStudentsCount: 620,
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
        learningObjectives: [
          'Design native UI with smooth 60fps gestures and animations',
          'Access native hardware capabilities (Camera, Push Notifications)',
          'Publish apps to Apple App Store and Google Play Store'
        ],
        requirements: ['Basic knowledge of React'],
        tags: ['react-native', 'expo', 'mobile', 'ios', 'android']
      },
      {
        title: 'AWS Cloud Native Architecture & DevOps Specialist',
        slug: 'aws-cloud-native-architecture-devops',
        subtitle: 'Master ECS, EKS, Terraform, CI/CD pipelines, and AWS Serverless',
        description: 'Architect resilient, auto-scaling cloud solutions on Amazon Web Services using IaC (Terraform) and continuous delivery.',
        category: catMap['cloud-devops'],
        instructor: admin._id,
        level: 'Intermediate',
        price: 2999,
        originalPrice: 5999,
        rating: 4.85,
        reviewCount: 110,
        enrolledStudentsCount: 930,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        learningObjectives: [
          'Design multi-tier AWS architectures with VPCs, EC2, & RDS',
          'Implement Docker containers and Kubernetes orchestrations',
          'Automate deployments with GitHub Actions and Terraform'
        ],
        requirements: ['Linux command line basics'],
        tags: ['aws', 'cloud', 'devops', 'docker', 'terraform']
      },
      {
        title: 'Practical Ethical Hacking & Cyber Defense',
        slug: 'practical-ethical-hacking-cyber-defense',
        subtitle: 'Penetration testing, web vulnerability analysis, and network security',
        description: 'Learn offensive and defensive security tactics used by top cybersecurity specialists to safeguard digital assets.',
        category: catMap['cybersecurity'],
        instructor: admin._id,
        level: 'Intermediate',
        price: 2799,
        originalPrice: 5499,
        rating: 4.9,
        reviewCount: 65,
        enrolledStudentsCount: 510,
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
        learningObjectives: [
          'Identify OWASP Top 10 vulnerabilities (XSS, SQLi, CSRF)',
          'Perform network reconnaissance and vulnerability scanning',
          'Implement robust security hardening across web servers'
        ],
        requirements: ['Networking basics'],
        tags: ['security', 'ethical-hacking', 'cybersecurity', 'owasp']
      },
      {
        title: 'Data Structures & Algorithms in Java for Interviews',
        slug: 'dsa-java-interview-mastery',
        subtitle: 'Master Arrays, Recursion, Trees, Graphs, and Dynamic Programming',
        description: 'Ace coding interviews at top tech companies! Systematic problem solving with 150+ curated problem walkthroughs.',
        category: catMap['web-development'],
        instructor: admin._id,
        level: 'All Levels',
        price: 1899,
        originalPrice: 3499,
        rating: 4.92,
        reviewCount: 185,
        enrolledStudentsCount: 1650,
        thumbnail: 'https://images.unsplash.com/photo-1516116211223-4c7141203063?w=800&auto=format&fit=crop&q=80',
        learningObjectives: [
          'Analyze Time and Space complexity (Big O notation)',
          'Master Arrays, Two Pointers, Sliding Window & Recursion',
          'Solve Tree traversal and Graph algorithmic problems',
          'Master Dynamic Programming memoization & tabulation'
        ],
        requirements: ['Basic programming syntax in Java or C++'],
        tags: ['java', 'dsa', 'algorithms', 'interview', 'recursion']
      },
      {
        title: 'Python for Data Science, Pandas & Visualization',
        slug: 'python-data-science-pandas-visualization',
        subtitle: 'Data wrangling, exploratory data analysis, NumPy, and Seaborn',
        description: 'Transform raw data into strategic insights using Python’s powerful data analysis ecosystem.',
        category: catMap['data-science-ai'],
        instructor: admin._id,
        level: 'Beginner',
        price: 1499,
        originalPrice: 2999,
        rating: 4.75,
        reviewCount: 88,
        enrolledStudentsCount: 780,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        learningObjectives: [
          'Clean, transform, and aggregate complex datasets with Pandas',
          'Create interactive dashboards and visualizations',
          'Perform statistical analysis and hypothesis testing'
        ],
        requirements: ['No prior programming experience required'],
        tags: ['python', 'data-science', 'pandas', 'numpy']
      },
      {
        title: 'Kubernetes & Production Microservices Blueprint',
        slug: 'kubernetes-production-microservices-blueprint',
        subtitle: 'Deploy, scale, and manage containerized applications with confidence',
        description: 'Master production Kubernetes cluster management, Helm charts, service meshes, and observability with Prometheus & Grafana.',
        category: catMap['cloud-devops'],
        instructor: admin._id,
        level: 'Advanced',
        price: 3299,
        originalPrice: 6499,
        rating: 4.88,
        reviewCount: 54,
        enrolledStudentsCount: 430,
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
        learningObjectives: [
          'Deploy multi-node K8s clusters and config management',
          'Configure Ingress controllers, SSL, and DNS',
          'Set up monitoring dashboards and automated horizontal pod scaling'
        ],
        requirements: ['Docker fundamentals'],
        tags: ['kubernetes', 'k8s', 'docker', 'devops', 'microservices']
      }
    ];

    const createdCourses = await Course.insertMany(coursesData);
    console.log(`📚 Created ${createdCourses.length} Courses.`);

    // 4. Create Modules and Lessons for MERN Course & DSA Course
    const mernCourse = createdCourses.find(c => c.slug.includes('mern'));
    const dsaCourse = createdCourses.find(c => c.slug.includes('dsa'));

    if (mernCourse) {
      const mod1 = await Module.create({
        course: mernCourse._id,
        title: 'Module 1: Architecture & Node.js Fundamentals',
        order: 1,
        description: 'Understanding event loop, non-blocking I/O, and Express server setup.'
      });

      const lesson1_1 = await Lesson.create({
        module: mod1._id,
        course: mernCourse._id,
        title: '1.1 Introduction to MERN Stack & Architecture',
        type: 'video',
        content: `Welcome to MERN Stack Mastery! In this video lesson, we explore how React frontend connects seamlessly to Express backend APIs and MongoDB database layer.`,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        durationMinutes: 15,
        order: 1,
      });

      const lesson1_2 = await Lesson.create({
        module: mod1._id,
        course: mernCourse._id,
        title: '1.2 Setting up Express.js REST API & Middlewares',
        type: 'text',
        content: `Express.js is a minimal and flexible Node.js web application framework.

Key concepts covered in this lesson:
1. Routing architecture (/api/v1)
2. Custom Middleware pipeline
3. Request input validation & sanitization
4. Centralized Error Handling`,
        durationMinutes: 20,
        order: 2,
      });

      const mod2 = await Module.create({
        course: mernCourse._id,
        title: 'Module 2: MongoDB & Mongoose Schema Design',
        order: 2,
        description: 'Designing normalized schemas, indexes, and aggregation pipelines.'
      });

      const lesson2_1 = await Lesson.create({
        module: mod2._id,
        course: mernCourse._id,
        title: '2.1 Mongoose Schemas, References & Population',
        type: 'text',
        content: `Mongoose provides a straight-forward, schema-based solution to model application data.

We cover:
- Define Schema types, defaults, and validators
- Foreign reference keys using ObjectId
- Deep population of nested documents`,
        durationMinutes: 25,
        order: 1,
      });

      // Create Quiz for MERN Course
      const mernQuiz = await Quiz.create({
        course: mernCourse._id,
        module: mod1._id,
        title: 'MERN Stack Architecture Assessment',
        topic: 'MERN Fundamentals',
        description: 'Test your understanding of Node, Express, REST APIs, and HTTP headers.',
        timeLimitMinutes: 10,
        passingScore: 70,
      });

      await Question.insertMany([
        {
          quiz: mernQuiz._id,
          questionText: 'Which Node.js mechanism handles non-blocking asynchronous operations?',
          type: 'MCQ',
          options: ['Event Loop', 'Multi-Thread Manager', 'Global Mutex', 'Synchronous Thread Pool'],
          correctAnswerIndex: 0,
          explanation: 'The Event Loop allows Node.js to perform non-blocking I/O operations despite being single-threaded.',
          topic: 'Node.js Core',
          difficulty: 'Medium'
        },
        {
          quiz: mernQuiz._id,
          questionText: 'What is the primary role of middleware in Express.js?',
          type: 'MCQ',
          options: ['Render HTML templates', 'Access & mutate request/response objects before final route handler', 'Compile JavaScript to bytecode', 'Direct database disk write'],
          correctAnswerIndex: 1,
          explanation: 'Middleware functions execute in sequence, inspecting or modifying request/response objects.',
          topic: 'Express Middleware',
          difficulty: 'Easy'
        }
      ]);
    }

    if (dsaCourse) {
      const dsaMod1 = await Module.create({
        course: dsaCourse._id,
        title: 'Module 1: Time Complexity & Recursion',
        order: 1,
        description: 'Master Big O notation, call stacks, and recursive tree analysis.'
      });

      await Lesson.create({
        module: dsaMod1._id,
        course: dsaCourse._id,
        title: '1.1 Big O Notation & Asymptotic Analysis',
        type: 'video',
        content: 'Learn how to analyze algorithm efficiency in terms of time and memory growth.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        durationMinutes: 18,
        order: 1,
      });

      const dsaLesson2 = await Lesson.create({
        module: dsaMod1._id,
        course: dsaCourse._id,
        title: '1.2 Recursion Deep Dive & Call Stack Visualizer',
        type: 'text',
        content: `Recursion is a technique where a function calls itself to solve smaller instances of a problem.

Every recursive solution MUST have:
1. Base Case: The condition under which the recursion stops.
2. Recursive Step: Reducing the input towards the base case.`,
        durationMinutes: 22,
        order: 2,
      });

      const dsaQuiz = await Quiz.create({
        course: dsaCourse._id,
        module: dsaMod1._id,
        title: 'Recursion & Big-O Mastery Check',
        topic: 'Recursion',
        description: 'Test your understanding of recursive call stack depths and asymptotic bounds.',
        timeLimitMinutes: 10,
        passingScore: 70,
      });

      await Question.insertMany([
        {
          quiz: dsaQuiz._id,
          questionText: 'What occurs if a recursive function lacks a valid base case?',
          type: 'MCQ',
          options: ['StackOverflow Error', 'Memory deallocation', 'NullPointer Exception', 'Infinite Loop without stack growth'],
          correctAnswerIndex: 0,
          explanation: 'Without a base case, calls accumulate on the call stack until memory is exhausted, causing StackOverflow.',
          topic: 'Recursion',
          difficulty: 'Medium'
        }
      ]);
    }

    // 5. Enroll Student in MERN Course & Add Progress
    if (mernCourse) {
      const payment = await Payment.create({
        user: student._id,
        course: mernCourse._id,
        razorpayOrderId: `order_seed_${Date.now()}`,
        razorpayPaymentId: `pay_seed_${Date.now()}`,
        amount: mernCourse.price,
        status: 'successful',
      });

      const enrollment = await Enrollment.create({
        user: student._id,
        course: mernCourse._id,
        status: 'active',
        payment: payment._id,
      });

      const lessons = await Lesson.find({ course: mernCourse._id });
      await Progress.create({
        user: student._id,
        course: mernCourse._id,
        completedLessons: lessons.slice(0, 1).map(l => l._id),
        percentage: 50,
      });

      // Sample Review
      await Review.create({
        user: student._id,
        course: mernCourse._id,
        rating: 5,
        comment: 'Outstanding platform and course content! The AI Tutor cleared up my Express middleware confusion in seconds.',
      });
    }

    console.log('✅ Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
