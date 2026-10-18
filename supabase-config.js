'use strict';
// Configuração PÚBLICA do Supabase (a chave "anon" é feita para ficar no navegador).
// A proteção real dos dados está nas políticas RLS da tabela hospital_dados (supabase/schema.sql).
// NUNCA coloque aqui a chave "service_role".
// Para jogar só neste computador, sem nuvem, deixe os dois valores vazios ('').
window.HospitalConfig = Object.freeze({
  supabaseUrl: 'https://cbijxuiqmiodzfthuuqn.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiaWp4dWlxbWlvZHpmdGh1dXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NDkyODgsImV4cCI6MjEwNzMyNTI4OH0.bd5NP4M3CBNHj8m2uDAb9QqRymCAwu9EzdsxdZxBc68'
});
