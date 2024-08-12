--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2024-08-13 02:47:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16442)
-- Name: otp_storage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otp_storage (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    otp character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.otp_storage OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16441)
-- Name: otp_storage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.otp_storage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.otp_storage_id_seq OWNER TO postgres;

--
-- TOC entry 3345 (class 0 OID 0)
-- Dependencies: 216
-- Name: otp_storage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.otp_storage_id_seq OWNED BY public.otp_storage.id;


--
-- TOC entry 218 (class 1259 OID 24590)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16431)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16430)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 3346 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3183 (class 2604 OID 16445)
-- Name: otp_storage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_storage ALTER COLUMN id SET DEFAULT nextval('public.otp_storage_id_seq'::regclass);


--
-- TOC entry 3182 (class 2604 OID 16434)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3338 (class 0 OID 16442)
-- Dependencies: 217
-- Data for Name: otp_storage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otp_storage (id, email, otp, created_at, username, password) FROM stdin;
114	u22cs114@coed.svnit.ac.in	119438	2024-06-26 15:20:56.612367	jigar	45678
116	u22cs114@coed.svnit.ac.in	442934	2024-06-26 15:36:48.153171	jigar	56789
124	nxrqi@telegmail.com	368971	2024-06-26 16:15:02.860989	jigar	678
126	nxrqi@telegmail.com	691659	2024-06-26 16:22:33.34718	LUFFYKOP	6
136	u22cs114@coed.svnit.ac.in	753845	2024-06-29 19:05:35.211595	jigar	634859
138	u22cs114@coed.svnit.ac.in	488200	2024-06-29 19:08:47.492881	jigar	634859
139	ajaysolanki302003@gmail.com	438718	2024-08-04 17:34:33.096215	ajay	5789
140	ajaysolanki302003@gmail.com	747446	2024-08-04 17:35:06.722997	ajay	5789
150	kushagrak1610@gmail.com	630937	2024-08-13 00:41:53.426111	kushagra	1234
151	kushagrak1610@gmail.com	140079	2024-08-13 00:41:55.974819	kushagra	1234
\.


--
-- TOC entry 3339 (class 0 OID 24590)
-- Dependencies: 218
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
UEH176S9Yraqh-OGOooKKOjlwrElN7Pe	{"cookie":{"originalMaxAge":3600000,"expires":"2024-08-12T22:03:30.503Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":51,"username":"kushagra"}}	2024-08-13 03:33:31
\.


--
-- TOC entry 3336 (class 0 OID 16431)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, username, password) FROM stdin;
51	kushagrak1610@gmail.com	kushagra	1234
\.


--
-- TOC entry 3347 (class 0 OID 0)
-- Dependencies: 216
-- Name: otp_storage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otp_storage_id_seq', 152, true);


--
-- TOC entry 3348 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 51, true);


--
-- TOC entry 3190 (class 2606 OID 16448)
-- Name: otp_storage otp_storage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_storage
    ADD CONSTRAINT otp_storage_pkey PRIMARY KEY (id);


--
-- TOC entry 3192 (class 2606 OID 24596)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 3186 (class 2606 OID 16440)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3188 (class 2606 OID 16438)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


-- Completed on 2024-08-13 02:47:50

--
-- PostgreSQL database dump complete
--

