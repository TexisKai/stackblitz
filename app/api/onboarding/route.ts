import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {}, 
        remove(name: string, options) {},
      },
    }
  );

  const body = await req.json();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { step, name, course, year, phone, bio, college, gender, age, skills, interests } = body;

  const updateData: any = { onboarding_step: step };
  if (name) updateData.full_name = name;
  if (course) updateData.course = course;
  if (year) updateData.year = year;
  if (phone) updateData.phone = phone;
  if (bio) updateData.bio = bio;
  if (college) updateData.college = college;
  if (gender) updateData.gender = gender;
  if (age) updateData.age = age;
  if (skills) updateData.skills = skills;
  if (interests) updateData.interests = interests;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}