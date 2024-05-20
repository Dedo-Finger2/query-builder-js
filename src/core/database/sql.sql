CREATE TABLE public.users (
	id serial4 NOT NULL,
	"name" varchar(100) NULL,
	email varchar(100) NULL,
	age int4 NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.orders (
	id serial4 NOT NULL,
	user_id int4 NULL,
	product_name varchar(100) NULL,
	quantity int4 NULL,
	CONSTRAINT orders_pkey PRIMARY KEY (id)
);

