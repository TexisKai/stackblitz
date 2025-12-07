import { createClient } from "./supabaseClient";

export async function uploadIDDocument(file: File) {
  const supabase = createClient();
  // Example: put file into 'id_documents' bucket
  const { data, error } = await supabase.storage
    .from("id_documents")
    .upload(`public/${file.name}`, file);

  if (error) throw error;
  return data;
}
