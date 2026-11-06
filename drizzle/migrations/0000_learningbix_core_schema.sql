
-- ===================== TYPES =====================
create type public.app_role as enum ('admin','school_admin','franchise','teacher','student','parent');

-- ===================== IDENTITY =====================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text,
  phone text,
  avatar_url text,
  city text,
  state text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
create index on public.user_roles(user_id);

-- ===================== ORGANISATIONS =====================
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text, phone text, address text, city text, state text,
  owner_id uuid,
  package text not null default 'starter',
  status text not null default 'active',
  created_at timestamptz not null default now()
);
create index on public.schools(owner_id);
create table public.franchises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid,
  email text, phone text, address text, city text, state text,
  status text not null default 'active',
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.franchises(owner_id);

-- ===================== CATALOG: COURSES =====================
create table public.course_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  position int not null default 0
);
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.course_categories(id) on delete set null,
  slug text not null unique,
  title text not null,
  short_description text,
  description text,
  image_url text,
  age_group text,
  duration text,
  level text not null default 'Beginner',
  price numeric(10,2) not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index on public.courses(category_id);
create table public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position int not null default 0
);
create index on public.course_modules(course_id);
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  content text,
  video_url text,
  pdf_url text,
  duration_minutes int not null default 10,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index on public.lessons(module_id);

-- ===================== PEOPLE =====================
create table public.parents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  full_name text not null,
  email text, phone text,
  created_at timestamptz not null default now()
);
create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  school_id uuid references public.schools(id) on delete set null,
  franchise_id uuid references public.franchises(id) on delete set null,
  full_name text not null,
  email text, phone text,
  qualification text,
  experience_years int not null default 0,
  specialization text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);
create index on public.teachers(user_id);
create index on public.teachers(school_id);
create index on public.teachers(franchise_id);
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  grade text, section text,
  school_id uuid references public.schools(id) on delete cascade,
  franchise_id uuid references public.franchises(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on public.classes(school_id);
create index on public.classes(teacher_id);
create table public.batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  course_id uuid references public.courses(id) on delete set null,
  teacher_id uuid references public.teachers(id) on delete set null,
  school_id uuid references public.schools(id) on delete cascade,
  franchise_id uuid references public.franchises(id) on delete cascade,
  schedule text, timing text, room text,
  capacity int not null default 20,
  start_date date,
  status text not null default 'active',
  created_at timestamptz not null default now()
);
create index on public.batches(teacher_id);
create index on public.batches(franchise_id);
create index on public.batches(school_id);
create sequence public.student_code_seq start 1001;
create table public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  parent_id uuid references public.parents(id) on delete set null,
  school_id uuid references public.schools(id) on delete set null,
  franchise_id uuid references public.franchises(id) on delete set null,
  class_id uuid references public.classes(id) on delete set null,
  student_code text not null unique default ('LBX' || to_char(now(), 'YY') || nextval('public.student_code_seq')::text),
  full_name text not null,
  email text, phone text,
  age int, grade text,
  guardian_name text, guardian_phone text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);
create index on public.students(parent_id);
create index on public.students(school_id);
create index on public.students(franchise_id);
create index on public.students(class_id);

-- ===================== LEARNING =====================
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  status text not null default 'active',
  progress int not null default 0,
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (student_id, course_id)
);
create index on public.enrollments(course_id);
create index on public.enrollments(batch_id);
create table public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  teacher_id uuid references public.teachers(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  max_marks int not null default 100,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create index on public.assignments(course_id);
create index on public.assignments(teacher_id);
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  content text,
  file_url text,
  status text not null default 'submitted',
  marks int,
  feedback text,
  submitted_at timestamptz not null default now(),
  graded_at timestamptz,
  unique (assignment_id, student_id)
);
create index on public.submissions(student_id);
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  title text not null,
  description text,
  pass_mark int not null default 60,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create index on public.quizzes(course_id);
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_index int not null default 0,
  position int not null default 0
);
create index on public.quiz_questions(quiz_id);
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  answers jsonb not null default '[]'::jsonb,
  score int not null default 0,
  total int not null default 0,
  created_at timestamptz not null default now()
);
create index on public.quiz_attempts(student_id);
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  class_id uuid references public.classes(id) on delete set null,
  date date not null default current_date,
  status text not null default 'present',
  marked_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create index on public.attendance(student_id);
