import Category from '../models/Category.js';

// Initial 7 production categories
const INITIAL_CATEGORIES = [
  { name: 'Web Development', icon: 'Code', description: 'Master modern frontend & backend web engineering technologies.' },
  { name: 'Data Structures & Algorithms', icon: 'BookOpen', description: 'Master Arrays, Trees, Graphs, and Algorithmic problem solving.' },
  { name: 'Artificial Intelligence', icon: 'Cpu', description: 'Generative AI, LLM System Architecture, RAG & Autonomous Agents.' },
  { name: 'Machine Learning', icon: 'Cpu', description: 'Neural Networks, Deep Learning & Predictive Analytics.' },
  { name: 'Python', icon: 'Code', description: 'Python syntax, Data Wrangling, Automation & Backend APIs.' },
  { name: 'Database', icon: 'Layers', description: 'SQL, MongoDB, Database Design & Query Optimization.' },
  { name: 'DevOps & Cloud', icon: 'Cloud', description: 'Docker, Kubernetes, AWS & CI/CD Pipelines.' },
];

const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// @desc Get all categories (Auto-seeds initial 7 ONLY IF collection is completely empty)
// @route GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find().sort({ name: 1 });

    // Auto-seed initial 7 categories ONLY if database has ZERO categories
    if (categories.length === 0) {
      const categoriesToCreate = INITIAL_CATEGORIES.map(cat => ({
        ...cat,
        slug: generateSlug(cat.name)
      }));
      categories = await Category.insertMany(categoriesToCreate);
    }

    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @desc Create Category (Admin Only)
// @route POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, icon, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = generateSlug(name);
    const existing = await Category.findOne({ $or: [{ name: name.trim() }, { slug }] });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      icon: icon || 'BookOpen',
      description: description || '',
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc Update Category (Admin Only)
// @route PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const { name, icon, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name && name.trim() !== category.name) {
      category.name = name.trim();
      category.slug = generateSlug(name);
    }

    if (icon !== undefined) category.icon = icon;
    if (description !== undefined) category.description = description;

    await category.save();

    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc Delete Category (Admin Only)
// @route DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
