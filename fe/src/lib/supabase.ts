import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ttfqyqnyjxnvyqbqxcda.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZnF5cW55anhudnlxYnF4Y2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxODM4NDIsImV4cCI6MjEwMTc1OTg0Mn0.2MSA4qAgVOvn7q7cOkoo079Wff5vf4nCuE4iZKjdxo0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