create index on public.attendance(batch_id, date);

-- ===================== STORE =====================
create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  position int not null default 0
);
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.product_categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  short_description text,
  description text,
  price numeric(10,2) not null,
  mrp numeric(10,2) not null,
  rating numeric(2,1) not null default 4.5,
  reviews_count int not null default 0,
  age_group text,
  image_url text,
  specifications jsonb not null default '{}'::jsonb,
  box_contents text[] not null default '{}',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index on public.products(category_id);
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  position int not null default 0
);
create index on public.product_images(product_id);
create table public.inventory (
  product_id uuid primary key references public.products(id) on delete cascade,
  stock int not null default 0,
  updated_at timestamptz not null default now()
);
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  updated_at timestamptz not null default now()
);
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity int not null default 1 check (quantity between 1 and 99),
  unique (cart_id, product_id)
);
create sequence public.order_number_seq start 10001;
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  order_number text not null unique default ('LBX-' || nextval('public.order_number_seq')::text),
  status text not null default 'pending',
  payment_status text not null default 'pending',
  payment_method text not null default 'razorpay',
  subtotal numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  customer_name text, customer_email text, customer_phone text,
  address_line text, city text, state text, pincode text,
  razorpay_order_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.orders(user_id);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  image_url text,
  price numeric(10,2) not null,
  quantity int not null
);
create index on public.order_items(order_id);
create sequence public.receipt_seq start 5001;
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  user_id uuid,
  student_id uuid references public.students(id) on delete set null,
  franchise_id uuid references public.franchises(id) on delete set null,
  school_id uuid references public.schools(id) on delete set null,
  purpose text not null default 'order',
  description text,
  amount numeric(10,2) not null,
  currency text not null default 'INR',
  method text,
  provider text not null default 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  status text not null default 'pending',
  receipt_number text not null unique default ('RCPT-' || nextval('public.receipt_seq')::text),
  due_date date,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.payments(user_id);
create index on public.payments(student_id);
create index on public.payments(franchise_id);
create index on public.payments(order_id);

