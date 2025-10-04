import { PrismaClient, VoteType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting enhanced database seeding...');

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alex.chen@example.com' },
      update: {},
      create: {
        name: 'Alex Chen',
        username: 'alexchen',
        email: 'alex.chen@example.com',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Full-stack developer passionate about React and Node.js. Love sharing code insights and learning from the community.',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah.johnson@example.com' },
      update: {},
      create: {
        name: 'Sarah Johnson',
        username: 'sarahj',
        email: 'sarah.johnson@example.com',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: 'Frontend specialist with expertise in modern JavaScript frameworks. Always exploring new ways to improve user experience.',
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike.rodriguez@example.com' },
      update: {},
      create: {
        name: 'Mike Rodriguez',
        username: 'mikerod',
        email: 'mike.rodriguez@example.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: 'Backend engineer focused on scalability and performance. Python and Go enthusiast.',
      },
    }),
    prisma.user.upsert({
      where: { email: 'emma.wilson@example.com' },
      update: {},
      create: {
        name: 'Emma Wilson',
        username: 'emmaw',
        email: 'emma.wilson@example.com',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        bio: 'DevOps engineer and cloud architecture expert. Helping teams build better deployment pipelines.',
      },
    }),
    prisma.user.upsert({
      where: { email: 'david.kim@example.com' },
      update: {},
      create: {
        name: 'David Kim',
        username: 'davidkim',
        email: 'david.kim@example.com',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        bio: 'Mobile app developer specializing in React Native and Flutter. Passionate about cross-platform solutions.',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create topics
  const topics = await Promise.all([
    prisma.topic.upsert({
      where: { name: 'React Performance' },
      update: {},
      create: {
        name: 'React Performance',
        subTopics: ['useMemo', 'useCallback', 'React.memo', 'Code Splitting', 'Bundle Optimization'],
        info: 'Optimizing React applications for better performance and user experience',
        isOfficial: true,
        numPosts: 0,
        viewsCount: 1250,
      },
    }),
    prisma.topic.upsert({
      where: { name: 'Database Optimization' },
      update: {},
      create: {
        name: 'Database Optimization',
        subTopics: ['Indexing', 'Query Optimization', 'Connection Pooling', 'Caching', 'Partitioning'],
        info: 'Techniques and strategies for improving database performance',
        isOfficial: true,
        numPosts: 0,
        viewsCount: 980,
      },
    }),
    prisma.topic.upsert({
      where: { name: 'API Design' },
      update: {},
      create: {
        name: 'API Design',
        subTopics: ['REST', 'GraphQL', 'Rate Limiting', 'Authentication', 'Versioning'],
        info: 'Best practices for designing robust and scalable APIs',
        isOfficial: true,
        numPosts: 0,
        viewsCount: 1150,
      },
    }),
  ]);

  console.log(`✅ Created ${topics.length} topics`);

  // Create posts with realistic data
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Optimizing React Components with useMemo and useCallback',
        code: `import React, { useState, useMemo, useCallback } from 'react';

const ExpensiveComponent = ({ items, onItemClick }) => {
  const [filter, setFilter] = useState('');
  
  // Memoize expensive computation
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  // Memoize callback to prevent child re-renders
  const handleItemClick = useCallback((item) => {
    onItemClick(item.id);
  }, [onItemClick]);
  
  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
      />
      {filteredItems.map(item => (
        <Item 
          key={item.id} 
          item={item} 
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
};`,
        description: 'Learn how to optimize React components using useMemo and useCallback to prevent unnecessary re-renders and improve performance.',
        categories: ['React', 'Performance', 'Optimization'],
        topicId: topics[0].id,
        subTopics: ['useMemo', 'useCallback'],
        authorId: users[0].id,
        username: users[0].username || 'alexchen',
        endorse: 42,
        oppose: 3,
        eoRatio: 14.0,
        endorseRate: 0.933,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Database Indexing Strategies for High-Traffic Applications',
        code: `-- Composite index for common query patterns
CREATE INDEX idx_user_status_created 
ON users (status, created_at DESC);

-- Partial index for frequently queried subset
CREATE INDEX idx_active_users_email 
ON users (email) 
WHERE status = 'active';

-- Covering index to avoid table lookups
CREATE INDEX idx_order_summary 
ON orders (user_id, created_at, total_amount)
INCLUDE (order_number, status);

-- Query optimization example
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.id, u.email, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND u.created_at >= '2024-01-01'
GROUP BY u.id, u.email
ORDER BY order_count DESC
LIMIT 10;`,
        description: 'Comprehensive guide to database indexing strategies that can dramatically improve query performance in high-traffic applications.',
        categories: ['Database', 'Performance', 'SQL'],
        topicId: topics[1].id,
        subTopics: ['Indexing', 'Query Optimization'],
        authorId: users[1].id,
        username: users[1].username || 'sarahj',
        endorse: 38,
        oppose: 2,
        eoRatio: 19.0,
        endorseRate: 0.950,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Building Scalable REST APIs with Node.js and Express',
        code: `const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// API versioning
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    requestId: req.id
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});`,
        description: 'A practical guide to building production-ready REST APIs with proper error handling, rate limiting, and security measures.',
        categories: ['Node.js', 'API', 'Backend'],
        topicId: topics[2].id,
        subTopics: ['REST', 'Authentication', 'Rate Limiting'],
        authorId: users[2].id,
        username: users[2].username || 'mikerod',
        endorse: 35,
        oppose: 5,
        eoRatio: 7.0,
        endorseRate: 0.875,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Advanced React Hook Patterns for State Management',
        code: `import { useReducer, useCallback, useMemo } from 'react';

// Custom hook for complex state management
const useComplexState = (initialState) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_DATA':
        return { ...state, data: action.payload, loading: false };
      case 'SET_ERROR':
        return { ...state, error: action.payload, loading: false };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => ({
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setData: (data) => dispatch({ type: 'SET_DATA', payload: data }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    reset: () => dispatch({ type: 'RESET' })
  }), []);

  return [state, actions];
};`,
        description: 'Explore advanced React hook patterns for managing complex state in modern applications, including custom hooks and reducer patterns.',
        categories: ['React', 'Hooks', 'State Management'],
        topicId: topics[0].id,
        subTopics: ['useReducer', 'Custom Hooks'],
        authorId: users[3].id,
        username: users[3].username || 'emmaw',
        endorse: 29,
        oppose: 4,
        eoRatio: 7.25,
        endorseRate: 0.879,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Docker Containerization Best Practices',
        code: `# Multi-stage build for optimized images
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["npm", "start"]`,
        description: 'Learn Docker best practices for containerizing Node.js applications with security, optimization, and monitoring considerations.',
        categories: ['Docker', 'DevOps', 'Containerization'],
        topicId: topics[1].id,
        subTopics: ['Docker', 'Security'],
        authorId: users[4].id,
        username: users[4].username || 'davidkim',
        endorse: 33,
        oppose: 1,
        eoRatio: 33.0,
        endorseRate: 0.971,
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  // Create votes for posts (simulating user interactions)
  const voteData: Array<{ userId: string; postId: string; voteType: VoteType }> = [
    // Post 0 votes
    { userId: users[1].id, postId: posts[0].id, voteType: VoteType.ENDORSE },
    { userId: users[2].id, postId: posts[0].id, voteType: VoteType.ENDORSE },
    { userId: users[3].id, postId: posts[0].id, voteType: VoteType.ENDORSE },
    
    // Post 1 votes
    { userId: users[0].id, postId: posts[1].id, voteType: VoteType.ENDORSE },
    { userId: users[2].id, postId: posts[1].id, voteType: VoteType.ENDORSE },
    { userId: users[3].id, postId: posts[1].id, voteType: VoteType.ENDORSE },
    
    // Post 2 votes
    { userId: users[0].id, postId: posts[2].id, voteType: VoteType.ENDORSE },
    { userId: users[1].id, postId: posts[2].id, voteType: VoteType.ENDORSE },
    { userId: users[3].id, postId: posts[2].id, voteType: VoteType.ENDORSE },
    
    // Post 3 votes
    { userId: users[0].id, postId: posts[3].id, voteType: VoteType.ENDORSE },
    { userId: users[1].id, postId: posts[3].id, voteType: VoteType.ENDORSE },
    { userId: users[2].id, postId: posts[3].id, voteType: VoteType.ENDORSE },
    
    // Post 4 votes
    { userId: users[0].id, postId: posts[4].id, voteType: VoteType.ENDORSE },
    { userId: users[1].id, postId: posts[4].id, voteType: VoteType.ENDORSE },
    { userId: users[2].id, postId: posts[4].id, voteType: VoteType.ENDORSE },
    
    // Add some oppose votes (unique combinations)
    { userId: users[4].id, postId: posts[0].id, voteType: VoteType.OPPOSE },
    { userId: users[4].id, postId: posts[1].id, voteType: VoteType.OPPOSE },
    { userId: users[4].id, postId: posts[2].id, voteType: VoteType.OPPOSE },
    { userId: users[4].id, postId: posts[3].id, voteType: VoteType.OPPOSE },
    { userId: users[3].id, postId: posts[4].id, voteType: VoteType.OPPOSE },
  ];

  // Create votes
  await Promise.all(
    voteData.map(vote => 
      prisma.vote.create({
        data: vote,
      })
    )
  );

  console.log(`✅ Created ${voteData.length} votes`);

  // Create comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        postId: posts[0].id,
        authorId: users[1].id,
        content: 'Great explanation of useMemo and useCallback! I\'ve been struggling with unnecessary re-renders in my app. This really helps.',
      },
    }),
    prisma.comment.create({
      data: {
        postId: posts[0].id,
        authorId: users[2].id,
        content: 'One thing to add: be careful not to over-optimize. Sometimes the memoization overhead can be worse than the re-render cost.',
      },
    }),
    prisma.comment.create({
      data: {
        postId: posts[1].id,
        authorId: users[0].id,
        content: 'Excellent examples! The covering index tip is particularly useful for complex queries.',
      },
    }),
    prisma.comment.create({
      data: {
        postId: posts[2].id,
        authorId: users[3].id,
        content: 'Love the security considerations here. Helmet and rate limiting are essential for production APIs.',
      },
    }),
    prisma.comment.create({
      data: {
        postId: posts[3].id,
        authorId: users[4].id,
        content: 'This custom hook pattern is exactly what I needed for my complex form state. Thanks for sharing!',
      },
    }),
  ]);

  console.log(`✅ Created ${comments.length} comments`);

  // Update topic post counts
  await Promise.all(
    topics.map(topic => 
      prisma.topic.update({
        where: { id: topic.id },
        data: {
          numPosts: posts.filter(p => p.topicId === topic.id).length,
          postIds: posts.filter(p => p.topicId === topic.id).map(p => p.id),
        },
      })
    )
  );

  console.log('🎉 Enhanced database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
