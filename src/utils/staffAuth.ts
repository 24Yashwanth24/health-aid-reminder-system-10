
import { supabase } from '@/integrations/supabase/client';

// Function to handle staff login
export const loginStaff = async (email: string, password: string) => {
  // Check if the staff exists in the staff table with matching email and password
  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('*')
    .eq('email', email)
    .eq('Pwd', password)
    .single();

  if (staffError || !staffData) {
    throw new Error('Invalid credentials. Please check your email and password.');
  }
  
  // Store staff info in local storage
  storeStaffInfo(staffData);
  
  return staffData;
};

// Function to handle staff registration
export const registerStaff = async (
  name: string,
  email: string,
  password: string,
  department?: string,
  phone?: string
) => {
  // Check if this staff already exists
  const { data: existingStaff, error: staffCheckError } = await supabase
    .from('staff')
    .select('*')
    .eq('email', email)
    .single();

  if (existingStaff) {
    // Staff exists, check password
    if (existingStaff.Pwd === password) {
      // Password matches, log them in
      storeStaffInfo(existingStaff);
      return existingStaff;
    } else {
      throw new Error('A staff with this email already exists. Please use a different email or try to log in.');
    }
  }

  // Insert new staff
  const { data: newStaffData, error: insertError } = await supabase
    .from('staff')
    .insert({
      name,
      email,
      department: department || null,
      phone: phone || null,
      Pwd: password,
      user_id: crypto.randomUUID()
    })
    .select();
    
  if (insertError) {
    throw new Error(`Staff registration error: ${insertError.message}`);
  }
  
  // Store staff info in local storage
  storeStaffInfo(newStaffData[0]);
  
  return newStaffData[0];
};

// Store staff info in local storage
export const storeStaffInfo = (staffData: any) => {
  localStorage.setItem('authType', 'staff');
  localStorage.setItem('authEmail', staffData.email);
  localStorage.setItem('staffName', staffData.name);
  localStorage.setItem('staffId', staffData.id);
};
