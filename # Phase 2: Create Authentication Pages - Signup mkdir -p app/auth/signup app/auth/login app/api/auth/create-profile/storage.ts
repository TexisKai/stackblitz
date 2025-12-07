import { supabase } from './supabaseBrowser'

export async function uploadIDDocument(
  file: File
): Promise<string> {
  // Check if user is authenticated
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error('You must be logged in to upload files. Please refresh and try again.');
  }

  const userId = session.user.id;

  // Validate file
  if (!file) {
    throw new Error('No file selected');
  }

  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  // Check file type
  const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Only PDF, JPG, and PNG files are allowed');
  }

  // Create unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  console.log('Uploading file:', fileName);
  console.log('File size:', file.size);
  console.log('File type:', file.type);

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('student-documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  console.log('Upload success:', data);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('student-documents')
    .getPublicUrl(fileName);

  return publicUrl;
}