-- ===================== CERTIFICATES & LEADS =====================
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  certificate_code text not null unique default ('LBX-CERT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  issued_at timestamptz not null default now(),
  issued_by uuid,
  unique (student_id, course_id)
);
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text, phone text, subject text, message text,
  source text not null default 'contact',
  child_name text, child_age int, program text,
  franchise_id uuid references public.franchises(id) on delete set null,
  status text not null default 'new',
  follow_up_date date,
  notes text,
  converted_student_id uuid references public.students(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on public.enquiries(franchise_id);
create table public.franchise_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_name text not null,
  email text not null, phone text not null,
  city text, state text,
  business_experience text, investment_capacity text, message text,
  status text not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now()
);
create table public.school_applications (
  id uuid primary key default gen_random_uuid(),
  school_name text not null,
  school_email text not null,
  contact_person text not null,
  phone text not null,
  address text, city text, state text, message text,
  status text not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now()
);
create table public.trial_bookings (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  child_name text not null,
  child_age int not null,
  email text not null, phone text not null,
  preferred_program text not null,
  preferred_date date not null,
  preferred_time text not null,
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.notifications(user_id, created_at desc);

-- ===================== HELPER FUNCTIONS =====================
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin')
$$;
create or replace function public.owns_school(_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.schools where id = _id and owner_id = auth.uid())
$$;
create or replace function public.owns_franchise(_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.franchises where id = _id and owner_id = auth.uid())
$$;
create or replace function public.can_manage_org(_school uuid, _franchise uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin()
    or (_school is not null and public.owns_school(_school))
    or (_franchise is not null and public.owns_franchise(_franchise))
$$;
create or replace function public.my_teacher_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select id from public.teachers where user_id = auth.uid()
$$;
create or replace function public.my_student_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select id from public.students where user_id = auth.uid()
  union
  select s.id from public.students s join public.parents p on p.id = s.parent_id where p.user_id = auth.uid()
$$;
create or replace function public.can_manage_student(_sid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.students s where s.id = _sid and public.can_manage_org(s.school_id, s.franchise_id))
$$;
create or replace function public.teaches_student(_sid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.enrollments e join public.batches b on b.id = e.batch_id
    where e.student_id = _sid and b.teacher_id in (select public.my_teacher_ids())
  ) or exists (
    select 1 from public.students s join public.classes c on c.id = s.class_id
    where s.id = _sid and c.teacher_id in (select public.my_teacher_ids())
  )
$$;
create or replace function public.can_view_student(_sid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin()
    or _sid in (select public.my_student_ids())
    or public.can_manage_student(_sid)
    or public.teaches_student(_sid)
$$;
create or replace function public.is_teacher()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'teacher')
$$;

-- ===================== GRANTS =====================
grant usage on sequence public.student_code_seq, public.order_number_seq, public.receipt_seq to authenticated, service_role;

grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant select, insert, update, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
grant select, insert, update, delete on public.schools, public.franchises to authenticated;
grant all on public.schools, public.franchises to service_role;
grant select on public.course_categories, public.courses, public.course_modules, public.lessons to anon;
grant select, insert, update, delete on public.course_categories, public.courses, public.course_modules, public.lessons to authenticated;
grant all on public.course_categories, public.courses, public.course_modules, public.lessons to service_role;
grant select, insert, update, delete on public.parents, public.teachers, public.classes, public.batches, public.students to authenticated;
grant all on public.parents, public.teachers, public.classes, public.batches, public.students to service_role;
grant select, insert, update, delete on public.enrollments, public.learning_progress, public.assignments, public.submissions, public.quizzes, public.quiz_questions, public.quiz_attempts, public.attendance to authenticated;
grant all on public.enrollments, public.learning_progress, public.assignments, public.submissions, public.quizzes, public.quiz_questions, public.quiz_attempts, public.attendance to service_role;
grant select on public.product_categories, public.products, public.product_images, public.inventory to anon;
grant select, insert, update, delete on public.product_categories, public.products, public.product_images, public.inventory to authenticated;
grant all on public.product_categories, public.products, public.product_images, public.inventory to service_role;
grant select, insert, update, delete on public.carts, public.cart_items to authenticated;
grant all on public.carts, public.cart_items to service_role;
grant select, update on public.orders to authenticated;
grant select on public.order_items to authenticated;
grant all on public.orders, public.order_items to service_role;
grant select, insert, update, delete on public.payments, public.certificates to authenticated;
grant all on public.payments, public.certificates to service_role;
grant insert on public.enquiries, public.franchise_applications, public.school_applications, public.trial_bookings to anon;
grant select, insert, update, delete on public.enquiries, public.franchise_applications, public.school_applications, public.trial_bookings to authenticated;
grant all on public.enquiries, public.franchise_applications, public.school_applications, public.trial_bookings to service_role;
grant select, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;

-- ===================== RLS =====================
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.schools enable row level security;
alter table public.franchises enable row level security;
alter table public.course_categories enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.parents enable row level security;
alter table public.teachers enable row level security;
alter table public.classes enable row level security;
alter table public.batches enable row level security;
alter table public.students enable row level security;
alter table public.enrollments enable row level security;
alter table public.learning_progress enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.attendance enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.certificates enable row level security;
alter table public.enquiries enable row level security;
alter table public.franchise_applications enable row level security;
alter table public.school_applications enable row level security;
alter table public.trial_bookings enable row level security;
alter table public.notifications enable row level security;

-- profiles
create policy "profiles read own or admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles update own or admin" on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- user_roles
create policy "roles read own or admin" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "roles admin insert" on public.user_roles for insert to authenticated with check (public.is_admin());
create policy "roles admin update" on public.user_roles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "roles admin delete" on public.user_roles for delete to authenticated using (public.is_admin());

-- schools / franchises
create policy "schools read" on public.schools for select to authenticated using (public.is_admin() or owner_id = auth.uid() or id in (select school_id from public.teachers where user_id = auth.uid()));
create policy "schools admin insert" on public.schools for insert to authenticated with check (public.is_admin());
create policy "schools update" on public.schools for update to authenticated using (public.is_admin() or owner_id = auth.uid()) with check (public.is_admin() or owner_id = auth.uid());
create policy "schools admin delete" on public.schools for delete to authenticated using (public.is_admin());
create policy "franchises read" on public.franchises for select to authenticated using (public.is_admin() or owner_id = auth.uid() or id in (select franchise_id from public.teachers where user_id = auth.uid()));
create policy "franchises admin insert" on public.franchises for insert to authenticated with check (public.is_admin());
create policy "franchises update" on public.franchises for update to authenticated using (public.is_admin() or owner_id = auth.uid()) with check (public.is_admin() or owner_id = auth.uid());
create policy "franchises admin delete" on public.franchises for delete to authenticated using (public.is_admin());

-- course catalog (public read)
create policy "categories public read" on public.course_categories for select to anon, authenticated using (true);
create policy "categories admin write" on public.course_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "courses public read" on public.courses for select to anon, authenticated using (is_published or public.is_admin() or public.is_teacher());
create policy "courses admin insert" on public.courses for insert to authenticated with check (public.is_admin());
create policy "courses admin update" on public.courses for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "courses admin delete" on public.courses for delete to authenticated using (public.is_admin());
create policy "modules public read" on public.course_modules for select to anon, authenticated using (true);
create policy "modules staff write" on public.course_modules for all to authenticated using (public.is_admin() or public.is_teacher()) with check (public.is_admin() or public.is_teacher());
create policy "lessons public read" on public.lessons for select to anon, authenticated using (true);
create policy "lessons staff write" on public.lessons for all to authenticated using (public.is_admin() or public.is_teacher()) with check (public.is_admin() or public.is_teacher());

-- parents
create policy "parents read" on public.parents for select to authenticated using (user_id = auth.uid() or public.is_admin() or exists (select 1 from public.students s where s.parent_id = parents.id and public.can_manage_org(s.school_id, s.franchise_id)));
create policy "parents insert" on public.parents for insert to authenticated with check (user_id = auth.uid() or public.is_admin() or public.has_role(auth.uid(), 'school_admin') or public.has_role(auth.uid(), 'franchise'));
create policy "parents update" on public.parents for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "parents admin delete" on public.parents for delete to authenticated using (public.is_admin());

-- teachers
create policy "teachers read" on public.teachers for select to authenticated using (user_id = auth.uid() or public.can_manage_org(school_id, franchise_id) or exists (select 1 from public.batches b where b.teacher_id = teachers.id and b.id in (select e.batch_id from public.enrollments e where e.student_id in (select public.my_student_ids()))));
create policy "teachers insert" on public.teachers for insert to authenticated with check (public.can_manage_org(school_id, franchise_id));
create policy "teachers update" on public.teachers for update to authenticated using (public.can_manage_org(school_id, franchise_id) or user_id = auth.uid()) with check (public.can_manage_org(school_id, franchise_id) or user_id = auth.uid());
create policy "teachers delete" on public.teachers for delete to authenticated using (public.can_manage_org(school_id, franchise_id));

-- classes
create policy "classes read" on public.classes for select to authenticated using (public.can_manage_org(school_id, franchise_id) or teacher_id in (select public.my_teacher_ids()) or id in (select class_id from public.students where id in (select public.my_student_ids())));
create policy "classes write" on public.classes for insert to authenticated with check (public.can_manage_org(school_id, franchise_id));
create policy "classes update" on public.classes for update to authenticated using (public.can_manage_org(school_id, franchise_id)) with check (public.can_manage_org(school_id, franchise_id));
create policy "classes delete" on public.classes for delete to authenticated using (public.can_manage_org(school_id, franchise_id));

-- batches
create policy "batches read" on public.batches for select to authenticated using (public.can_manage_org(school_id, franchise_id) or teacher_id in (select public.my_teacher_ids()) or id in (select batch_id from public.enrollments where student_id in (select public.my_student_ids())));
create policy "batches insert" on public.batches for insert to authenticated with check (public.can_manage_org(school_id, franchise_id));
create policy "batches update" on public.batches for update to authenticated using (public.can_manage_org(school_id, franchise_id)) with check (public.can_manage_org(school_id, franchise_id));
create policy "batches delete" on public.batches for delete to authenticated using (public.can_manage_org(school_id, franchise_id));

-- students
create policy "students read" on public.students for select to authenticated using (public.can_view_student(id));
create policy "students insert" on public.students for insert to authenticated with check (public.can_manage_org(school_id, franchise_id) or parent_id in (select id from public.parents where user_id = auth.uid()));
create policy "students update" on public.students for update to authenticated using (public.can_manage_student(id) or user_id = auth.uid() or parent_id in (select id from public.parents where user_id = auth.uid())) with check (public.can_manage_org(school_id, franchise_id) or user_id = auth.uid() or parent_id in (select id from public.parents where user_id = auth.uid()));
create policy "students delete" on public.students for delete to authenticated using (public.can_manage_student(id));

-- enrollments
create policy "enrollments read" on public.enrollments for select to authenticated using (public.can_view_student(student_id));
create policy "enrollments insert" on public.enrollments for insert to authenticated with check (public.can_manage_student(student_id) or student_id in (select public.my_student_ids()));
create policy "enrollments update" on public.enrollments for update to authenticated using (public.can_manage_student(student_id) or public.teaches_student(student_id)) with check (public.can_manage_student(student_id) or public.teaches_student(student_id));
create policy "enrollments delete" on public.enrollments for delete to authenticated using (public.can_manage_student(student_id));

-- learning progress
create policy "progress read" on public.learning_progress for select to authenticated using (public.can_view_student(student_id));
create policy "progress delete own" on public.learning_progress for delete to authenticated using (student_id in (select public.my_student_ids()));

-- assignments
create policy "assignments read" on public.assignments for select to authenticated using (
  public.is_admin() or teacher_id in (select public.my_teacher_ids()) or created_by = auth.uid()
  or exists (select 1 from public.enrollments e where e.course_id = assignments.course_id and e.student_id in (select public.my_student_ids()))
  or exists (select 1 from public.teachers t where t.id = assignments.teacher_id and public.can_manage_org(t.school_id, t.franchise_id))
);
create policy "assignments insert" on public.assignments for insert to authenticated with check (public.is_admin() or public.is_teacher() or public.has_role(auth.uid(), 'school_admin') or public.has_role(auth.uid(), 'franchise'));
create policy "assignments update" on public.assignments for update to authenticated using (public.is_admin() or created_by = auth.uid() or teacher_id in (select public.my_teacher_ids())) with check (public.is_admin() or created_by = auth.uid() or teacher_id in (select public.my_teacher_ids()));
create policy "assignments delete" on public.assignments for delete to authenticated using (public.is_admin() or created_by = auth.uid() or teacher_id in (select public.my_teacher_ids()));

-- submissions
create policy "submissions read" on public.submissions for select to authenticated using (
  public.can_view_student(student_id)
  or exists (select 1 from public.assignments a where a.id = submissions.assignment_id and (a.created_by = auth.uid() or a.teacher_id in (select public.my_teacher_ids())))
);
create policy "submissions insert own" on public.submissions for insert to authenticated with check (student_id in (select public.my_student_ids()) and status = 'submitted' and marks is null);
create policy "submissions grade" on public.submissions for update to authenticated using (
  public.is_admin() or exists (select 1 from public.assignments a where a.id = submissions.assignment_id and (a.created_by = auth.uid() or a.teacher_id in (select public.my_teacher_ids())))
) with check (true);
create policy "submissions delete" on public.submissions for delete to authenticated using (public.is_admin());

-- quizzes
create policy "quizzes read" on public.quizzes for select to authenticated using (true);
create policy "quizzes insert" on public.quizzes for insert to authenticated with check (public.is_admin() or public.is_teacher());
create policy "quizzes update" on public.quizzes for update to authenticated using (public.is_admin() or created_by = auth.uid()) with check (public.is_admin() or created_by = auth.uid());
create policy "quizzes delete" on public.quizzes for delete to authenticated using (public.is_admin() or created_by = auth.uid());
create policy "questions staff read" on public.quiz_questions for select to authenticated using (public.is_admin() or public.is_teacher());
create policy "questions staff insert" on public.quiz_questions for insert to authenticated with check (public.is_admin() or exists (select 1 from public.quizzes q where q.id = quiz_id and q.created_by = auth.uid()));
create policy "questions staff update" on public.quiz_questions for update to authenticated using (public.is_admin() or exists (select 1 from public.quizzes q where q.id = quiz_id and q.created_by = auth.uid())) with check (true);
create policy "questions staff delete" on public.quiz_questions for delete to authenticated using (public.is_admin() or exists (select 1 from public.quizzes q where q.id = quiz_id and q.created_by = auth.uid()));
create policy "attempts read" on public.quiz_attempts for select to authenticated using (public.can_view_student(student_id) or exists (select 1 from public.quizzes q where q.id = quiz_id and q.created_by = auth.uid()));

-- attendance
create policy "attendance read" on public.attendance for select to authenticated using (public.can_view_student(student_id) or marked_by = auth.uid());
create policy "attendance insert" on public.attendance for insert to authenticated with check (public.teaches_student(student_id) or public.can_manage_student(student_id));
create policy "attendance update" on public.attendance for update to authenticated using (public.teaches_student(student_id) or public.can_manage_student(student_id)) with check (public.teaches_student(student_id) or public.can_manage_student(student_id));
create policy "attendance delete" on public.attendance for delete to authenticated using (public.teaches_student(student_id) or public.can_manage_student(student_id));

-- store catalog
create policy "pcat public read" on public.product_categories for select to anon, authenticated using (true);
create policy "pcat admin write" on public.product_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products public read" on public.products for select to anon, authenticated using (is_active or public.is_admin());
create policy "products admin write" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "pimages public read" on public.product_images for select to anon, authenticated using (true);
create policy "pimages admin write" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "inventory public read" on public.inventory for select to anon, authenticated using (true);
create policy "inventory admin write" on public.inventory for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- carts
create policy "carts own" on public.carts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "cart items own" on public.cart_items for all to authenticated using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())) with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));

