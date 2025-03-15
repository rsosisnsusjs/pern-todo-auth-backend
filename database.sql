CREATE DATABASE authtodolist;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- สร้างตาราง users
CREATE TABLE public.users (
    user_id UUID DEFAULT uuid_generate_v4() NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_user_email_key UNIQUE (user_email)
);

-- สร้างตาราง todos
CREATE TABLE public.todos (
    todo_id SERIAL NOT NULL,
    user_id UUID,
    description VARCHAR(255) NOT NULL,
    due_date TIMESTAMP,
    notified BOOLEAN DEFAULT false,
    CONSTRAINT todos_pkey PRIMARY KEY (todo_id),
    CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (user_id)
);


CREATE TABLE public.done_todos (
    todo_id SERIAL NOT NULL,
    user_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    due_date TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT done_todos_pkey PRIMARY KEY (todo_id),
    CONSTRAINT done_todos_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


