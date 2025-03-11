CREATE DATABASE authtodolist;

--users

CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

--todos

CREATE TABLE todos(
    todo_id SERIAL,
    user_id UUID,
    description VARCHAR(255) NOT NULL,
    PRIMARY KEY (todo_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- mock users data

insert into users (user_name, user_email, user_password) values ('junior', 'junior@gmail.com', 'junior');

-- mock todos data

insert into todos (user_id, description) values ('78d54b88-b522-489e-9898-5ac6d5b09206', 'I have to clean my room');