-- orders
create policy "orders read" on public.orders for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "orders admin update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "order items read" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));

-- payments
create policy "payments read" on public.payments for select to authenticated using (
  user_id = auth.uid() or public.is_admin()
  or (franchise_id is not null and public.owns_franchise(franchise_id))
  or (school_id is not null and public.owns_school(school_id))
  or (student_id is not null and (student_id in (select public.my_student_ids()) or public.can_manage_student(student_id)))
);
create policy "payments insert" on public.payments for insert to authenticated with check (public.can_manage_org(school_id, franchise_id) or (student_id is not null and public.can_manage_student(student_id)));
create policy "payments update" on public.payments for update to authenticated using (public.can_manage_org(school_id, franchise_id)) with check (public.can_manage_org(school_id, franchise_id));
create policy "payments delete" on public.payments for delete to authenticated using (public.is_admin());

-- certificates
create policy "certificates read" on public.certificates for select to authenticated using (public.can_view_student(student_id));
create policy "certificates insert" on public.certificates for insert to authenticated with check (public.can_manage_student(student_id) or public.teaches_student(student_id));
create policy "certificates delete" on public.certificates for delete to authenticated using (public.is_admin());

-- public lead forms
create policy "enquiries public insert" on public.enquiries for insert to anon, authenticated with check (status = 'new' and char_length(name) between 1 and 120 and coalesce(char_length(message), 0) <= 2000 and notes is null and converted_student_id is null);
create policy "enquiries staff read" on public.enquiries for select to authenticated using (public.is_admin() or (franchise_id is not null and public.owns_franchise(franchise_id)));
create policy "enquiries staff update" on public.enquiries for update to authenticated using (public.is_admin() or (franchise_id is not null and public.owns_franchise(franchise_id))) with check (public.is_admin() or (franchise_id is not null and public.owns_franchise(franchise_id)));
create policy "enquiries staff delete" on public.enquiries for delete to authenticated using (public.is_admin() or (franchise_id is not null and public.owns_franchise(franchise_id)));
create policy "franchise apps public insert" on public.franchise_applications for insert to anon, authenticated with check (status = 'new' and admin_notes is null and char_length(applicant_name) between 1 and 120 and coalesce(char_length(message), 0) <= 2000);
create policy "franchise apps admin" on public.franchise_applications for select to authenticated using (public.is_admin());
create policy "franchise apps admin update" on public.franchise_applications for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "franchise apps admin delete" on public.franchise_applications for delete to authenticated using (public.is_admin());
create policy "school apps public insert" on public.school_applications for insert to anon, authenticated with check (status = 'new' and admin_notes is null and char_length(school_name) between 1 and 200 and coalesce(char_length(message), 0) <= 2000);
create policy "school apps admin" on public.school_applications for select to authenticated using (public.is_admin());
create policy "school apps admin update" on public.school_applications for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "school apps admin delete" on public.school_applications for delete to authenticated using (public.is_admin());
create policy "trials public insert" on public.trial_bookings for insert to anon, authenticated with check (status = 'new' and notes is null and char_length(parent_name) between 1 and 120 and child_age between 3 and 18);
create policy "trials admin" on public.trial_bookings for select to authenticated using (public.is_admin());
create policy "trials admin update" on public.trial_bookings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "trials admin delete" on public.trial_bookings for delete to authenticated using (public.is_admin());

