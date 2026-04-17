-- Profiles table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text unique not null,
  phone text,
  profile_picture text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  caption text not null,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Post Media table (One post can have multiple media)
CREATE TABLE IF NOT EXISTS post_media (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  media_type text not null, -- 'image' or 'video'
  media_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, post_id)
);

-- Followers table
CREATE TABLE IF NOT EXISTS followers (
  follower_id uuid references profiles(id) on delete cascade not null,
  followed_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, followed_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
