
create policy "media read signed-in" on storage.objects for select to authenticated using (bucket_id = 'media');
create policy "media upload own folder" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "media update own" on storage.objects for update to authenticated using (bucket_id = 'media' and owner = auth.uid());
create policy "media delete own or admin" on storage.objects for delete to authenticated using (bucket_id = 'media' and (owner = auth.uid() or public.is_admin()));