-- notifications
create policy "notifications own read" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "notifications own update" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications own delete" on public.notifications for delete to authenticated using (user_id = auth.uid());

-- ===================== TRIGGERS & RPCs =====================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _role text := coalesce(new.raw_user_meta_data->>'role', 'student');
  _name text := coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1));
begin
  if _role not in ('student', 'parent') then _role := 'student'; end if;
  insert into public.profiles (id, full_name, email, phone)
  values (new.id, _name, new.email, new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, _role::public.app_role) on conflict do nothing;
  if _role = 'student' then
    insert into public.students (user_id, full_name, email, age)
    values (new.id, _name, new.email, nullif(new.raw_user_meta_data->>'age', '')::int)
    on conflict (user_id) do nothing;
  else
    insert into public.parents (user_id, full_name, email, phone)
    values (new.id, _name, new.email, new.raw_user_meta_data->>'phone')
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.notify_admins(_title text, _body text, _link text)
returns void language sql security definer set search_path = public as $$
  insert into public.notifications (user_id, title, body, link)
  select user_id, _title, _body, _link from public.user_roles where role = 'admin'
$$;
revoke execute on function public.notify_admins(text, text, text) from public, anon, authenticated;

create or replace function public.on_lead_created()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_table_name = 'trial_bookings' then
    perform public.notify_admins('New free trial booking', new.parent_name || ' booked a trial for ' || new.child_name, '/admin/trials');
  elsif tg_table_name = 'enquiries' then
    perform public.notify_admins('New enquiry', new.name || coalesce(': ' || new.subject, ''), '/admin/enquiries');
    if new.franchise_id is not null then
      insert into public.notifications (user_id, title, body, link)
      select owner_id, 'New enquiry', new.name, '/franchise/enquiries' from public.franchises where id = new.franchise_id and owner_id is not null;
    end if;
  elsif tg_table_name = 'franchise_applications' then
    perform public.notify_admins('New franchise application', new.applicant_name || ' from ' || coalesce(new.city, ''), '/admin/franchises');
  elsif tg_table_name = 'school_applications' then
    perform public.notify_admins('New school enquiry', new.school_name, '/admin/schools');
  end if;
  return new;
