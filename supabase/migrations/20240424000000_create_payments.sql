
create table public.payments (
    id uuid default gen_random_uuid() primary key,
    patient_name text not null,
    amount numeric not null,
    status text not null check (status in ('pending', 'paid')),
    method text check (method in ('card', 'cash', 'upi')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id)
);

-- Enable RLS
alter table public.payments enable row level security;

-- Create policies
create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users can update their own pending payments"
  on public.payments for update
  using (auth.uid() = user_id)
  with check (status = 'pending');
