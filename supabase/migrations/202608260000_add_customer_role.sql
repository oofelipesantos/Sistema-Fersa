-- PostgreSQL enum values must be committed before later migrations can use them.
alter type public.user_role add value if not exists 'CUSTOMER';