end;
$$;
create trigger trial_created after insert on public.trial_bookings for each row execute function public.on_lead_created();
create trigger enquiry_created after insert on public.enquiries for each row execute function public.on_lead_created();
create trigger franchise_app_created after insert on public.franchise_applications for each row execute function public.on_lead_created();
create trigger school_app_created after insert on public.school_applications for each row execute function public.on_lead_created();

create or replace function public.on_order_status_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status or new.payment_status is distinct from old.payment_status then
    new.updated_at := now();
    insert into public.notifications (user_id, title, body, link)
    values (new.user_id, 'Order ' || new.order_number || ' updated', 'Status: ' || new.status || ' · Payment: ' || new.payment_status, '/orders');
  end if;
  return new;
end;
$$;
create trigger order_status_change before update on public.orders for each row execute function public.on_order_status_change();

create or replace function public.on_submission_graded()
returns trigger language plpgsql security definer set search_path = public as $$
declare _uid uuid;
begin
  if new.marks is not null and (old.marks is null or new.marks <> old.marks) then
    new.status := 'graded';
    new.graded_at := now();
    select user_id into _uid from public.students where id = new.student_id;
    if _uid is not null then
      insert into public.notifications (user_id, title, body, link)
      values (_uid, 'Assignment graded', 'You scored ' || new.marks, '/student/assignments');
    end if;
  end if;
  return new;
