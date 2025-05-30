-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('creator', 'consumer')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ORGANIZATIONS TABLE
CREATE TABLE organizations (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    creator_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- MODELS TABLE
CREATE TABLE models (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- MODEL MODERATORS TABLE
CREATE TABLE model_moderators (
    model_id UUID REFERENCES models(id),
    moderator_id UUID REFERENCES users(id),
    PRIMARY KEY (model_id, moderator_id)
);

-- POSTS TABLE
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    model_id UUID REFERENCES models(id),
    content TEXT,
    type TEXT CHECK (type IN ('free', 'paid_once', 'member_only')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- POST LIKES TABLE
CREATE TABLE post_likes (
    user_id UUID REFERENCES users(id),
    post_id UUID REFERENCES posts(id),
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

-- POST COMMENTS TABLE
CREATE TABLE post_comments (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    user_id UUID REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- SUBSCRIPTIONS TABLE
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    model_id UUID REFERENCES models(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- PAYMENTS TABLE
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    amount NUMERIC(10, 2),
    payment_type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PAID POST UNLOCKS TABLE
CREATE TABLE paid_post_unlocks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    post_id UUID REFERENCES posts(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- CONVERSATIONS TABLE
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CONVERSATION PARTICIPANTS TABLE
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    participant_id UUID,
    participant_type TEXT CHECK (participant_type IN ('user', 'model')),
    UNIQUE (conversation_id, participant_id, participant_type)
);

-- CHAT MESSAGES TABLE
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    sender_id UUID,
    sender_type TEXT CHECK (sender_type IN ('user', 'model')),
    message TEXT,
    sent_at TIMESTAMP DEFAULT NOW()
);