end;
$$;
create trigger submission_graded before update on public.submissions for each row execute function public.on_submission_graded();

-- Mark a lesson complete for the signed-in student; recomputes course progress and issues a certificate at 100%.
create or replace function public.complete_lesson(_lesson_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare
  _sid uuid; _course uuid; _total int; _done int; _pct int;
begin
  select id into _sid from public.students where user_id = auth.uid();
  if _sid is null then raise exception 'No student profile for this account'; end if;
  select m.course_id into _course from public.lessons l join public.course_modules m on m.id = l.module_id where l.id = _lesson_id;
  if _course is null then raise exception 'Lesson not found'; end if;
  if not exists (select 1 from public.enrollments where student_id = _sid and course_id = _course) then
    raise exception 'Enroll in this course first';
  end if;
  insert into public.learning_progress (student_id, lesson_id) values (_sid, _lesson_id) on conflict do nothing;
  select count(*) into _total from public.lessons l join public.course_modules m on m.id = l.module_id where m.course_id = _course;
  select count(*) into _done from public.learning_progress lp join public.lessons l on l.id = lp.lesson_id join public.course_modules m on m.id = l.module_id where m.course_id = _course and lp.student_id = _sid;
  _pct := case when _total = 0 then 0 else least(100, round(100.0 * _done / _total)::int) end;
  update public.enrollments set progress = _pct,
    status = case when _pct >= 100 then 'completed' else 'active' end,
    completed_at = case when _pct >= 100 then coalesce(completed_at, now()) else null end
  where student_id = _sid and course_id = _course;
  if _pct >= 100 then
    insert into public.certificates (student_id, course_id) values (_sid, _course) on conflict do nothing;
    insert into public.notifications (user_id, title, body, link)
    values (auth.uid(), 'Certificate earned!', 'You completed a course. Download your certificate.', '/student/certificates');
  end if;
  return _pct;
end;
$$;
revoke execute on function public.complete_lesson(uuid) from public, anon;
grant execute on function public.complete_lesson(uuid) to authenticated;

-- Questions for a student without the answer key
create or replace function public.get_quiz_questions(_quiz_id uuid)
returns table (id uuid, question text, options jsonb, "position" int)
language sql stable security definer set search_path = public as $$
  select q.id, q.question, q.options, q.position from public.quiz_questions q
  where q.quiz_id = _quiz_id and auth.uid() is not null order by q.position
$$;
revoke execute on function public.get_quiz_questions(uuid) from public, anon;
grant execute on function public.get_quiz_questions(uuid) to authenticated;

-- Score a quiz server-side and record the attempt
create or replace function public.submit_quiz(_quiz_id uuid, _answers jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare _sid uuid; _score int := 0; _total int := 0; r record;
begin
  select id into _sid from public.students where user_id = auth.uid();
  if _sid is null then raise exception 'No student profile for this account'; end if;
  for r in select id, correct_index from public.quiz_questions where quiz_id = _quiz_id loop
    _total := _total + 1;
    if (_answers ->> r.id::text) is not null and (_answers ->> r.id::text)::int = r.correct_index then
      _score := _score + 1;
    end if;
  end loop;
  insert into public.quiz_attempts (quiz_id, student_id, answers, score, total) values (_quiz_id, _sid, _answers, _score, _total);
  return jsonb_build_object('score', _score, 'total', _total);
end;
$$;
revoke execute on function public.submit_quiz(uuid, jsonb) from public, anon;
grant execute on function public.submit_quiz(uuid, jsonb) to authenticated;

-- Public certificate verification by code
create or replace function public.verify_certificate(_code text)
returns table (student_name text, course_title text, issued_at timestamptz)
language sql stable security definer set search_path = public as $$
  select s.full_name, c.title, ce.issued_at from public.certificates ce
  join public.students s on s.id = ce.student_id join public.courses c on c.id = ce.course_id
  where ce.certificate_code = upper(trim(_code))
$$;
grant execute on function public.verify_certificate(text) to anon, authenticated;
